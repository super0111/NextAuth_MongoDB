import { useState, useRef, useEffect } from "react";
import useSWR from "swr";
import CamAnt from "../../components/camera/CamAnt";
import WebRelayControlModal from "../../components/modal/WebRelayControlModal";
import CamLprPlateCard from "../../components/section/CamLprPlateCard";
import WebRelayService from "../../components/services/WebRelayService";
import CamEventTable from "../../components/tables/CamEventTable";
import IncomingPlateTable from "../../components/tables/IncomingPlateTable";
const lprCamId = process.env.NEXT_PUBLIC_LPR_CAM_ID // Camera_ID for LPR Camera
const lprControllerId = process.env.NEXT_PUBLIC_LPR_CONTROLLER_ID // webrelay Controller ID for LPR ID

async function fetcherFunc(url){
    const res = await fetch(url);
    return res.json();
    }
export default function dashboard(props) {
    const [openAccessControl, setOpenAccessControl] = useState(false);
    const [searchItem, setSearchItem] = useState('');
    const [lprWebRelay, setLprWebRelay] = useState([])

    const fetchWebRelay = async () => {
        try{
            const res = await WebRelayService.getWebRelay(lprControllerId)
            setLprWebRelay(res.data.webrelay)
        }catch(error){
            console.log('Fetch LPR Door Controller Err', error)
        }

    }
    useEffect(() => {
        fetchWebRelay()
        console.log('fetch webR')
    }, [])
    const url =`/api/cameras/${lprCamId}`; 
    const { data: camData ,error: camLoadError } = useSWR(url, fetcherFunc, {initialProps: props, revalidateOnMount: true});

    if (camLoadError) return <div>failed to load</div>
    if (!camData) return <div>loading...</div>
    return (
        <>
            <div className="bg-white shadow sm:rounded-lg lg:min-h-[800px]">
                <div className="px-4 py-5 sm:px-6">
                   <div className="flex flex-col sm:flex-row md:flex-row lg:flex-row xl:flex-row justify-evenly">
                        <div className="bg-gray-200 rounded-2xl shadow-2xl px-3 py-3 max-w-[650px]">
                           <div className="bg-black p-1 rounded-2xl ">
                             <CamAnt streamId={camData.camera?.antStreamId} camera={camData.camera} />      
                           </div>
                        </div>
                        <div className="flex flex-col">
                            <button         
                                className="inline-flex items-center px-4 py-2 border border-transparent text-lg font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                 onClick={() => setOpenAccessControl(!openAccessControl)}
                                 >
                                Manual  Gate Override
                                </button>
                         {openAccessControl &&   <WebRelayControlModal open={openAccessControl} setOpen={setOpenAccessControl} webrelay={lprWebRelay} webRelayModel={'Quad_OLD'} />}
                            <CamLprPlateCard />
                        </div>
                   </div>
                  <div className="mt-4 ">
                        
                        <div className="bg-gray-200 rounded-2xl shadow-2xl px-3 py-3 mt-2 " > 
                            <div className=" rounded-2xl px-2 py-[0.2rem]">
                                    <div className="flex flex-row justify-start items-center mb-1">
                                        <label htmlFor="search" className="block text-lg mr-2 font-medium text-black">
                                        Search Plates
                                        </label>
                                        <div className="mt-1 relative flex items-center">
                                            <input
                                            type="text"
                                            name="search"
                                            id="search"
                                            onChange={(e) => setSearchItem(e.target.value)}
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                                            />
                                            {/* <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                                                <kbd className="inline-flex items-center border border-gray-200 rounded px-2 text-sm font-sans font-medium text-gray-400">
                                                    ⌘K
                                                </kbd>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            <IncomingPlateTable searchItem={searchItem} />
                        </div>
                  </div>
                </div>
            </div>
        </>
    )
}
