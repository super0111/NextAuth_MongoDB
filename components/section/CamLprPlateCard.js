import LicensePlate from "../assets/LicensePlate";
import dateformat from 'dateformat';
import useSWR from "swr";
import {ImWarning} from "react-icons/im";

async function fetcherFunc(url){
    const res = await fetch(url);
    return res.json();
    }
export default function CamLprPlateCard(props) {
    const url ='/api/plates?fetch=latest_plate';
    const { data,error } = useSWR(url, fetcherFunc, {initialProps: props, revalidateOnMount: true, refreshInterval: 3000});
    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>
    if(!data.plate) return (
        <div className="flex flex-col items-center">
            <div> 
                <ImWarning className="h-12 w-32 text-yellow-500"/> 
            </div> 
            No Plates Detected Yet
        </div>
    )
    console.log(data)
    
    return (
        <div>   
            <div className="bg-gray-200 rounded-2xl shadow-2xl px-3 py-3 mt-2 w-280px max-w-[350px]" > 
                <div className="flex flex-row justify-center">
                    <LicensePlate plate={data.plate.plateNum} width="280px" height="142px" />
                </div>
                <div className="divide-y divide-blue-300 mt-6" >
                    <div/>
                    <div className="flex flex-col items-start p-1">
                    {data.plate.list_type === 'whitelist' &&
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-lg font-medium bg-green-100 text-green-800">
                            {data.plate.list_type?.toUpperCase()}
                        </span>  
                    }             
                    {data.plate.list_type === 'blacklist' &&
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-lg font-medium bg-red-100 text-red-800">
                            {data.plate.list_type?.toUpperCase()}
                        </span>  
                    }                         
                    </div>
                    <div className="flex flex-col items-center p-2">
                        { dateformat(data.plate.updatedAt, "mm/dd/yyyy, h:MM:ss TT")}
                    </div>
                    <div className="flex flex-col items-center p-2">
                        <span>12 Appearances in the last <strong>30</strong> Days</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
