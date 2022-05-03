import { createRef, Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationIcon, XIcon } from '@heroicons/react/outline'
import axios from 'axios'
import FullPageLoader from '../FullPageLoader'
import {GiCarWheel, GiMeshNetwork,GiTruck} from 'react-icons/gi'
import {VscPerson} from 'react-icons/vsc'
import {FaCar,FaHeadSideMask} from 'react-icons/fa'
import {GiRoad} from 'react-icons/gi'
import {BsClockHistory} from 'react-icons/bs'
import dateformat from 'dateformat'

export default function AiBoxModal(props) {
    const{open,setOpen,event, camera} = props
    const [eventLabels, setEventLabels] = useState(null);
    const [confidentLabels, setConfidentLabels] = useState([])
    const [loadError, setLoadError] = useState(false)
    const [eventBoundingBoxes, setEventBoundingBoxes] = useState([]);
    const [params, setParams] = useState({})
    const [aiEventClip, setAiEventClip] = useState(null);
    const [showAiClip, setShowAiClip] = useState(true);
    const [imgHeight, setImgHeight] = useState('');
    const [imgWidth, setImgWidth] = useState('');

    const getAiEventClip = (e) => {
        e.preventDefault()
        // const url =`/api/cameras/storage?id=${camera._id}&key=video&start=${event.time}`;
        // axios.get(url)
        //   .then((res) =>{
        //       console.log(res.data)
        //       setAiEventClip(res.data.events.objects)
        //     //   setShowAiClip(true)
        //   }).catch((err) => { 
        //       console.log(err); 
        //       setLoadError(true);
        //   })
  
    }

    //Get Event Video Clip
    useEffect(() => {

        const url =`/api/cameras/storage?id=${camera._id}&key=video&start=${event.time}`;
        axios.get(url)
          .then((res) =>{
              console.log(res)
              setAiEventClip(res.data.events.objects)
              setShowAiClip(true)
          }).catch((err) => { 
              console.log(err); 
              setLoadError(true);
          })
    }, [])

    // Get Event Labels from MetaData
    useEffect(() => {
        const url = event.filemeta.download.url
        {/*Object and Scene Detection Event*/}
        if(event.name === 'object_and_scene_detection'){
            axios.get(url)
                .then((res) =>{
                    console.log(res)
                    const confidentList = res.data.Labels.filter((label) => label.Confidence > 83.02 && label.Instances.length === 0) // No Bounding Box value, High Confidence
                    const filteredList = res.data.Labels.filter((label) => label.Confidence > 80.02 && label.Instances.length !== 0)
                    setEventLabels(filteredList)
                //   setEventClips(res.data.events.objects)
                //   setEventsMeta(res.data.events.meta)
                //   setLoadNextUrl(res.data.events.meta.next)
                }).catch((err) => { 
                    console.log(err); 
                    setLoadError(true);
            })
        }else if(event.name === 'detect_protective_equipment'){
            axios.get(url)
                .then((res) =>{
                    console.log(res)
                    setEventLabels(res.data.Persons.filter((p) => p.Confidence > 50)) //72% Confidence
                //   setEventClips(res.data.events.objects)
                //   setEventsMeta(res.data.events.meta)
                //   setLoadNextUrl(res.data.events.meta.next)
                }).catch((err) => { 
                    console.log(err); 
                    setLoadError(true);
                })
        }
    }, [])
    
    // useEffect(() => {
    //        if(event.name === 'object_and_scene_detection' && eventLabels && imgRef.current !== null){
    //             eventLabels.map((label) =>{    
    //                 eventBoundingBoxes.push( {coord:[Number(label.Instances[0].BoundingBox.Left)* 100, Number(label.Instances[0].BoundingBox.Top)* 100, Number(label.Instances[0].BoundingBox.Width)* 1000, Number(label.Instances[0].BoundingBox.Height)* 1000], label: label.Name})
    //                 // console.log('push', label)
    //             })
    //             alert('ran')
    //        }else if ( event.name === 'detect_protective_equipment' && eventLabels && imgRef.current !== null){
    //             eventLabels.map((label) => {
    //                 eventBoundingBoxes.push( {coord:[Number(label.BoundingBox.Left)* 1000, Number(label.BoundingBox.Top)* 1000, Number(label.BoundingBox.Width)* 1000, Number(label.BoundingBox.Height)* 1000], label:'Person'})
    //             })
    //         }
    // }, [imgRef])
    
    const imgRef = createRef()

    const getImgDimensions = () => {
        const height = imgRef.current.clientHeight
        const width = imgRef.current.clientWidth
        setImgHeight(height)
        setImgWidth(width)
        // alert(`
        //   Height : ${height}
        //   Width : ${width}
        // `)
        if(event.name === 'object_and_scene_detection' && eventLabels && imgRef.current !== null){
            eventLabels.map((label) =>{    
                eventBoundingBoxes.push( {coord:[Number(label.Instances[0].BoundingBox.Left)* width, Number(label.Instances[0].BoundingBox.Top)* height, Number(label.Instances[0].BoundingBox.Width)* width, Number(label.Instances[0].BoundingBox.Height)* height], label: label.Name})
                // console.log('push', label)
            })
            // alert('ran')
       }else if ( event.name === 'detect_protective_equipment' && eventLabels && imgRef.current !== null){
            eventLabels.map((label) => {
                eventBoundingBoxes.push( {coord:[Number(label.BoundingBox.Left)* width, Number(label.BoundingBox.Top) * height, Number(label.BoundingBox.Width)* width, Number(label.BoundingBox.Height) * height], label:'Person'})
            })
        }
        
    }
    const handleViewAiSpot = (e) => {
        e.preventDefault()
        setShowAiClip(false)
        console.log(imgRef)
        
    }

    if(!event || !eventLabels || !aiEventClip ) return <h1> Loading.. </h1>
        console.log(event, eventBoundingBoxes)
    return (
        <div>
             <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto w-full " onClose={setOpen}>
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
                        <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                            <button
                            type="button"
                            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={() => setOpen(false)}
                            >
                            <span className="sr-only">Close</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                        </div>
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                            <GiMeshNetwork className="h-6 w-8 text-blue-600" aria-hidden="true" />
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <Dialog.Title as="h3" className="flex flex-row text-lg leading-6 font-medium text-gray-900">
                                Ai Event 
                                <span className="inline-flex shadow-2xl items-center ml-2 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-gray-800">
                                    {event.name === "detect_protective_equipment" ? "PPE" : "object_and_scene_detection" ?  "Object" : ""}
                                </span>
                                <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-800">
                                    {dateformat(event.time +  'Z', "DDDD mm/dd/yyyy")}
                                </span>
                               {showAiClip ?
                                <span  onClick ={(e) => handleViewAiSpot(e)} className=" cursor-pointer inline-flex items-center ml-2 px-2 py-0.5 rounded text-xs font-medium bg-orange-200 text-gray-800">
                                    Ai Spot {' '}<GiMeshNetwork className="ml-1"/>
                                </span>
                                :
                                <span  onClick ={() => setShowAiClip(true)} className=" cursor-pointer inline-flex items-center ml-2 px-2 py-0.5 rounded text-xs font-medium bg-orange-200 text-gray-800">
                                View  Clip {' '}<BsClockHistory className="ml-1"/>
                                </span>
                                }
                            </Dialog.Title>
                            <div className="mt-2">
                            
                                <div>
                                   
                                    {showAiClip ?(
                                            <video src={aiEventClip[0]?.url} alt="Loading.." width='520px' height='580px'  
                                            controls
                                            muted
                                            autoPlay={"autoplay"}
                                            preload="auto"
                                            loop   
                                            />
                                        ):(
                                            <div className="relative ">
                                                <div className="asbolute top-0 left-0 right-0 bottom-0">
                                                    {eventBoundingBoxes.map((box,idx) => (
                                                        <svg key={idx} viewBox={`0 0 ${imgWidth} ${imgHeight}`} className="absolute top-0  left-0">
                                                            <rect x={box.coord[0]} y={box.coord[1]} width={box.coord[2]} height={box.coord[3]} className="fill-transparent stroke-green-400 stroke-[2.6px] opacity-90">
                                                            
                                                            </rect>
                                                        </svg>
                                                    ))}
                                                </div>
                                                 <img ref={imgRef} onLoad={() => getImgDimensions()} src={event.thumb.url} alt="Loading.." /> 
                                            </div>
                                        )
                                    }

                                </div>

                            {/* Meta Data */}
                                <div className="mt-2">
                                    {/* {eventLabels && eventLabels.map((label, idx) => (
                                        <div key={idx}>
                                            <span className="inline-flex m-1 items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                            {label.Name}
                                            </span>
                                        </div>
                                    ))} */}
                                    {event.name === ('object_and_scene_detection') && event.meta.Person &&
                                        <span className="inline-flex m-1 items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                        <VscPerson  className="h-4 w-4"/>
                                            {event.meta.Person === "1" ? '1 Person' : event.meta.Person+' People' } 
                                        </span>
                                    }
                                    {event.meta.Persons &&
                                        <span className="inline-flex m-1 items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                        <VscPerson  className="h-4 w-4"/>
                                            {event.meta.Persons === "1" ? '1 Person' : event.meta.Persons +' People' } 
                                        </span>
                                    }
                                     {event.meta.Face &&
                                        <span className="inline-flex m-1 items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                        <FaHeadSideMask className="h-4 w-4"/>
                                            {event.meta.Face === "1" ? '1 Face' : event.meta.Face +' Faces' } 
                                        </span>
                                    }
                                     {event.meta.Face_without_mask &&
                                        <span className="inline-flex m-1 items-center px-3 py-0.5 rounded-full text-sm font-medium bg-rose-100 text-rose-800">
                                        <FaHeadSideMask className="h-4 w-4 mr-2"/>
                                            {event.meta.Face_without_mask === "1" ? '1 No Mask' : event.meta.Face_without_mask +'  No Mask' } 
                                        </span>
                                    }
                                    {event.meta.Car &&
                                        <span onClick={() => setEventBoundingBoxes(eventBoundingBoxes)} className="inline-flex m-1 items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                        <FaCar  className="h-4 w-4 "/>
                                            {event.meta.Car === "1" ? '1 Car' : event.meta.Car+' Cars' } 
                                        </span>
                                    }

                                    {event.name === ('object_and_scene_detection') && event.meta.Wheel &&
                                        <span className="inline-flex m-1 items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                        <GiCarWheel className="h-4 w-4"/>
                                            {event.meta.Wheel === "0" ? 'Wheel Detected' :  event.meta.Wheel === "1"  ? '1 Wheel' : event.meta.Wheel +' Wheels' } 
                                        </span>
                                    }
                                     {/* {event.meta.Vehicle &&
                                        <span className="inline-flex m-1 items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                        <FaCar  className="h-4 w-4"/>
                                            {event.meta.Vehicle === "1" ? '1 Vehicle' : event.meta.Vehicle+' Vehicles' } 
                                        </span>
                                    } */}
                                    {event.meta.Road &&
                                        <span className="inline-flex m-1 items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                        <GiRoad className="h-4 w-4"/>
                                            {event.meta.Road === "0" ? '1 Road' : event.meta.Road+' Roads' } 
                                        </span>
                                    }
                                     {event.meta.Truck !== "0" && event.meta.Truck &&
                                        <span className="inline-flex m-1 items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                        <GiTruck  className="h-4 w-4"/>
                                            {event.meta.Truck === "1" ? '1 Truck ' : event.meta.Transportation +' Trucks'}
                                        </span>
                                        
                                    }
                                </div>
                                <div>
                                    {confidentLabels && confidentLabels.map((label) => (
                                        <>
                                             {event.meta.Tarmac || event.meta.Asphalt &&
                                                    <span className="inline-flex m-1 items-center px-3 py-0.5 rounded-full text-sm font-medium bg-rose-600 text-rose-800">
                                                    <GiRoad className="h-4 w-4"/>
                                                        {event.meta.Road === "0" ? '1 Road' : event.meta.Road+' Roads' } 
                                                    </span>
                                                }
                                                {event.meta.Wheels && 
                                                 <span className="inline-flex m-1 items-center px-3 py-0.5 rounded-full text-sm font-medium bg-rose-600 text-rose-800">
                                                <GiCarWheel className="h-4 w-4"/>
                                                     {event.meta.Road === "0" ? '1 Road' : event.meta.Road+' Roads' } 
                                                 </span>
                                               }
                                        </>
                                    ))}
                                </div>
                            </div>
                            </div>
                        </div>
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                           
                            <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-300 hover:bg-rose-400 hover:text-white text-base font-medium text-gray-700  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                            onClick={() => setOpen(false)}
                            >
                            Close
                            </button>
                        </div>
                        </div>
                    </Transition.Child>
                    </div>
                </Dialog>
                </Transition.Root>
        </div>
    )
}
