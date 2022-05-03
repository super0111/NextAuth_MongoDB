import { useState } from "react";
import CameraUpdateModal from "../modal/CameraUpdateModal";


export default function CameraEditForm(props) {
    const {camera,setEdit,setShowEdit } = props;
    const [updateKey, setUpdateKey] = useState('')
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    
    const handleUpdateClick = (e) => {
        setUpdateKey(e.target.name)
        setShowUpdateModal(true)
        console.log('id',e.target.value)
    }
    console.log(camera)
    return (
        <div>
            {showUpdateModal && <CameraUpdateModal open={showUpdateModal} setOpen={setShowUpdateModal} setShowEdit={setShowEdit} updateKey={updateKey} camera={camera}/>}
            <div className="bg-gray-200 shadow px-4 py-5 sm:rounded-lg sm:p-6">
                    <div className="md:mt-0 md:col-span-4">
                        <div className="mt-2">
                            <div >
                                <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                                Camera Device Name 
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                Name
                                    </span>
                                    <button
                                     onClick={(e)=>handleUpdateClick(e)}
                                   
                                    type="text"
                                    name="deviceName"
                                    id="device-name"
                                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                                    >{camera.name}</button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2">
                            <div >
                                <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                                Camera Location
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                Location
                                    </span>
                                    <button
                                     onClick={(e)=>handleUpdateClick(e)}
                                   
                                    type="text"
                                    name="deviceLocation"
                                    id="device-name"
                                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                                    >{camera.location}</button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2">
                            <div >
                                <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                                IP Address or Domain Name
                                </label>
                                <div  className="mt-1 flex rounded-md shadow-sm">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                    IP:
                                    </span>
                                    <button
                                    onClick={(e)=>handleUpdateClick(e)}
                                    type="text"
                                    name="deviceIp"
                                    id="ip-address"
                                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                                    >{camera.ip}</button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2">
                            <div  >
                                <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                                RTSP Port
                                </label>
                                <div  className="mt-1 flex rounded-md shadow-sm">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                    Port
                                    </span>
                                    <button
                                    onClick={(e)=>handleUpdateClick(e)}
                                    type="text"
                                    name="devicePort"
                                    id={`${camera.port}`}
                                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                                    >{camera.port}</button>
                                </div>
                            </div>
                        </div>
                       
                        <div className="mt-2">
                            <div >
                                <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                                UserName
                                </label>
                                <div  onClick={(e)=>handleUpdateClick(e)} className="mt-1 flex rounded-md shadow-sm">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                     User Name
                                    </span>
                                    <button
                                    type="text"
                                    onClick={(e)=>handleUpdateClick(e)}
                                    name="deviceUsername"
                                    id="user-name"
                                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                                    >{camera.userName}</button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2">
                            <div >
                                <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                                Camera Password
                                </label>
                                <div onClick={(e)=>handleUpdateClick(e)} className="mt-1 flex rounded-md shadow-sm">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                    Password
                                    </span>
                                    <button
                                    type="text"
                                    name="devicePassword"
                                    id="user-name"
                                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                                    >Change Password</button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2">
                            <div >
                                <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                                Stream Path
                                </label>
                                <div onClick={(e)=>handleUpdateClick(e) } className="mt-1 flex rounded-md shadow-sm">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                    Path
                                    </span>
                                    <button
                                    type="text"
                                    name="deviceStreamPath"
                                    id="stream-path"
                                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                                    >{camera.path}</button>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>

        </div>
    )
}
