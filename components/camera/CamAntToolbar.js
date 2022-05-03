import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {AiOutlineFieldTime} from 'react-icons/ai';
import {BsLightningChargeFill,BsArrowUpLeftSquareFill} from 'react-icons/bs';
import { GiCctvCamera } from "react-icons/gi";

export default function CamAntToolbar(props) {
    const {setShowVod, showVod, camera} = props;
    const router = useRouter(); //if use in React change to query params
    const camIdvURL = '/app/cameras' // change to App camera individual URL if different structure
    const [showViewCam, setShowViewCam] = useState(true)

    const handleViewCam = (e) => {
        router.push(`${camIdvURL}/${camera._id}`); 
    }
  
    return (
        <div>
             <div className="inset-x-0 bottom-0 flex flex-row items-center justify-center   w-full ">
                <div className="flex flex-row justify-between px-[0.55rem] py-[0.4rem]  w-[96%]">
                    
                     {!router.pathname.includes(`${camIdvURL}/[id]`) ?
                        <Link href={`${camIdvURL}/${camera?._id}`} >
                            <span  className=" inline-flex cursor-pointer items-center px-3 py-0.5 border-indigo-300 border-2 rounded-md text-sm font-medium  text-white">
                                    <BsArrowUpLeftSquareFill className=" text-white mr-2"/>
                                    View Cam
                            </span>
                        </Link>
                        :
                        <div onClick={(e) => handleViewCam(e)} className="text-white flex flex-row" >
                              <GiCctvCamera size={18} className="pb-1"/> Camera
                        </div>
                    }
                    {
                        !showVod ? (
                            <div>
                                <span className="inline-flex items-center px-3 py-0.5 border-indigo-300 border-2 rounded-md text-sm font-medium  text-white">       
                                        Low-Latency
                                        <BsLightningChargeFill className=" text-yellow-100 ml-2"/>
                                </span>
                            </div>
                        ) : (
                            <div>
                                <span  onClick={()=> setShowVod(false)} className=" cursor-pointer inline-flex items-center px-3 py-0.5 border-indigo-300 border-2 rounded-md text-sm font-medium  text-white">
                                        Reliable
                                        <AiOutlineFieldTime  className=" text-orange-300 ml-2"/>
                                </span>
                            </div>        
                        )
                    }
                </div>
            </div>
            
        </div>
    )
}
