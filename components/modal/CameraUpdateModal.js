/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/outline'
import {  useSWRConfig } from 'swr';
import LocationsService from '../services/LocationsService';

export default function CameraUpdateModal(props) {
    const {open, setOpen,camera, updateKey, setShowEdit} = props;
    const [locations, setLocations] = useState([])
    const {mutate} = useSWRConfig()
    const cancelButtonRef = useRef(null)
    const [inputItem, setInputItem] = useState('')

    const getAllLocation = async () => {
      const res = await LocationsService.getAllLocation ()
      setLocations(res.data.locations)
    } 
    useEffect(() => {
      getAllLocation()
  }, [])

  const handleAcceptedUpdate = async(e) => {
    e.preventDefault();
    const url = `/api/cameras/${camera._id}`;
    const res = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            updateKey: updateKey ,
            updateVal: inputItem,
        })
    })
    .then(function (res) {        
        mutate('/api/cameras')
        setShowEdit(false)
        setOpen(false)
        return res.json()

        // `data` is the parsed version of the JSON returned from the above endpoint.
    }).then(function (data) {
        console.log(data)
    }).catch((err) => {
        console.log(err)
      });
  }
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={setOpen}>
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
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                    Enter New {  updateKey?.toUpperCase() === 'DEVICENAME' ? 'Name'
                    : updateKey?.toUpperCase() === 'DEVICEIP' ? ' IP or Domain ' 
                    : updateKey?.toUpperCase() === 'DEVICELOCATION' ? ' Location ' 
                    : updateKey?.toUpperCase() === 'DEVICEPORT' ? ' Port' 
                    : updateKey?.toUpperCase() === 'DEVICEUSERNAME' ? ' Username'
                    : updateKey?.toUpperCase() === 'DEVICEPASSWORD' ? ' Password'
                    : updateKey?.toUpperCase() === 'DEVICESTREAMPATH' ? 'Stream Path'
                    : 'Update Key Missing'}
                  </Dialog.Title>
                  {updateKey !== 'deviceLocation' &&
                  <div className="mt-2">
                    
                      <div className="mt-1 flex rounded-md shadow-sm">          
                          <input
                          type="text"
                          onChange={(e)=> setInputItem(e.target.value)}
                          name="update-input-modal"
                          id="update-input-modal"
                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                          placeholder={updateKey === 'deviceName' ? 
                          'Example: Gym' : updateKey === 'deviceIp' ? 
                          'Example: 192.168.1.175' : updateKey ==='devicePort' ? 
                          'Example: 554' : updateKey === 'deviceStreamPath' ? 
                          'Example: stream1' : updateKey === 'deviceUsername' ? 
                          'Example: root': updateKey === 'devicePassword' ?
                        'Enter Password' : ''  }
                          /> 
                      </div>
                    </div>
                    }
                  {updateKey === 'deviceLocation' &&
                    <div className="mt-3">
                        <div>
                            <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                            Camera Location
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                            <select
                            id="location"
                            name="location"
                            onChange={(e) => setInputItem(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            defaultValue="none"
                        >
                            <option value="">None</option>
                            {locations.map((location) => (
                                <option key={location._id}>{location.name}</option>
                            ))}
                        
                        </select>
                        </div>
                    </div>
                  </div>}
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                  onClick={(e) => handleAcceptedUpdate(e)}
                >
                 Update
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => setOpen(false)}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
