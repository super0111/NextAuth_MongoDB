import { useRouter } from "next/router";
import CamFrame from "../../../components/camera/CamFrame"
import {
    AcademicCapIcon,
    BadgeCheckIcon,
    CashIcon,
    ClockIcon,
    ReceiptRefundIcon,
    UsersIcon,
    ArrowCircleRightIcon
  } from '@heroicons/react/outline'
import CamAnt from "../../../components/camera/CamAnt";
import useSWR from "swr";
import ManageCameraTable from "../../../components/tables/ManageCameraTable";
import { useEffect, useState } from "react";
import LocationsService from "../../../components/services/LocationsService";
  

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  
async function fetcherFunc(url){
  const res = await fetch(url);
  return res.json();
  }
export default function Main(props) {
    const router = useRouter();
    const [selectedLocation, setSelectedLocation] = useState('')
    const [locations, setLocations] = useState([])
    const [searchItem, setSearchItem] = useState('')
    
    const loadLocations = async() => {
      const res = await LocationsService.getAllLocation()
      setLocations(res.data.locations)
    }
    useEffect(() => {
        loadLocations()
    }, [])

   
    return (
      <div className="bg-white shadow sm:rounded-lg lg:min-h-[800px]">
        <div className="bg-gray-100 inset-x-0 top-0 px-4 py-5 sm:px-6">
            <div>
              <div className="m-4 max-w-[300px]">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location Filter
                </label>
              <div className="flex flex-row items-center">
                <select
                        id="location"
                        name="location"
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
                  Search Cameras
                  </label>
                  <div className="flex flex-row items-center">
                      <input
                          type="searchDevices"
                          name="searchDevices"
                          id="searchDevices"
                          onChange={ (e) => setSearchItem(e.target.value) }
                          className="shadow-sm mt-1 block w-full pl-3 pr-10 py-2 text-base focus:ring-indigo-500 focus:border-indigo-500 sm:text-xl border-gray-300 rounded-md"
                          placeholder="Search Cameras"
                      />
                  </div>
              </div>
          </div>  
          <ManageCameraTable  locationFilter={selectedLocation} searchItem={searchItem}/>
        </div>
      </div>
    </div>
    )
}
