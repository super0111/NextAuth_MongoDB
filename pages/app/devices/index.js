// Main Devices Dashboard path: /app/devices 
import { useEffect, useState } from "react";
import { FilterIcon  } from '@heroicons/react/solid'
import CameraListTable from "../../../components/tables/CameraListTable";
import KioskListTable from "../../../components/tables/KioskListTable";
import WebrelayListTable from "../../../components/tables/WebrelayListTable";
import LocationService from "../../../components/services/LocationsService";
import LocationsService from "../../../components/services/LocationsService";
import ManageKiosksToolbar from "../../../components/toolbars/ManageKiosksToolbar";
import ManageWebRelayToolbar from "../../../components/toolbars/ManageWebRelayToolbar";
import ManageCamerasToolbar from "../../../components/toolbars/ManageCamerasToolbar";

export default function index(props) {
    const [selectedDeviceType, setSelectedDeviceType] = useState('camera');
    const [locations, setLocations] = useState([])
    const [selectedLocation, setSelectedLocation] = useState('');
    const [searchItem, setSearchItem] = useState('');
    const devices = [
        { name: 'Cameras',type:'camera', href: '?filter=camera', current: selectedDeviceType === 'camera' ? true : false },
        { name: 'Door Control',type:'webrelay', href: '?filter=webrelay', current: selectedDeviceType === 'webrelay' ? true : false }, //webrelay UI reffered to 
        { name: 'Kiosks',type:'kiosk', href: '?filter=kiosk', current: selectedDeviceType === 'kiosk' ? true : false  },
    ]
   
    const handleSelectDevice = (e,deviceType) => {
        e.preventDefault()
        setSelectedDeviceType(deviceType)
    }

    const loadLocations = async() => {
        const res = await LocationsService.getAllLocation()
        setLocations(res.data.locations)

    }
    useEffect(() => {
        loadLocations()
    }, [])

    return (
        <>
        <div className="bg-white shadow sm:rounded-lg lg:min-h-[800px]">
            <div className="bg-gray-100 inset-x-0 top-0 px-4 py-5 sm:px-6">
                <div className="flex flex-col md:flex-row">
                    <div className="m-4 max-w-[300px]">
                            <label htmlFor="location" className="block text-xl font-medium text-gray-700">
                            Location Filter
                            </label>
                        <div className="flex flex-row items-center">
                        <select
                                id="location"
                                name="location"
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xl rounded-md"
                                // defaultValue="none"
                                value={selectedLocation}
                            >
                                <option value="">None</option>
                                {locations.map((location) => (
                                    <option key={location._id}>{location.name}</option>
                                ))}
                            
                        </select>
                        {selectedLocation !== "" && <a className="ml-2 text-blue-400 cursor-pointer" onClick={() => setSelectedLocation('')}>Clear</a>}
                        </div>
                    </div>
                    <div>
                        <div className="m-4 max-w-[300px]">
                            <label htmlFor="searchDevices" className="block text-xl font-medium text-gray-700">
                            Search Devices
                            </label>
                            <div className="flex flex-row items-center">
                                <input
                                    type="searchDevices"
                                    name="searchDevices"
                                    id="searchDevices"
                                    onChange={ (e) => setSearchItem(e.target.value) }
                                    className="shadow-sm mt-1 block w-full pl-3 pr-10 py-2 text-base focus:ring-indigo-500 focus:border-indigo-500 sm:text-xl border-gray-300 rounded-md"
                                    placeholder="Search Devices"
                                />
                            </div>
                        </div>
                    </div>  
              </div>
                    <nav className="flex  overflow-x-scroll min-h-[2.8rem]" aria-label="Breadcrumb">
                            <ol role="list" className="flex items-center space-x-4">
                                <li>
                                <div>
                                    <a href="#" className="text-gray-400 hover:text-gray-500">
                                    <FilterIcon className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
                                    <span className="sr-only">Filter</span>
                                    </a>
                                </div>
                                </li>
                                {devices.map((device) => (
                                <li key={device.name}>
                                    <div onClick={(e) => handleSelectDevice(e,device.type)} className="flex items-center">
                                        <svg
                                            className="flex-shrink-0 h-5 w-5 text-gray-300"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            aria-hidden="true"
                                        >
                                            <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                                        </svg>
                                        <a
                                            href={device.href}
                                            className={device.current ?"ml-4 text-xl font-medium text-blue-700 hover:text-gray-700"  :"ml-4 text-xl font-medium text-gray-500 hover:text-gray-700"}
                                            aria-current={device.current ? 'page' : undefined}
                                        >
                                            {device.name}  
                                        </a>
                                    </div>
                                </li>
                                ))}
                            </ol>
                        </nav>
            </div>
            <div>
                {selectedDeviceType === 'camera' &&
                 <div className="bg-black px-2 pb-4 ">
                   <ManageCamerasToolbar />
                   <CameraListTable locationFilter = {selectedLocation} searchItem = {searchItem} />
                 </div>}
                {selectedDeviceType === 'webrelay' && 
                   <div className="bg-black px-2 pb-4">
                       <ManageWebRelayToolbar />
                       <WebrelayListTable locationFilter = {selectedLocation}  searchItem = {searchItem} />
                    </div>}
                {selectedDeviceType === 'kiosk' &&
                 <div className="bg-black px-2 pb-4">
                   <ManageKiosksToolbar />
                   <KioskListTable locationFilter = {selectedLocation}  searchItem = {searchItem}/>
                 </div>}
                
            </div>
        </div>
    </>
    )
}
