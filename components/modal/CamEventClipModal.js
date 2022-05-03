import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationIcon, XIcon } from '@heroicons/react/outline'
import axios from 'axios'
import FullPageLoader from '../FullPageLoader'
import {FcOvertime} from 'react-icons/fc'
import dateformat from 'dateformat'

export default function CamEventClipModal(props) {
    const{open,setOpen,eventTime, camera} = props;
    const [eventClips, setEventClips] = useState(null);
    const [eventsMeta, setEventsMeta] = useState(null);
    const [loadError, setLoadError] = useState(false);
    const [nextStartTime, setNextStartTime] = useState('');
    // const [loadNextUrl, setLoadNextUrl] = useState('');


    useEffect(() => {
        const url =`/api/cameras/storage?id=${camera._id}&key=video&start=${eventTime}`;
        console.log(eventTime)
        axios.get(url)
          .then((res) =>{
              console.log(res)
              setEventClips(res.data.events.objects)
              setEventsMeta(res.data.events.meta)
            //   alert(res.data.events.objects[0].end)
              setNextStartTime(res.data.events.objects[0]?.end === undefined || res.data.events.objects[0]?.end ===null ? null : res.data.events.objects[0]?.end)
            //   setLoadNextUrl(res.data.events.meta.next)
          }).catch((err) => { 
              console.log(err); 
              setLoadError(true);
          })
  
    }, [])

    const loadEventClips = (e) => {
        e.preventDefault();
        if(nextStartTime === null){
            return alert('Empty Timeframe, skip to next interval')
        }
        const url =`/api/cameras/storage?id=${camera._id}&key=nextVideo&start=${eventsMeta.next}`;
        axios.get(url)
          .then((res) =>{
              setEventClips(res.data.events.objects)
              setEventsMeta(res.data.events.meta)
              setNextStartTime(res.data.events.objects[0]?.end)
            //   setLoadNextUrl(res.data.events.meta.next)
          }).catch((err) => { 
              console.log(err); 
              setLoadError(true);
          })

    }
    // console.log(eventsMeta)

    if(!eventClips) return <h1>Loading Modal</h1>
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
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-300 sm:mx-0 sm:h-10 sm:w-10">
                            <FcOvertime className="h-6 w-8 text-blue-600" aria-hidden="true" />
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                Camera Event Clip
                            </Dialog.Title>
                            <div className="mt-8">
                               {eventClips?.map((event, evIdx) => (
                                   <div key={evIdx}>
                                        <video src={event.url} alt="Loading.." width='520px' height='580px'  
                                            controls
                                            muted
                                            autoPlay={true}
                                            loop  />
                                        <div className="divide-x-2">
                                            <h1 className="bg-gray-200 px-1 py-1 rounded flex flex-row justify-center text-lg"><strong>Start: </strong>{dateformat(new Date (event.start + 'Z'), "mmmm d, yyyy h:MM:ss TT")}</h1>
                                            <h1 className="bg-gray-200 px-1 py-1 rounded  flex flex-row justify-center text-lg"><strong>End:</strong> {dateformat(new Date (event?.end + 'Z'), "mmmm d, yyyy h:MM:ss TT")}</h1>
                                        </div>
                                   </div>
                               ))}
                            </div>
                            </div>
                        </div>
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                            {/* <button
                            type="button"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={(e) => loadEventClips(e)}
                            >
                             Next Clip
                            </button> */}
                            <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-200 shadow-sm px-4 py-2 bg-gray-300 text-base font-medium text-gray-700 hover:bg-rose-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
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
