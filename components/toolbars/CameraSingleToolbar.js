import { GiMeshNetwork,GiElevator} from 'react-icons/gi'
import {
    LocationMarkerIcon
  } from '@heroicons/react/solid'
import WebRelayService from '../services/WebRelayService';
import { useEffect, useState } from 'react';
import WebRelayControlModal from '../modal/WebRelayControlModal';

export default function CameraSingleToolbar(props) {
    const {handleShowAiClips, handleShowVidClips, camera} = props;
    const [webrelays, setWebrelays] = useState([])
    const [showMain, setShowMain] = useState(true)
    const [showWebrelays, setShowWebrelays] = useState(false)
    const [selectedWebrelay, setSelectedWebrelay] = useState([]);
    const [webrelayControls, setWebrelayControls] = useState(false);

    const handleShowDoors = () => {
        setShowMain(false)
        setShowWebrelays(true)
    }
    const handleShowMain = () => {
        setShowWebrelays(false)
        setShowMain(true)
    }
    const handleShowWebrelay = (e,webrelay) => {
        e.preventDefault()
        setSelectedWebrelay(webrelay)
        setWebrelayControls(true);

    }

    useEffect(() => {
        const getLocationWebrelays = async () => {
            const res = await WebRelayService.getAllWebRelayLocation(camera.location)
            if(res.data.success){
                setWebrelays(res.data.webrelays)
            }
        }
        getLocationWebrelays()
    }, [])
    // console.log(selectedWebrelay)
    return (
            <div className="flex flex-col bg-black  rounded-xl  shadow-md text-white w-full">

                {webrelayControls && <WebRelayControlModal webrelay={selectedWebrelay} open={webrelayControls} setOpen={setWebrelayControls} />}
              <div className="px-4">
                <div className="flex items-center space-x-5 pt-2">
                  <div>
                    <h1 className="text-2xl font-bold ">{camera.name}</h1>
                  </div>
                </div>
                <div className="mt-4 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
                  <button
                    onClick={(e) => handleShowVidClips(e)}
                    type="button"
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
                  >
                    View Activity
                  </button>
                  
                    <button
                    onClick={(e) => handleShowAiClips(e)}
                    type="button"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
                  >
                    View Ai Events
                  </button>
                
                </div>
              </div>
              <div className=" bg-white text-black rounded-b-xl inset-x-0 bottom-0 mt-8 min-h-[2rem]">
                    {showMain && <div className="flex flex-col md:flex-row  justify-evenly  px-1 py-2">
                        <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 mt-2 md:mt-0 border border-transparent shadow-sm text-base font-medium rounded-md text-black opacity-75 bg-gray-300  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <LocationMarkerIcon  className="-ml-1 mr-3 h-5 w-5 " aria-hidden="true" />
                            {camera.location}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleShowDoors()}
                            className="inline-flex items-center px-4 py-2 mt-2 md:mt-0 border border-transparent shadow-sm text-base font-medium rounded-md text-black opacity-75 bg-gray-300 hover:bg-indigo-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <GiElevator  className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
                            {webrelays?.length} Door Access
                        </button>
                        {camera.aiEnabled && <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 mt-2 md:mt-0 border border-transparent shadow-sm text-base font-medium rounded-md text-black opacity-75 bg-gray-300  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <GiMeshNetwork  className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
                            {camera.aiTypes[0] === 'detect_protective_equipment' ? 'Detect Protective Equipment' : camera.aiTypes[0] === 'object_and_scene_detection'  ? 'Object Detection' : 'Facial Analysis'}
                        </button>}
                    
                    </div>}   
                    
                    {!showMain && showWebrelays && 
                        <div className="flex flex-col sm:flex-row  justify-start  px-1 py-2">
                            <button
                                onClick={() => handleShowMain()}
                                type="button"
                                className="inline-flex items-center px-4 py-2 mt-2 sm:mt-0 border border-transparent shadow-sm text-base font-medium rounded-md  opacity-75 bg-indigo-700 text-white hover:bg-gray-300 hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <GiElevator  className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
                                {webrelays?.length} Door Access
                            </button>
                            <div className="w-[80%] mt-4 sm:mt-0 px-6 flex flex-row justify-start items-center">
                                {webrelays.map((web) => 
                                <div key={web._id}> 
                                    <span onClick={(e) => handleShowWebrelay(e,web)} className=" cursor-pointer inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800">
                                        <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-indigo-400" fill="currentColor" viewBox="0 0 8 8">
                                            <circle cx={4} cy={4} r={3} className=" text-green-400 hover:text-orange-400" />
                                        </svg>{web.name} 
                                    </span>
                                </div>)}
                            </div>
                        
                        </div>     
                    }   
              </div>
            </div>
    )
}
