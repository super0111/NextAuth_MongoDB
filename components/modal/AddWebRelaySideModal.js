/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { PhoneIcon, PlayIcon, XIcon } from '@heroicons/react/outline'
import TriggerService from '../services/TriggerService';
import { useSWRConfig } from 'swr';
import { Router, useRouter } from 'next/router';
import LocationsService from '../services/LocationsService';



export default function AddWebRelaySideModal(props) {
    const { setOpen, open} = props;
    const [relays, setRelays] = useState([])
    const [showRelays, setShowRelays] = useState(false)
   const [locations, setLocations] = useState([])
    const cancelButtonRef = useRef(null)
    const {mutate} = useSWRConfig()
    const [formStep, setFormStep] = useState(0);

    const [allValues, setAllValues] = useState({
       name: '',
       location:'',
       ip:'',
       port:'',
       location:'',
       model:'',
       username:'',
       password:''
    });

    
    const changeHandler = e => {
        setAllValues( prevValues => {
        return { ...prevValues,[e.target.name]: e.target.value}
        })
    }

 
    const handleAddItem = async(e) => {
        e.preventDefault();
        // console.log(contactInput.phone.length)
        const url = '/api/webrelays';
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: allValues.name,
                location: allValues.location,
                ip: allValues.ip,
                port: allValues.port,
                model: allValues.model,
                userName: allValues.username,
                password: allValues.password,
                relays: relays
            })
        })
        .then(function (res) {
            if(res.ok){
                return res.json()
            }
            // `data` is the parsed version of the JSON returned from the above endpoint.
        }).then(function (data) {
            console.log('WebRelay Added 🎉 ')
            mutate('/api/webrelays?action=retrieve&action_type=all')
            setOpen(false)
        }).catch((err) => {
            console.log(err)
          });
        }

    const getAllLocation = async () => {
        const res = await LocationsService.getAllLocation ()
        setLocations(res.data.locations)
    } 
   
    const setRelayAmount = (model) => {
        if(model === "Quad_OLD"){
            setRelays([
                {relay_id: 'relay1state', name:''},
                {relay_id: 'relay2state', name:''},
                {relay_id: 'relay3state', name:''},
                {relay_id: 'relay4state', name:''}
            ])
            setShowRelays(true)
        }else if(model === "X410"){
            // Model X410 (Newer - Quad)
            setRelays([
                {relay_id: 'relay1', name:''},
                {relay_id: 'relay2', name:''},
                {relay_id: 'relay3', name:''},
                {relay_id: 'relay4', name:''},
            ])
            setShowRelays(true)
        }else if(model === "X401"){
            // Model X401 (Newer - Dual)
            setRelays([
                {relay_id: 'relay1', name:''},
                {relay_id: 'relay2', name:''},
                
            ])
            setShowRelays(true)
        }else{
            setShowRelays(false)
            setRelays([])

        }
    }
 
    const handleRelayName = (e, relay, idx) => {
        e.preventDefault()
        relays[idx].name = e.target.value
    }
    useEffect(() => {
        getAllLocation()
    }, [])

    useEffect(() => {
        if(allValues.model !== ''){
            setRelayAmount(allValues.model)
        }else if (allValues.model !== 'none'){
            setRelayAmount('none')
        }
    }, [allValues.model])

    const handleViewSecondStep = (e) => {
        e.preventDefault()
        if ( allValues.name === ''){
            return alert('Forgot To Add Name')
        }else  if ( allValues.ip === '' || allValues.ip.length < 4){
            return alert('Finish Adding IP Address')
        }
        setFormStep(1) // 0 , 1 , 2-submit
    }
    const handleViewThirdStep = (e) => {
        e.preventDefault()
        if ( allValues.usernam === ''){
            return alert('Add Username!')
        }
        setFormStep(2) // 0 , 1 , 2-submit
    }
    

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={setOpen}>
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay className="absolute inset-0" />

          <div className="fixed inset-y-0 right-0  max-w-full flex sm:pl-16 ">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-screen max-w-2xl ">
                <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900">Panel title</Dialog.Title>
                      <div className="ml-3 h-7 flex items-center">
                        {/* <button
                          type="button"
                          className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={() => setOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button> */}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 relative flex-1 px-4 sm:px-6">
                    {/* Start Content */}
                    <div className="ml-3 h-7 flex items-center">
                       <div className="flex flex-row justify-between w-full">
                       <button
                          type="button"
                          className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={() => setOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <XIcon className="h-6 w-6 text-red-400" aria-hidden="true" />
                        </button>
                        <span className="text-blue-500 font-bold text-xl">Add WebRelay</span>
                       </div>
                      </div>
                        
                        <div className="mt-6">
                           <div>
                           <div>
                                {formStep === 0 && (
                                    <>
                                        <div className="mt-4">
                                        <div>
                                            <label htmlFor="company-website" className="block text-lg text-black font-bold">
                                        WebRelay Name
                                            </label>
                                            <div className="mt-1 flex rounded-md shadow-sm">
                                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                            Name
                                                </span>
                                                <input
                                                type="text"
                                                onChange={changeHandler}
                                                name="name"
                                                id="name"
                                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                                                placeholder="Example: Lobby Kiosk"
                                                value={allValues.name}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <div>
                                            <label htmlFor="company-website" className="block text-lg text-black font-bold">
                                        WebRelay Location
                                            </label>
                                            <div className="mt-1 flex rounded-md shadow-sm">
                                            <select
                                            id="location"
                                            name="location"
                                            onChange={changeHandler}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                            value={allValues.location}
                                        >
                                            <option value="">None</option>
                                            {locations.map((location) => (
                                                <option key={location._id}>{location.name}</option>
                                            ))}
                                        
                                        </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                    <div>
                                        <label htmlFor="company-website" className="block text-lg text-black font-bold">
                                        IP Address or Domain Name
                                        </label>
                                        <div className="mt-1 flex rounded-md shadow-sm">
                                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                            IP:
                                            </span>
                                            <input
                                            type="text"
                                            onChange={changeHandler}
                                            name="ip"
                                            id="ip-address"
                                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                                            placeholder="IP Address"
                                            value={allValues.ip}
                                            />
                                        </div>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <div>
                                            <label htmlFor="company-website" className="block text-lg text-black font-bold">
                                            Port
                                            </label>
                                            <div className="mt-1 flex rounded-md shadow-sm">
                                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                                Port
                                                </span>
                                                <input
                                                type="text"
                                                onChange={changeHandler}
                                                name="port"
                                                id="port"
                                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                                                placeholder="Port"
                                                value={allValues.port}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                                )}
                               {formStep === 1 && (
                                   <>
                                    <div className="mt-2">
                                    <div>
                                        <label htmlFor="company-website" className="block text-lg text-black font-bold">
                                        Username
                                        </label>
                                        <div className="mt-1 flex rounded-md shadow-sm">
                                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                            Username
                                            </span>
                                            <input
                                            type="text"
                                            onChange={changeHandler}
                                            name="username"
                                            id="port"
                                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                                            placeholder="Example: admin"
                                            value={allValues.username}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="company-website" className="block text-lg text-black font-bold">
                                        Password
                                        </label>
                                        <div className="mt-1 flex rounded-md shadow-sm">
                                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                            Password
                                            </span>
                                            <input
                                            type="text"
                                            onChange={changeHandler}
                                            name="password"
                                            id="port"
                                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                                            placeholder=""
                                            value={allValues.password}
                                            />
                                        </div>
                                    </div>
                                </div>
                                </>
                                )}
                                {formStep === 2 && (
                                    <>
                                    <div className="mt-4">
                                    <div>
                                        <label htmlFor="company-website" className="block text-lg text-black font-bold">
                                       WebRelay Model
                                        </label>
                                        <div className="mt-1 flex rounded-md shadow-sm">
                                        <select
                                        id="model"
                                        name="model"
                                        onChange={changeHandler}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        value={allValues.model}
                                    >
                                        <option value="none">Select Model</option>
                                        <option value="Quad_OLD">Quad (4-Port)</option>
                                        <option value="X401">X401 (2-Port)</option>
                                        <option value="X410">X410 (4-Port)</option>
                                    </select>
                                        </div>
                                    </div>
                                </div>
                                {showRelays && 
                                <div className="mt-4">
                                    {relays.map((relay,idx) => (
                                        <div key={idx}>
                                            <label htmlFor="company-website" className="block text-lg text-black font-bold">
                                            {idx === 0 ? 'Relay 1' : idx === 1 ? 'Relay 2' : idx === 2 ? 'Relay 3' :  'Relay 4' }
                                            </label>
                                            <div className="mt-1 flex rounded-md shadow-sm">
                                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                                Name
                                                </span>
                                                <input
                                                type="text"
                                                onChange={(e) => handleRelayName(e, relay, idx)}
                                                name="name"
                                                id="port"
                                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                                                placeholder="Example: Door 1"
                                                />
                                            </div>
                                        </div>    
                                    ))}
                                </div>
                                }
                                </>
                             )}
                            </div>
                        </div>
                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        {formStep === 0 && <button
                                type="button"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                                onClick={(e) => handleViewSecondStep(e)}
                            >
                            Continue
                            </button>}
                        {formStep === 1 && <button
                                type="button"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                                onClick={(e) => handleViewThirdStep(e)}
                            >
                            Continue
                            </button>}
                           {formStep === 2 && <button
                                type="button"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                                onClick={(e) => handleAddItem(e)}
                            >
                            Add WebRelay
                            </button>}
                           {formStep > 0 && <button
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                                onClick={() => setFormStep(formStep - 1  )}
                                ref={cancelButtonRef}
                            >
                               Back
                            </button>}
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
