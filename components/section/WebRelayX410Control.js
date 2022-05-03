import useSWR, { useSWRConfig } from "swr";
import axios from 'axios';
import {AiFillUnlock,AiFillLock} from "react-icons/ai";

async function fetcherFunc(url){
    const res = await fetch(url);
    return res.json();
    }
export default function WebRelayX410Control(props) {
    const {webrelay} = props;
    const {mutate} = useSWRConfig()

    const handleToggleOn = async(e,relay) => {
        e.preventDefault()
        try{
            const res = await axios.get(`/api/webrelays?action=toggle&action_type=on&id=${webrelay._id}&relay_id=${relay}`)
            console.log('Trigger On Success')
            mutate(`/api/webrelays?action=state&id=${webrelay._id}`)
        }catch(error){
            alert('Controller Connection Error')
            console.log(error)
        }
    }
    const handleToggleOff = async(e,relay) => {
        e.preventDefault()
        try{
            const res = await axios.get(`/api/webrelays?action=toggle&action_type=pulse&id=${webrelay._id}&relay_id=${relay}`)
            console.log('Trigger Off Success')
            mutate(`/api/webrelays?action=state&id=${webrelay._id}`)
        }catch(error){
            console.log(error)
        }
    }
    const handleTogglePulse = async(e,relay) => {
        e.preventDefault()
        try{
            const res = await axios.get(`/api/webrelays?action=toggle&action_type=off&id=${webrelay._id}&relay_id=${relay}`)
            console.log('Trigger Pulse Success')
            mutate(`/api/webrelays?action=state&id=${webrelay._id}`)
        }catch(error){
            console.log(error)
        }
    }

    const { data, error } = useSWR(`/api/webrelays?action=state&id=${webrelay?._id}`, fetcherFunc, {revalidateOnMount:true, refreshInterval: 1000 })
    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>
    if(!data.success) return <div>Loading Controller...</div> // ToDo: Warning Modal for Catch Wrong IP Error 
    console.log(data)
    return (
        <div className="relative grid grid-cols-1 sm:grid-cols-2 md::grid-cols-2 lg::grid-cols-2 xl::grid-cols-2 gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
            {webrelay.relays.map((relay,idx) => (
                    <a
                    key={idx}
                    className="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50 transition ease-in-out duration-150"
                    >
                        <div className="ml-4 w-full">
                            <div className="flex flex-row justify-between w-full">
                                <div>
                                    <p className="text-base font-medium text-gray-900">
                                        {relay.name}
                                    </p>
                                </div>
                                <div className="flex flex-row justify-end cursor-pointer">
                                    <div onClick={(e) => handleToggleOn(e,relay.relay_id)} className="h-full max-h-[2rem] bg-green-400 text-green-700 p-1">
                                        OPEN
                                    </div>
                                    <div onClick={(e) => handleToggleOff(e,relay.relay_id)} className="h-full  max-h-[2rem] bg-orange-300 text-orange-700 p-1">
                                        PULSE
                                    </div>
                                    <div onClick={(e) => handleTogglePulse(e,relay.relay_id)} className="h-full max-h-[2rem] bg-rose-400 text-rose-700 p-1">
                                        LOCK
                                    </div>
                                </div>
                            </div> 

                            {/* Use Device Relay State Hook */}
                            <div className="mt-4">
                            {(data.webrelay[idx] === '1' || data.webrelay[idx] === 1 )? 
                                    <p className="mt-1 flex flex-row text-2xl  decoration-double decoration-green-300 underline  text-gray-500 ">
                                    <AiFillUnlock className="mr-2 pt-1 " size={34}/> Open
                                    </p>
                                    : 
                                    <p className="mt-1 flex flex-row text-2xl  decoration-double decoration-rose-300 underline  text-gray-500 ">
                                        <AiFillLock className="mr-2 pt-1 " size={34} /> Locked
                                    </p>
                                }
                            </div>


                        </div>
                    </a>
                ))}
        </div>
    )
}
