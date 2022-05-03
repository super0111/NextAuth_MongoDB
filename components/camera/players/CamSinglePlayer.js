
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import {HiOutlineStatusOnline, HiStatusOffline} from 'react-icons/hi';
import WebRTCAdaptor from '../../lib/webrtc_adaptor';
import CamAntToolbar from '../CamAntToolbar';

export default function CamSinglePlayer(props) {
    const {index, camera, maxHeight} = props;
    const videoRef = useRef();
    /// Media Server
    const [mediaConstraints, setMediaConstraints] = useState({
        video: false, audio: false
    })
    const [streamName, setStreamName] = useState(camera.antStreamId)
    const [token, setToken] = useState('')
    const [pc_config, setPc_config] = useState({
        'iceServers': [{
            'urls': 'stun:stun.l.google.com:19302'
        }]
    });
    const [sdpConstraints, setSdpConstraints] = useState({
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
    })
    const [websocketURL, setWebsocketURL] = useState(`wss://${process.env.NEXT_PUBLIC_MEDIA_SERVER_DOMAIN}:${process.env.NEXT_PUBLIC_MEDIA_SERVER_SECURE_PORT}/WebRTCAppEE/websocket`)  //ADD ENV AM_SERVER_URL 
    const [remoteVideoId, setremoteVideoId] = useState(`remoteVideo${props.index}${props.camera?._id}`)
    const [isShow, setIsShow] = useState(false);
    const [webRTCAdaptor, setWebRTCAdaptor] = useState(null)
    const [connectionError, setConnectionError] = useState(false)
    const [connected, setConnected] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
       setWebRTCAdaptor(initiateWebrtc())
        setIsShow(true)
    }, [])
    
    useEffect(() => {
        // NEED TO IMPLEMENT TO FIX Dismount && Mount
       return () => {
           if(webRTCAdaptor !== null){
               console.log('ran stop')
               webRTCAdaptor.stop(streamName)
           }
        }
    }, [webRTCAdaptor])
    
    useEffect(() => {
        if(webRTCAdaptor !== null && connected === true){
            onStartPlaying(streamName)
        }
        console.log('Connected-Side Load')
    }, [webRTCAdaptor,connected])


    const streamChangeHandler = (e) => {
        console.log(e.target.value);
        setStreamName(e.target.value);
    }

   const  onStartPlaying = (streamName) => {
        webRTCAdaptor.play(streamName, token);
    }
   
    const  initiateWebrtc = () => {
        return new WebRTCAdaptor({
            websocket_url: websocketURL,
            mediaConstraints: mediaConstraints,
            peerconnection_config: pc_config,
            sdp_constraints: sdpConstraints,
            remoteVideoId: remoteVideoId,
            isPlayMode: true,
            debug: true,
            candidateTypes: ["tcp", "udp"],
            callback: function (info, obj) {
                if (info == "initialized") {
                    console.log("initialized");
                    setConnected(true)
                } else if (info == "play_started") {
                    //joined the stream
                    console.log("play started");
                    setIsPlaying(true);
                    setConnectionError(false)
                } else if (info == "play_finished") {
                    //leaved the stream
                    console.log("play finished");
                    // videoRef.current.play()
                    console.log(  videoRef,'ref')
                } else if (info == "closed") {
                    //console.log("Connection closed");
                    if (typeof obj != "undefined") {
                        console.log("Connecton closed: "
                            + JSON.stringify(obj));
                    }
                } else if (info == "streamInformation") {


                } else if (info == "ice_connection_state_changed") {
                    // console.log("iceConnectionState Changed: ", JSON.stringify(obj));
                } else if (info == "updated_stats") {
                    //obj is the PeerStats which has fields
                    //averageIncomingBitrate - kbits/sec
                    //currentIncomingBitrate - kbits/sec
                    //packetsLost - total number of packet lost
                    //fractionLost - fraction of packet lost

                    // console.log("Average incoming kbits/sec: " + obj.averageIncomingBitrate
                    //     + " Current incoming kbits/sec: " + obj.currentIncomingBitrate
                    //     + " packetLost: " + obj.packetsLost
                    //     + " fractionLost: " + obj.fractionLost
                    //     + " audio level: " + obj.audioLevel);

                } else if (info == "data_received") {
                    // console.log("Data received: " + obj.event.data + " type: " + obj.event.type + " for stream: " + obj.streamId);
                } else if (info == "bitrateMeasurement") {
                    // console.log(info + " notification received");
                    // console.log(obj);
                    setConnectionError(false)
                } else {
                    // console.log(info + " notification received");

                }
            },
            callbackError: function (error) {
                //some of the possible errors, NotFoundError, SecurityError,PermissionDeniedError
                setConnectionError(true);
                console.log("error callback: " + JSON.stringify(error));
                // alert(JSON.stringify(error));
                console.log(JSON.stringify(error))
            }
        });
    }
console.log(videoRef)
    return (
        <div>
            <video ref={videoRef} className= {maxHeight ? `w-full max-w-[1000px]  m-auto max-h-[500px]` : "w-full max-w-[1000px]  m-auto"} id={`remoteVideo${props.index}${props.camera?._id}`} autoPlay muted controls playsInline
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen={true} webkitallowfullscreen="true" mozallowfullscreen="true" />       
        </div>
    )
}
