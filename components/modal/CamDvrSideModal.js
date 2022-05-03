/* This example requires Tailwind CSS v2.0+ */
import CamDVR from "../camera/players/dvr/CamDVR";
import CamDvrCustom from "../camera/CamDvrCustom";
import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { PhoneIcon, PlayIcon, XIcon } from '@heroicons/react/outline'

export default function CamDvrSideModal(props) {
    const {open, setOpen, camera} = props;

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={setOpen}>
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay className="absolute inset-0" />

          <div className="fixed inset-y-0 right-0  max-w-full flex sm:pl-16 z-[100000000]">
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
                    <div className="flex items-start justify-between  mt-16" >
                      <Dialog.Title className="text-3xl font-medium text-gray-900">Camera Recordings</Dialog.Title>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          type="button"
                          className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
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

                    <div className="mt-3 text-center sm:mt-5 ">
                        <div className="mt-2 max-w-[850px]">
                            {/* <CamDvrCustom camera={camera} /> */}
                            <CamDVR camera={camera} />
                        </div>
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
