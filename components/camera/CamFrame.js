import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect, useState, useRef } from "react";
import $ from "jquery";
import axios from "axios";
import FullPageLoader from "../FullPageLoader";

export default function CamFrame(props) {
  const {camera} = props
    const [width, setWidth] = useState("500px");
    const [height, setHeight] = useState("500px");
    const [loaded, setLoaded] = useState(false);
    const containerRef = useRef(null);
    const [player, setPlayer] = useState(null);
    const accessToken = props.camera.vxgToken;
    const [defaultToken, setDefaultToken] = useState('eyJhY2Nlc3MiOiAid2F0Y2giLCAidG9rZW4iOiAic2hhcmUuZXlKemFTSTZJREl6T1RBeE5IMC42MWJhNWRhOHRiYzFmYWIwMC5EUS1XZy01bzQ5UHJGTDVPcTUtQzZiNzZmeXciLCAiY2FtaWQiOiAyNTAxNDQsICJjbW5ncmlkIjogMjUwNTgxLCAiYXBpIjogIndlYi5za3l2ci52aWRlb2V4cGVydHNncm91cC5jb20ifQ==')
    

    useEffect(() => {
        if (props.width) {
          setWidth(props.width);
        }
        if (props.height) {
          setHeight(props.height);
        }
        if (containerRef.current) {
          setTimeout(() => {
            let options = {};
            if (props.options === "object") {
              options = {
                 timeline: "1timeline" ,// - element ID where the timeline will be located.
                autohide: "-1"
              }
            }
            let tmpPlayer = new window.CloudPlayerSDK(
              "container" + props.index + props.camera._id,
              options,
              []
            );
            setPlayer(tmpPlayer);
          }, 1000);
        }
        return () => {
          if(player) {
            player.close();
            alert('ran Close')
          }
          if(containerRef.current) {
            containerRef.current.innerHTML = ""
          }
          setPlayer(null);
        }
      }, []);
    
      useEffect(() => {
        if (player) {
          let channel = accessToken;
          if (!channel || channel === "") {
            return;
          }
          player.setSource(channel);
        }
      }, [accessToken, player]);

    return (
        <>
            {/* SDK VIDEO REF  */}
            
            <div className="min-h-[370px]" id={"container" + props.index +props.camera._id} ref={containerRef}/>
            <div>
              <div id={"1timeline"} />
            </div>
        </>
    )
}


 {/* <iframe 
                width= '670px ' //740px default mobile 360
                height= '478px'//490px default mobile 238
                src={`https://vxg.io/pro/iframe.html?channel=${defaultToken}&timeline=on`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                frameBorder="0" scrolling="no" align="center" allowFullScreen={true} webkitallowfullscreen="true" mozallowfullscreen="true">Your browser are not supported iframe.
            </iframe> */}