import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
// import './Player.css';
import WebRTCAdaptor from '../lib/webrtc_adaptor';
import { BiMicrophone,BiMicrophoneOff, BiPhone, BiPhoneOff} from 'react-icons/bi';
import { FiVideoOff,FiVideo } from 'react-icons/fi';
import Draggable from 'react-draggable'; // The default


export default function KioskControllerAntPublish(props) {
    const { kiosk_id } = props
    const [streamName, setStreamName] = useState(kiosk_id)
    const [remoteVideos, setRemoteVideos] = useState([])
    const [mutedMic, setMutedMic] = useState(false);
    const [videoOn, setVideoOn] = useState(true);
    const [onCall, setOnCall] = useState(false);

    let remoteVideoIndex = 0 ;
    const [token, setToken] = useState('')
    const [pc_config, setPc_config] = useState({
        'iceServers': [{
            'urls': 'stun:stun.l.google.com:19302'
        }]
    });
    const [mediaConstraints, setMediaConstraints] = useState({
        video: true, audio: true
    })
    const [sdpConstraints, setSdpConstraints] = useState({
        OfferToReceiveAudio: false,
        OfferToReceiveVideo: false
    })
    const [websocketURL, setWebsocketURL] = useState(`wss://${process.env.NEXT_PUBLIC_MEDIA_SERVER_DOMAIN}:${process.env.NEXT_PUBLIC_MEDIA_SERVER_SECURE_PORT}/WebRTCAppEE/websocket`)  //ADD ENV AM_SERVER_URL 
    const [isShow, setIsShow] = useState(false);
    const [webRTCAdaptor, setWebRTCAdaptor] = useState(null)
    const [connectionError, setConnectionError] = useState(false)
    const [connected, setConnected] = useState(false)
    const [showVod, setShowVod] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        let videox = document.querySelector(`#localVideo${kiosk_id}`);
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function (stream) {
                    videox.srcObject = stream;
                })
                .catch(function (err0r) {
                    console.log("Something went wrong!");
                });
        };
    setWebRTCAdaptor(initiateWebrtc());
    setIsShow(true)    
    }, [])

    // useEffect(() => {
    //     if(isShow){
    //         onStartPublishing()
    //     }
    // }, [isShow])
   
 // Close Peer Connection Cleanup Function
 useEffect(() => {
    // Dismount
   return () => {
       if(webRTCAdaptor !== null){
           console.log('ran stop')
           webRTCAdaptor.stop(streamName)
       }
    }
}, [webRTCAdaptor])
  

    const handleLocalVideo = () => {
        if(videoOn){
            console.log('turning off local-video 📷 ')
            webRTCAdaptor.turnOffLocalCamera() //turn video on
            setVideoOn(false)
        }else{
            console.log('turning on local-video 📷')
            webRTCAdaptor.turnOnLocalCamera() //turn video on
            setVideoOn(true)
        }
    }
    const handleLocalMic = () => {
        if(!mutedMic){
            console.log('turning off local-microphone 🎤 ')
            webRTCAdaptor.muteLocalMic() //turn video on
            setMutedMic(true)
        }else{
            console.log('turning on local-microphone 🎤')
            webRTCAdaptor.unmuteLocalMic() //turn video on
            setMutedMic(false)
        }
    }
    const handleOnCall = () => {
        if(onCall){
            console.log('End Call')
            handleEndCall() //turn video on
            setOnCall(false)
        }else{
            console.log('Start Call')
            onStartPublishing() //turn video on
            setOnCall(true)
        }
    }
    const onStartPublishing = () => {
        // webRTCAdaptor.turnOffLocalCamera();  //Publish No video       
        webRTCAdaptor.publish(streamName, token);

    }

    const handleEndCall = (e) => {
        webRTCAdaptor.stop(streamName)
    }

    const  initiateWebrtc = () =>{
        return new WebRTCAdaptor({
            websocket_url: websocketURL,
            mediaConstraints: mediaConstraints,
            peerconnection_config: pc_config,
            sdp_constraints: sdpConstraints,
            localVideoId: `localVideo${kiosk_id}`,
            debug: true,
            bandwidth:900,
            callback: function (info, obj) {
                if (info == "initialized") {
                    console.log("initialized");

                } else if (info == "publish_started") {
                    //stream is being published
                    console.log("publish started");
                    // alert("publish started");
                    setIsShow(false)

                } else if (info == "publish_finished") {
                    //stream is being finished
                    console.log("publish finished");
                    setIsShow(true)

                } else if (info == "closed") {
                    //console.log("Connection closed");
                    if (typeof obj != "undefined") {
                        console.log("Connecton closed: "
                            + JSON.stringify(obj));
                    }
                } else if (info == "streamInformation") {
                    console.log("streamInfo ", JSON.stringify(obj));

                } else if (info == "ice_connection_state_changed") {
                    console.log("iceConnectionState Changed: ", JSON.stringify(obj));
                } else if (info == "updated_stats") {
                    //obj is the PeerStats which has fields
                    //averageIncomingBitrate - kbits/sec
                    //currentIncomingBitrate - kbits/sec
                    //packetsLost - total number of packet lost
                    //fractionLost - fraction of packet lost
                    console.log("Average incoming kbits/sec: " + obj.averageIncomingBitrate
                        + " Current incoming kbits/sec: " + obj.currentIncomingBitrate
                        + " packetLost: " + obj.packetsLost
                        + " fractionLost: " + obj.fractionLost
                        + " audio level: " + obj.audioLevel);

                } else if (info == "data_received") {
                    console.log("Data received: " + obj.event.data + " type: " + obj.event.type + " for stream: " + obj.streamId);
                } else if (info == "bitrateMeasurement") {
                    console.log(info + " notification received");

                    console.log(obj);
                } else {
                    console.log(info + " notification received");
                }
            },
            callbackError: function (error) {
                //some of the possible errors, NotFoundError, SecurityError,PermissionDeniedError

                console.log("error callback: " + JSON.stringify(error));
                alert(JSON.stringify(error));
            }
        });
    }

    return (
        <div>
             <Draggable >
           <div className="max-w-[800px] max-h-[500px]">
                <video width="100%" height="auto" id={`localVideo${kiosk_id}`} autoPlay muted  playsInline/>
            </div>
            </Draggable>
            <div className="backdrop-blur-sm mt-3 flex flex-row" >
               {!mutedMic ? (
                <BiMicrophone size={24} className="bg-gray-100 bg-opacity-20 p-1 rounded-full cursor-pointer" onClick={handleLocalMic} />
               ):(
                <BiMicrophoneOff size={24} className="bg-rose-300 bg-opacity-80 p-1 rounded-full cursor-pointer" onClick={handleLocalMic}/>
               )}

                {videoOn ? (
                 <FiVideo size={24} className="bg-gray-100 bg-opacity-20 p-1 rounded-full ml-4 cursor-pointer" onClick={ handleLocalVideo} />
                ):(
                <FiVideoOff size={24} className="bg-rose-300 bg-opacity-80 p-1 rounded-full ml-4 cursor-pointer" onClick={ handleLocalVideo} />
                )}


                {onCall ? (
                 <BiPhone size={24} className="bg-green-400 bg-opacity-80 p-1 rounded-full ml-4 cursor-pointer" onClick={  handleOnCall} />
                ):(
                <BiPhoneOff size={24} className="bg-gray-100 bg-opacity-50 p-1 rounded-full ml-4 cursor-pointer" onClick={  handleOnCall} />
                )}

            </div>
              
        </div>
    )
}

