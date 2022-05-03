/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { PhoneIcon, PlayIcon, XIcon } from '@heroicons/react/outline'
import axios from 'axios';
import CamAnt from '../camera/CamAnt';
import useSWR from "swr";
import WebRelayControl from '../section/WebRelayQuadOldControl';
import CameraService from '../services/CameraService';
import WebRelayService from '../services/WebRelayService';
import KioskAntPlay from '../kiosks/KioskAntPlay';
import KioskControllerAntPublish from '../kiosks/KioskControllerAntPublish';
import CamSinglePlayer from '../camera/players/CamSinglePlayer';
import CamAntPublish from '../camera/players/CamAntPublish';

async function fetcherFunc(url){
    const res = await fetch(url);
    return res.json();
    }
export default function KioskControlModal(props) {
    const {open,setOpen, kiosk } = props;
    const [startCall, setStartCall] = useState(false);
    const [webRelay, setWebRelay] = useState({});
    const [camera, setCamera] = useState(null)
    
    const callsToAction = [
        // { name: startCall ?  'Hide Kiosk':'Show Kiosk',  
        //     onClick: startCall ?  () => handleEndCall() : () => setStartCall(true),
        //     icon: PhoneIcon , 
        //     background: startCall ? "bg-red-300" :  "bg-green-300" },
        { name: 'Close', onClick: () => setOpen(false) , icon: XIcon, background: "bg-red-300" },
      ]
    
    const handleEndCall = async(e) => {
        const res = await axios.delete(`https://${process.env.NEXT_PUBLIC_MEDIA_SERVER_DOMAIN}:${process.env.NEXT_PUBLIC_MEDIA_SERVER_SECURE_PORT}/WebRTCAppEE/rest/v2/broadcasts/kiosk-1234`) //Move TO Backend
        setStartCall(false)
    } 
    const getKioskCamera = async (kiosk) => {
      const res = await CameraService.getCamera(kiosk.camera_id)
      res.data.camera.antStreamId = kiosk.kiosk_id //remove for kiosks with IPcamera instead of tablet cam
      setCamera(res.data.camera)
    }
    const getKioskWebRelay = async (kiosk) => {
        const res = await WebRelayService.getWebRelay(kiosk.webrelay_id)
        setWebRelay(res.data.webrelay)
    }
  useEffect(() => {
      getKioskCamera(kiosk)
      getKioskWebRelay(kiosk)
  }, [])
  
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={setOpen}>
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay className="absolute inset-0" />

          <div className="fixed inset-y-0 right-0  max-w-full flex sm:pl-16">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-screen max-w-2xl">
                <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900">Panel title</Dialog.Title>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          type="button"
                          className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={() => setOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 relative flex-1 px-4 sm:px-6">
                    {/* Start Content */}

                    {/* Call To Actions */}
                    <div className="px-5 py-5 flex flex-row justify-between bg-gray-50 space-y-6 sm:flex sm:space-y-0 sm:space-x-10 sm:px-8">
                        {callsToAction.map((item) => (
                            <div key={item.name} className="flow-root ">
                            <a
                                onClick={item.onClick}
                                className={`-m-3 p-3 cursor-pointer flex items-center rounded-md text-base font-medium text-gray-900 hover:${item.background} transition ease-in-out duration-150`}
                            >
                                <item.icon className="flex-shrink-0 h-6 w-6 text-gray-400" aria-hidden="true" />
                                <span className="ml-3">{item.name}</span>
                            </a>
                            </div>
                        ))}
                    </div>

                     {/* Video Component*/}
               
                    {camera && 
                          <div className="w-full relative">
                           
                              <div className="w-full max-h-[500px]">
                                <CamSinglePlayer  maxHeight="400px" camera={camera} />
                              </div>
                              <div className="w-[130px] sm:w-[200px] absolute top-2 right-2 z-[1000]">
                                <KioskControllerAntPublish kiosk_id = {`${kiosk.kiosk_id}-manager`} /> {/* set kiosk manager stream_id*/}
                              </div>
                           </div>
                          }

                        {/* Control Panel */}
                        <WebRelayControl webrelay={webRelay} />
                
                    {/* /End Content */}
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
