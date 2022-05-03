/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { PhoneIcon, PlayIcon, XIcon } from '@heroicons/react/outline'
import useSWR, { useSWRConfig } from "swr";
import WebRelayQuadOldControl from '../section/WebRelayQuadOldControl';
import WebRelayX410Control from '../section/WebRelayX410Control';


export default function WebRelayControlModal(props) {
    const {open,setOpen,webrelay } = props;
    console.log(webrelay)
    const callsToAction = [
        { name: 'Close', onClick: () => setOpen(false) , icon: XIcon, background: "bg-red-300" },
      ]
      

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

                        {/* Control Panel */}
                      <div >
                       {webrelay.model === 'Quad_OLD' && <WebRelayQuadOldControl webrelay={webrelay} />}
                       {(webrelay.model === 'X410' || webrelay.model === 'X401') && <WebRelayX410Control webrelay={webrelay} />}

                      </div>
                
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
