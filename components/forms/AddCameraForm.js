import { useEffect, useState } from "react";
import { Dialog } from '@headlessui/react'

import LocationsService from "../services/LocationsService";

export default function AddCameraForm(props) {
    const { changeHandler, allValues, handleRegisterCamera, setOpen } = props;
    const [locations, setLocations] = useState([])
    const [step, setStep] = useState(0);

    const getAllLocation = async () => {
        const res = await LocationsService.getAllLocation ()
        setLocations(res.data.locations)
    } 
      useEffect(() => {
        getAllLocation()
    }, [])

    const verifyFirstStep = () => {
        if(allValues.deviceName === ''){
            return alert('Enter Device Name')
        }else if(allValues.location === ''){
            return alert('Select Device Location')
        }else{
            setStep(1)
        }
    }
    const verifySecondStep = () => {
        if(allValues.deviceIp === ''){
            return alert('Add Ip Address')
        }else if(allValues.devicePort === ''){
            return alert('Add Port Address')
        }else{
            setStep(2)
        }
    }
    return (
        <div>
            <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-2xl sm:text-3xl lg:text-4xl leading-6 font-medium text-gray-900">
                      Register Camera
                    </Dialog.Title>
                   {step === 0 &&<>
                        <div className="mt-4">
                            <div>
                                <label htmlFor="company-website" className="block text-lg font-medium text-gray-700">
                                Camera Device Name
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-lg">
                                Name
                                    </span>
                                    <input
                                    type="text"
                                    value={allValues.deviceName}
                                    onChange={changeHandler}
                                    name="deviceName"
                                    id="device-name"
                                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-lg border-gray-300"
                                    placeholder="Example: Lobby "
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-3">
                            <div>
                                <label htmlFor="company-website" className="block text-lg font-medium text-gray-700">
                                Camera Location
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                <select
                                id="location"
                                name="location"
                                value={allValues.location}
                                onChange={changeHandler}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-lg rounded-md"
                                defaultValue="none"
                            >
                                <option value="">None</option>
                                {locations.map((location) => (
                                    <option key={location._id}>{location.name}</option>
                                ))}
                            
                            </select>
                                </div>
                            </div>
                        </div>
                    </>}
                 {step === 1 && 
                 <>
                        <div className="mt-2">
                            <div>
                                <label htmlFor="company-website" className="block text-lg font-medium text-gray-700">
                                IP Address or Domain Name
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-lg">
                                    IP:
                                    </span>
                                    <input
                                    type="text"
                                    value={allValues.deviceIp}
                                    onChange={changeHandler}
                                    name="deviceIp"
                                    id="ip-address"
                                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-lg border-gray-300"
                                    placeholder="192.168.1.170"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-2">
                            <div>
                                <label htmlFor="company-website" className="block text-lg font-medium text-gray-700">
                                RTSP Port
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-lg">
                                    Port
                                    </span>
                                    <input
                                    type="text"
                                    onChange={changeHandler}
                                    value={allValues.devicePort}
                                    name="devicePort"
                                    id="port"
                                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-lg border-gray-300"
                                    placeholder="Example: 554"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-2">
                            <div>
                                <label htmlFor="company-website" className="block text-lg font-medium text-gray-700">
                                Stream Path
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-lg">
                                    Path
                                    </span>
                                    <input
                                    type="text"
                                    value={allValues.deviceStreamPath}
                                    onChange={changeHandler}
                                    name="deviceStreamPath"
                                    id="stream-path"
                                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-lg border-gray-300"
                                    placeholder="Vivotek Example: live1s1.sdp"
                                    />
                                </div>
                            </div>
                        </div>
                    {/* <div className="mt-2">
                        <div>
                            <label htmlFor="company-website" className="block text-lg font-medium text-gray-700">
                            Camera Stream Name
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-lg">
                               Stream Name
                                </span>
                                <input
                                type="text"
                                name="user-name"
                                id="user-name"
                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-lg border-gray-300"
                                placeholder="Enter Stream Name.."
                                />
                            </div>
                        </div>
                    </div> */}
                     </>}


                    {step === 2 && <>
                    <div className="mt-2">
                        <div>
                            <label htmlFor="company-website" className="block text-lg font-medium text-gray-700">
                             Camera UserName
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-lg">
                                Camera User Name
                                </span>
                                <input
                                type="text"
                                value={allValues.deviceUsername}
                                onChange={changeHandler}
                                name="deviceUsername"
                                id="user-name"
                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-lg border-gray-300"
                                placeholder="root, admin, etc.."
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-2">
                        <div>
                            <label htmlFor="devicePassword" className="block text-lg font-medium text-gray-700">
                            Camera Password
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-lg">
                                 Password
                                </span>
                                <input
                                type="text"
                                value={allValues.devicePassword}
                                onChange={changeHandler}
                                name="devicePassword"
                                id="user-name"
                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-lg border-gray-300"
                                placeholder="Enter Password..."
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-2">
                        <div>
                            <label htmlFor="recording" className="block text-lg font-medium text-gray-700">
                            Camera Recording
                            </label>
                            <select
                                id="recording"
                                name="recording"
                                onChange={changeHandler}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-lg rounded-md"
                                value={allValues.recording}

                                // defaultValue="none"
                            >
                                <option value="off">Recording Off</option>
                                <option value="on">Continuous Recording</option>
                            
                            </select>
                        </div>
                    </div>
                    </>}
                    {step === 0 && <>
                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                          <button
                            type="button"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                            onClick={(e) => verifyFirstStep(e)}
                          >
                           Next Step
                          </button>
                          <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                            onClick={() => setOpen(false)}
                          >
                            Cancel
                          </button>
                      </div>
                   </>}
                    {step === 1 && <>
                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                          <button
                            type="button"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                            onClick={(e) => verifySecondStep(e)}
                          >
                            Next Step
                          </button>
                          <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                            onClick={() => setStep(0)}
                          >
                            Back
                          </button>
                      </div>
                   </>}
                   {step === 2 && <>
                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                          <button
                            type="button"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                            onClick={(e) => handleRegisterCamera(e)}
                          >
                            Register
                          </button>
                          <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                            onClick={() => setStep(1)}
                          >
                            Back
                          </button>
                      </div>
                   </>}
                   
                    
                                  
                  </div>
            
        </div>
    )
}
