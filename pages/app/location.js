import { useState } from "react";
import {HiFilter, HiOutlineFilter} from "react-icons/hi";
import LocationListTable from "../../components/tables/LocationListTable";
import ManageLocationsToolbar from "../../components/toolbars/ManageLocationsToolbar";

export default function location(props) {
    const [searchItem, setSearchItem] = useState('');
    
    return (
        <div>
            <div className="bg-gray-100 inset-x-0 top-0 px-4 py-5 sm:px-6">
                    <div className="m-4 max-w-[300px]">
                        <label htmlFor="search-user" className="block text-xl font-medium text-gray-700">
                        Search Locations
                        </label>
                        <div className="flex flex-row items-center">
                            <input
                                type="text"
                                name="search-user"
                                id="search-user"
                                autoComplete="off"
                                onChange={ (e) => setSearchItem(e.target.value) }
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-base border-gray-300 rounded-md"
                                placeholder="Enter Location"
                            />
                        </div>
                    </div>
                       
                </div>
          
                <div className="bg-black px-2 pb-4 ">
                <ManageLocationsToolbar />
                    <LocationListTable  searchItem={searchItem}/>
            </div>
        </div>
    )
}
