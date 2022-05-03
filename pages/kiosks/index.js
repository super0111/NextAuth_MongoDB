import { useState } from "react";
import KioskAntPublish from "../../components/kiosks/KioskAntPublish";
import {GiAtom} from "react-icons/gi"
import {BiBell} from "react-icons/bi";
import KioskAntPlay from "../../components/kiosks/KioskAntPlay";
import { useRouter } from "next/router";
import useSWR from "swr";

async function fetcherFunc(url){
    const res = await fetch(url);
    return res.json();
    }
export default function index(props) {
    const router = useRouter();
    const [showKioskManager, setShowKioskManager] = useState(false)   
    const url =`/api/kiosks/?id=${router.query.kiosk_id}`;
    const { data: kioskData,error: kioskError } = useSWR(router.query.kiosk_id ? url : null, fetcherFunc, {initialProps: props});
    const url2 =`https://${process.env.NEXT_PUBLIC_MEDIA_SERVER_DOMAIN}:${process.env.NEXT_PUBLIC_MEDIA_SERVER_SECURE_PORT}/WebRTCAppEE/rest/v2/broadcasts/${kioskData?.kiosk.kiosk_id}-manager`;
    const { data:kioskManagerData ,error } = useSWR( kioskData ? url2 : null, fetcherFunc, {initialProps: props , refreshInterval:2000 });
    if (kioskError) return <div>failed to load</div>
    if (!kioskData) return <div>loading...</div>
   
    return (
        <div>
           <div className="max-w-[800px]">
               <KioskAntPublish kiosk_id={kioskData.kiosk.kiosk_id} />
               <div className="bg-white p-2 rounded fixed  bottom-2 right-2 max-w-[300px]">
                 {kioskManagerData?.streamId === `${kioskData.kiosk.kiosk_id}-manager`&&   <KioskAntPlay kiosk_id={`${kioskData.kiosk.kiosk_id}-manager`} />}
               </div>
           </div>
        </div>
    )
}
