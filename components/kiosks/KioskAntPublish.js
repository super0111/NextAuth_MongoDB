import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
// import './Player.css';
import WebRTCAdaptor from '../lib/webrtc_adaptor';

export default function KioskAntPublish(props) {
    const { kiosk_id} = props
    const [streamName, setStreamName] = useState(kiosk_id)
    const [remoteVideos, setRemoteVideos] = useState([])
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
    const [webRTCAdaptor, setWebRTCAdaptor] = useState(null)
    const [connectionError, setConnectionError] = useState(false)
    const [connected, setConnected] = useState(false)
    const [isShow, setIsShow] = useState(false);
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
   
 // Close Peer Connection Cleanup Function
 useEffect(() => {
    // NEED TO IMPLEMENT TO FIX Dismount && Mount
   return () => {
       if(webRTCAdaptor !== null){
           console.log('ran stop')
           webRTCAdaptor.stop(streamName)
       }
    }
}, [webRTCAdaptor])
  

    const onStartPublishing = () => {
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
                    setConnected(true)
                } else if (info == "publish_started") {
                    //stream is being published
                    console.log("publish started");
                    // alert("publish started");
                } else if (info == "publish_finished") {
                    //stream is being finished
                    console.log("publish finished");

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

    useEffect(() => {
       if(connected && isShow){
         onStartPublishing()
       }
    }, [connected,isShow])
    return (
        <div>
         
            <div className="max-w-[800px] max-h-[500px]">
                <video width="100%" height="auto" id={`localVideo${kiosk_id}`} autoPlay muted  playsInline/>
            </div>
        
           
       
        </div>
    )
}





// import React from 'react';
// import './Player.css';
// import WebRTCAdaptor from './js/webrtc_adaptor';

// class Publishnew extends React.Component {
//     webRTCAdaptor:?Object = null;

//     state:Object = {
//         mediaConstraints: {
//             video: true,
//             audio: true
//         },
//         streamName: 'stream1',
//         token: '',
//         pc_config: {
//             'iceServers': [{
//                 'urls': 'stun:stun.l.google.com:19302'
//             }]
//         },
//         sdpConstraints: {
//             OfferToReceiveAudio: false,
//             OfferToReceiveVideo: false
//         },
//         websocketURL: "wss://antmediaserver:5443/WebRTCAppEE/websocket",
//         isShow:false
//     };

//     constructor(props) {
//         super(props);
//     }

//     componentDidMount():void {
//         let videox = document.querySelector("#localVideo");

//         if (navigator.mediaDevices.getUserMedia) {
//             navigator.mediaDevices.getUserMedia({ video: true })
//                 .then(function (stream) {
//                     videox.srcObject = stream;
//                 })
//                 .catch(function (err0r) {
//                     console.log("Something went wrong!");
//                 });
//         };
//         this.webRTCAdaptor = this.initiateWebrtc();
//         this.setState({
//             isShow:true
//         });
//     }

//     streamChangeHandler = ({target:{value}}:Event):void => {
//         console.log(value);
//         this.setState({streamName: value});
//     }

//     onStartPublishing = (name:String):void => {
//         this.webRTCAdaptor.publish(this.state.streamName, this.state.token);
//     }

//     initiateWebrtc():WebRTCAdaptor {
//         let thiz = this;
//         return new WebRTCAdaptor({
//             websocket_url: this.state.websocketURL,
//             mediaConstraints: this.state.mediaConstraints,
//             peerconnection_config: this.state.pc_config,
//             sdp_constraints: this.state.sdpConstraints,
//             localVideoId: "localVideo",
//             debug: true,
//             bandwidth:900,
//             callback: function (info, obj) {
//                 if (info == "initialized") {
//                     console.log("initialized");

//                 } else if (info == "publish_started") {
//                     //stream is being published
//                     console.log("publish started");
//                     alert("publish started");
//                     thiz.setState({
//                         isShow:false
//                     });

//                 } else if (info == "publish_finished") {
//                     //stream is being finished
//                     console.log("publish finished");
//                     thiz.setState({
//                         isShow:true
//                     });

//                 } else if (info == "closed") {
//                     //console.log("Connection closed");
//                     if (typeof obj != "undefined") {
//                         console.log("Connecton closed: "
//                             + JSON.stringify(obj));
//                     }
//                 } else if (info == "streamInformation") {


//                 } else if (info == "ice_connection_state_changed") {
//                     console.log("iceConnectionState Changed: ", JSON.stringify(obj));
//                 } else if (info == "updated_stats") {
//                     //obj is the PeerStats which has fields
//                     //averageIncomingBitrate - kbits/sec
//                     //currentIncomingBitrate - kbits/sec
//                     //packetsLost - total number of packet lost
//                     //fractionLost - fraction of packet lost
//                     console.log("Average incoming kbits/sec: " + obj.averageIncomingBitrate
//                         + " Current incoming kbits/sec: " + obj.currentIncomingBitrate
//                         + " packetLost: " + obj.packetsLost
//                         + " fractionLost: " + obj.fractionLost
//                         + " audio level: " + obj.audioLevel);

//                 } else if (info == "data_received") {
//                     console.log("Data received: " + obj.event.data + " type: " + obj.event.type + " for stream: " + obj.streamId);
//                 } else if (info == "bitrateMeasurement") {
//                     console.log(info + " notification received");

//                     console.log(obj);
//                 } else {
//                     console.log(info + " notification received");
//                 }
//             },
//             callbackError: function (error) {
//                 //some of the possible errors, NotFoundError, SecurityError,PermissionDeniedError

//                 console.log("error callback: " + JSON.stringify(error));
//                 alert(JSON.stringify(error));
//             }
//         });
//     }

//     render() {
//         const {streamName, isShow} = this.state;

//         return (
//             <>
//                 <div className="Publish">
//                     YOU ARE IN PUBLISH PAGE <br />
//                     <video id="localVideo" autoPlay muted controls playsInline></video>
//                     <br/>
//                     <input type="text" onChange={this.streamChangeHandler}/>
//                     {
//                         isShow ? (
//                             <button
//                                 onClick={this.onStartPublishing.bind(this, streamName)}
//                                 className="btn btn-primary"
//                                 id="start_play_button"> Start
//                                 Publish
//                             </button>
//                         ) : null
//                     }
//                 </div>
//             </>

//         );
//     }
// }

// export default Publishnew;