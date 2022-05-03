// Main Devices Dashboard path: /app/devices 
import { useEffect, useState } from "react";
import { FilterIcon  } from '@heroicons/react/solid'
import CameraListTable from "../../../../components/tables/CameraListTable";
import ManageCamWallsToolbar from "../../../../components/toolbars/ManageCamWallsToolbar";
import LocationsService from "../../../../components/services/LocationsService";
import WallsListTable from "../../../../components/tables/WallsListTable";

export default function index(props) {
    const [searchItem, setSearchItem] = useState('');

    return (
        <>
        <div className="bg-white shadow sm:rounded-lg lg:min-h-[800px]">
            <div className="bg-gray-100 inset-x-0 top-0 px-4 py-5 sm:px-6">
                <div className="flex flex-col md:flex-row">
                   
                    <div>
                        <div className="m-4 max-w-[300px]">
                            <label htmlFor="searchDevices" className="block text-xl font-medium text-gray-700">
                            Search Camera Walls
                            </label>
                            <div className="flex flex-row items-center">
                                <input
                                    type="searchDevices"
                                    name="searchDevices"
                                    id="searchDevices"
                                    onChange={ (e) => setSearchItem(e.target.value) }
                                    className="shadow-sm mt-1 block w-full pl-3 pr-10 py-2 text-base focus:ring-blue-500 focus:border-blue-500 sm:text-xl border-gray-300 rounded-md"
                                    placeholder="Search Walls"
                                />
                            </div>
                        </div>
                    </div>  
              </div>
                   
            </div>
            <div>
                 <div className="bg-black px-2 pb-4 ">
                   <ManageCamWallsToolbar />
                   <WallsListTable  searchItem = {searchItem} />
                 </div>
                
                
            </div>
        </div>
    </>
    )
}
