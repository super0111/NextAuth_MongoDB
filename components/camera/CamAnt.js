
import React, { useEffect, useRef, useState } from 'react';
// import './Player.css';
import WebRTCAdaptor from '../lib/webrtc_adaptor';
import {HiOutlineStatusOnline, HiStatusOffline} from 'react-icons/hi';
import { useRouter } from 'next/router';
import CamAntToolbar from './CamAntToolbar';
import CamFrame from './CamFrame';
import{GiBackwardTime} from 'react-icons/gi';
import CameraDvrModal from "../modal/CameraDvrModal";
import CamDvrSideModal from '../modal/CamDvrSideModal';

export default function CamAnt(props) {
    const {streamId, index, camera} = props;
    const [showDvrModal, setShowDvrModal] = useState(false);

    const handleShowModal = (e) => {
        setShowDvrModal(true)
    }

    /// Media Server
    const [mediaConstraints, setMediaConstraints] = useState({
        video: false, audio: false
    })
    const [streamName, setStreamName] = useState('')
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
    const [showVod, setShowVod] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false);

    // Initiate WebRTC connection
    useEffect(() => {
       setWebRTCAdaptor(initiateWebrtc())
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

    // Handle Props StreamId
    useEffect(() => {
        if(props.streamId)
        setStreamName(props.streamId)
    }, [])
    
    // Start Playing Stream when ready
    useEffect(() => {
        if(webRTCAdaptor !== null && connected === true){
            onStartPlaying(streamName)
        }
        console.log('Connected-Side Load')
    }, [webRTCAdaptor,connected])

 

    //Props Stream Name
    const streamChangeHandler = (e) => {
        console.log(e.target.value);
        setStreamName(e.target.value);
    }

    // WebRTC Play Func
   const  onStartPlaying = (streamName) => {
        webRTCAdaptor.play(streamName, token);
    }
   // WebRTC Initiate Func
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
                } else if (info == "closed") {
                    console.log("Connection closed");
                    if (typeof obj != "undefined") {
                        console.log("Connecton closed: "
                            + JSON.stringify(obj));
                    }
                } else if (info == "streamInformation") {
                    // if (typeof obj != "undefined") {
                    //     console.log(obj);
                    // }
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
                    console.log("Data received: " + obj.event.data + " type: " + obj.event.type + " for stream: " + obj.streamId);
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
                console.log("webRTC error callback: " + JSON.stringify(error));
                // alert(JSON.stringify(error));
                console.log(JSON.stringify(error))
            }
        });
    }
    return (
        <div className=" bg-black max-h-[530px] p-1 ">
        {showDvrModal && <CamDvrSideModal camera={camera} open={showDvrModal} setOpen={setShowDvrModal}/>}
           <div className="flex flex-row justify-center inset-x-0 top-0">
                <div className="flex flex-row justify-between px-[0.55rem] py-[0.2rem]  w-full  bg-black ">
                    <div className="inline-flex items-center px-1 border-indigo-300 border-[1px] rounded-md text-sm font-medium  text-white">
                      {camera?.name}
                    </div>
                   {camera?.vxg.rec === 'on' && <div  onClick={() => setShowDvrModal(true)}  className="cursor-pointer inline-flex items-center px-1 border-blue-300 border-[1px] rounded-md text-sm font-medium  text-white">
                        <GiBackwardTime size={18} className=" text-white " />DVR
                    </div>}
                    {
                        !connectionError ? (
                            <div>
                                <span className=" inline-flex items-center px-1 border-indigo-300 border-[1px] rounded-md text-sm font-medium  text-white">
                                        Live
                                        <HiOutlineStatusOnline size={18} className=" text-green-600 animate-pulse ml-2" />
                                </span>
                            </div>
                        ) : (
                        <div>
                            <span className="inline-flex items-center px-1 border-indigo-300 border-[1px] rounded-md text-sm font-medium  text-white"> 
                                Offline
                                <HiStatusOffline size={18} className="animate-ping text-red-600 ml-2" />
                            </span>
                        </div>
                    )}
                </div>
           </div>
            <div style={{width:'100%', maxWidth:'1200px' , margin:'auto' , display:'block', position: 'relative'}} >
                {!showVod ? (
                    <>
                    {/*Video Messages */}
                    {/* <div style={{color:"#FFF", position: "absolute", top: "0" ,left: "0" ,display: "flex " ,flexDirection: "column" , justifyContent: "center" ,alignItems: "center",  width: "100%" , height: "100%"}}>
                             We Can Place Messages On Screen
                    </div> */}

                        <video  style={{width:'100%', height:'auto', minHeight:"220px"}} id={`remoteVideo${props.index}${props.camera?._id}`} autoPlay muted controls playsInline
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen={true} webkitallowfullscreen="true" mozallowfullscreen="true" />
                    </>
                ):( 
                    <>
                    {/*DVR View*/}
                        {/* <iframe src={`https://${process.env.NEXT_PUBLIC_MEDIA_SERVER_DOMAIN}:${process.env.NEXT_PUBLIC_MEDIA_SERVER_SECURE_PORT}/WebRTCAppEE/play.html?id=${camera.antStreamId}&playOrder=hls`}  
                        style={{width:'100%', height:'auto'}}
                        //  autoPlay controls playsInline
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen={true} webkitallowfullscreen="true" mozallowfullscreen="true" /> */}
                    
                     <CamFrame camera={camera} accessToken={camera.vxgToken} setShow={setShowVod} />
                    </>
                )}
            </div>
           <CamAntToolbar camera={camera} setShowVod={setShowVod} showVod={showVod}/>
        </div>
    )
}

//Orginal AM GIT
// class Live extends React.Component {
//    webRTCAdaptor = null;

//     state = {
//         mediaConstraints: {
//             video: false,
//             audio: false
//         },
//         streamName: 'Vivo-Dome',  //streamID
//         token: '',
//         pc_config: {
//             'iceServers': [{
//                 'urls': 'stun:stun.l.google.com:19302'
//             }]
//         },
//         sdpConstraints: {
//             OfferToReceiveAudio: true,
//             OfferToReceiveVideo: true
//         },
//         websocketURL: "wss://vxg.gomidl.com:5443//WebRTCAppEE/websocket",
//         isShow:false
//     };

//     constructor(props) {
//         super(props);
//     }

//     componentDidMount(){
//         this.webRTCAdaptor = this.initiateWebrtc();
//         this.setState({
//             isShow:true
//         });
//     }

//     streamChangeHandler = ({target:{value}})=> {
//         console.log(value);
//         this.setState({streamName: value});
//     }

//     onStartPlaying = (name)=> {
//         this.webRTCAdaptor.play(this.state.streamName, this.state.token);
//     }

//     initiateWebrtc(){
//         return new WebRTCAdaptor({
//             websocket_url: this.state.websocketURL,
//             mediaConstraints: this.state.mediaConstraints,
//             peerconnection_config: this.state.pc_config,
//             sdp_constraints: this.state.sdpConstraints,
//             remoteVideoId: "remoteVideo",
//             isPlayMode: true,
//             debug: true,
//             candidateTypes: ["tcp", "udp"],
//             callback: function (info, obj) {
//                 if (info == "initialized") {
//                     console.log("initialized");

//                 } else if (info == "play_started") {
//                     //joined the stream
//                     console.log("play started");


//                 } else if (info == "play_finished") {
//                     //leaved the stream
//                     console.log("play finished");

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
//                 <div className="Player">
//                     YOU ARE IN PLAY PAGE <br />
//                     <video style={{width:'100%', maxWidth:'640px'}} id="remoteVideo" autoPlay controls playsInline></video>
                    
//                     <br/>
//                     <input type="text" onChange={this.streamChangeHandler}/>
//                     {
//                         isShow ? (
//                             <button
//                                 onClick={this.onStartPlaying.bind(this, streamName)}
//                                 className="btn btn-primary"
//                                 id="start_play_button"> Start
//                                 Playing
//                             </button>
//                         ) : null
//                     }

//                 </div>
//                 <div/>
//                 <div className="Player">
//                     YOU ARE IN PLAY PAGE <br />
//                     <video style={{width:'100%', maxWidth:'640px'}} id="remoteVideo2" autoPlay controls playsInline></video>
                    
//                     <br/>
//                     <input type="text" onChange={this.streamChangeHandler}/>
//                     {
//                         isShow ? (
//                             <button
//                                 onClick={this.onStartPlaying.bind(this, streamName)}
//                                 className="btn btn-primary"
//                                 id="start_play_button"> Start
//                                 Playing
//                             </button>
//                         ) : null
//                     }

//                 </div>
//                 <div/>
//             </>

//         );
//     }
// }

// export default Live;