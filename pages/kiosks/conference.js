import { useEffect, useState } from "react";
import CamAntPublish from "../../components/camera/players/CamAntPublish";
import CamSinglePlayer from "../../components/camera/players/CamSinglePlayer";

export default function conference(props) {
   
   
// //      /// Media Server
//     const [pc_config, setPc_config] = useState({
//         'iceServers': [{
//             'urls': 'stun:stun.l.google.com:19302'
//         }]
//     });
//     const [mediaConstraints, setMediaConstraints] = useState({
//         video: false, audio: false
//     }) 
//     const [sdpConstraints, setSdpConstraints] = useState({
//         OfferToReceiveAudio: true,
//         OfferToReceiveVideo: true
//     })
//     const [streamName, setStreamName] = useState('')
//     const [token, setToken] = useState('')
//     const [websocketURL, setWebsocketURL] = useState(`wss://${process.env.NEXT_PUBLIC_MEDIA_SERVER_DOMAIN}:${process.env.NEXT_PUBLIC_MEDIA_SERVER_SECURE_PORT}/WebRTCAppEE/websocket`)  //ADD ENV AM_SERVER_URL 
//     const [remoteVideoId, setremoteVideoId] = useState(`remoteVideo${props.index}${props.camera._id}`)
//     const [isShow, setIsShow] = useState(false);
//     const [webRTCAdaptor, setWebRTCAdaptor] = useState(null)
//     const [connectionError, setConnectionError] = useState(false)
//     const [connected, setConnected] = useState(false)
//     const [showVod, setShowVod] = useState(false)
//     const [isPlaying, setIsPlaying] = useState(false);

//     useEffect(() => {
//        setWebRTCAdaptor(initiateWebrtc())
//         setIsShow(true)

//         // NEED TO IMPLEMENT TO FIX Dismount && Mount
//         // return () => {
//         //     webRTCAdaptor.stop()
//         // }
//     }, [])

//     useEffect(() => {
//         if(props.streamId)
//         setStreamName(props.streamId)
//     }, [])
    
//     useEffect(() => {
//         if(webRTCAdaptor !== null && connected === true){
//             onStartPlaying(streamName)
//         }
//         console.log('Connected-Side Load')
//     }, [webRTCAdaptor,connected])

//    const  onStartPlaying = (streamName) => {
//         webRTCAdaptor.play(streamName, token);
//     }
   
//     const  initiateWebrtc = () => {
//         return new WebRTCAdaptor({
//             websocket_url: websocketURL,
//             mediaConstraints: mediaConstraints,
//             peerconnection_config: pc_config,
//             sdp_constraints: sdpConstraints,
//             remoteVideoId: remoteVideoId,
//             isPlayMode: true,
//             debug: true,
//             candidateTypes: ["tcp", "udp"],
//             callback: function (info, obj) {
//                 if (info == "initialized") {
//                     console.log("initialized");
//                     setConnected(true)
//                 } else if (info == "play_started") {
//                     //joined the stream
//                     console.log("play started");
//                     setIsPlaying(true);
//                     setConnectionError(false)
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
//                     // console.log("iceConnectionState Changed: ", JSON.stringify(obj));
//                 } else if (info == "updated_stats") {
//                     //obj is the PeerStats which has fields
//                     //averageIncomingBitrate - kbits/sec
//                     //currentIncomingBitrate - kbits/sec
//                     //packetsLost - total number of packet lost
//                     //fractionLost - fraction of packet lost

//                     // console.log("Average incoming kbits/sec: " + obj.averageIncomingBitrate
//                     //     + " Current incoming kbits/sec: " + obj.currentIncomingBitrate
//                     //     + " packetLost: " + obj.packetsLost
//                     //     + " fractionLost: " + obj.fractionLost
//                     //     + " audio level: " + obj.audioLevel);

//                 } else if (info == "data_received") {
//                     // console.log("Data received: " + obj.event.data + " type: " + obj.event.type + " for stream: " + obj.streamId);
//                 } else if (info == "bitrateMeasurement") {
//                     // console.log(info + " notification received");
//                     // console.log(obj);
//                     setConnectionError(false)
//                 } else {
//                     // console.log(info + " notification received");

//                 }
//             },
//             callbackError: function (error) {
//                 //some of the possible errors, NotFoundError, SecurityError,PermissionDeniedError
//                 setConnectionError(true);
//                 console.log("error callback: " + JSON.stringify(error));
//                 // alert(JSON.stringify(error));
//                 console.log(JSON.stringify(error))
//             }
//         });
//     }
//     const turnOffLocalCamera = () => {
// 		webRTCAdaptor.turnOffLocalCamera(publishStreamId);
// 		isCameraOff = true;
// 		handleCameraButtons();
// 		sendNotificationEvent("CAM_TURNED_OFF");
// 	}

// 	const turnOnLocalCamera = () => {
// 		webRTCAdaptor.turnOnLocalCamera(publishStreamId);
// 		isCameraOff = false;
// 		handleCameraButtons();
// 		sendNotificationEvent("CAM_TURNED_ON");
//     }
//     const muteLocalMic = () => {
// 		webRTCAdaptor.muteLocalMic();
// 		isMicMuted = true;
// 		handleMicButtons();
// 		sendNotificationEvent("MIC_MUTED");
// 		webRTCAdaptor.enableAudioLevelWhenMuted()
// 	}

// 	const  unmuteLocalMic = () => {
// 		webRTCAdaptor.unmuteLocalMic();
// 		isMicMuted = false;
//     	handleMicButtons();
// 		sendNotificationEvent("MIC_UNMUTED");
// 		webRTCAdaptor.disableAudioLevelWhenMuted();
//     }
//     const sendNotificationEvent = (eventType) => {
// 		if(isDataChannelOpen) {
// 			var notEvent = { streamId: publishStreamId, eventType:eventType };

// 			webRTCAdaptor.sendData(publishStreamId, JSON.stringify(notEvent));
// 		}	else {
// 			console.log("Could not send the notification because data channel is not open.");
// 		}
//     }
//     const handleMicButtons = ()  =>{
// 		if(isMicMuted) {
// 			mute_mic_button.disabled = true;
// 			unmute_mic_button.disabled = false;
// 		} else {
// 			mute_mic_button.disabled = false;
// 			unmute_mic_button.disabled = true;
// 		}
//     }
//     function joinRoom() {
// 		// let mode = mcuChbx.checked ? "mcu" : "legacy"; 
// 		webRTCAdaptor.joinRoom(roomNameBox.value, streamId,"legacy");
// 	}

// 	function leaveRoom() {
// 		webRTCAdaptor.leaveFromRoom(roomNameBox.value);

// 		for (var node in document.getElementById("players").childNodes) {
// 			if(node.tagName == 'DIV' && node.id != "localVideo") {
// 				document.getElementById("players").removeChild(node);
// 			}
// 		}
// 	}

// 	function publish(streamName, token) {
// 		publishStreamId = streamName;
// 		webRTCAdaptor.publish(streamName, token);
// 	}

// 	function streamInformation(obj) {
// 		webRTCAdaptor.play(obj.streamId, token,	roomNameBox.value);
// 	}

// 	function playVideo(obj) {
// 		var room = roomOfStream[obj.streamId];
// 		console.log("new stream available with id: "
// 				+ obj.streamId + "on the room:" + room);

// 		var video = document.getElementById("remoteVideo"+obj.streamId);

// 		if (video == null) {
// 			createRemoteVideo(obj.streamId);
// 			video = document.getElementById("remoteVideo"+obj.streamId);
// 		}

// 		video.srcObject = obj.stream;

// 		webRTCAdaptor.enableAudioLevel(obj.stream, obj.streamId)
//     }
//     function createRemoteVideo(streamId) {
// 		var player = document.createElement("div");
// 		player.className = "col-sm-3";
// 		player.id = "player"+streamId;
// 		player.innerHTML = '<img id="audio'+streamId+'"src="images/audio.png" style="visibility: hidden;"></image>' + '<video id="remoteVideo'+streamId+'"controls autoplay playsinline></video>';
// 		document.getElementById("players").appendChild(player);
// 	}

// 	function removeRemoteVideo(streamId) {
// 		var video = document.getElementById("remoteVideo"+streamId);
// 		if (video != null) {
// 			var player = document.getElementById("player" + streamId);
// 			video.srcObject = null;
// 			document.getElementById("players").removeChild(player);
// 		}
// 		webRTCAdaptor.stop(streamId);
// 		streamsList = streamsList.filter(item => item !== streamId);
// 	}

// 	function checkVideoTrackStatus(streamsList){
// 		streamsList.forEach(function(item) {
// 			var video = document.getElementById("remoteVideo"+item);
// 			if(video != null && !video.srcObject.active){
// 				removeRemoteVideo(item);
// 				playVideo(item);
// 			}
// 		});
//     }
    let camera = {antStreamId:'LPR2' , name:'concierge'}
    return (
        <div>
            <div className="flex flex-col items-center justify-start">
                <span>Your Video</span>
                <div className="lg:max-w-3xl bg-white p-1 rounded-xl">
                 <CamAntPublish stream_id={'lobby1'} />
                </div>
                <span>Peer</span>
               <div className=" md:fixed top-0 left-10 max-w-[300px] shadow-2xl shadow-white-300">
                 <CamSinglePlayer  camera={camera}/>
               </div>
              
            </div>
        </div>
    )
}
