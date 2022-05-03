import { useEffect, useState } from "react";
import LocationsService from "../services/LocationsService";

export default function ManageLocationsToolbar(props) {
    const {gridRowAmt, setGridRowAmt, walls,handleWallChange,selectedWall, locationFilter, setLocationFilter} = props;
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
   
    const loadLocations = async() => {
        const res = await LocationsService.getAllLocation()
        setLocations(res.data.locations)

    }
    useEffect(() => {
        loadLocations()
    }, [])
    console.log(selectedWall.name)
    return (
        <div className="w-full flex flex-row">
                <div className="m-4 max-w-[300px]">
                        <label htmlFor="wall" className="block text-sm font-medium text-gray-700">
                        Wall Filter
                        </label>
                    <div className="flex flex-row items-center">
                    <select
                            id="wall"
                            name="wall"
                            onChange={(e) => handleWallChange(e)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            // defaultValue="none"
                            value={selectedWall.pin}
                        >
                            {walls.map((wall) => (
                                <option value={wall.pin} key={wall._id}>{wall.name}</option>
                            ))}
                        
                    </select>
                    </div>   
                </div>    
                <div className="m-4 max-w-[300px]">
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        Location Filter
                        </label>
                    <div className="flex flex-row items-center">
                    <select
                            id="location"
                            name="location"
                            onChange={(e) => setLocationFilter(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            // defaultValue="none"
                            value={locationFilter}
                        >
                            <option value="">None</option>
                            {locations.map((location) => (
                                <option key={location._id}>{location.name}</option>
                            ))}
                        
                    </select>
                    {selectedLocation !== "" && <a className="ml-2 text-blue-400 cursor-pointer" onClick={() => setSelectedLocation('')}>Clear</a>}
                    </div>   
                </div>    
                <div className="m-4 max-w-[300px]">
                        <label htmlFor="layout" className="block text-sm font-medium text-gray-700">
                        Layout
                        </label>
                    <div className="flex flex-row items-center">
                    <select
                            id="layout"
                            name="layout"
                            onChange={(e) => setGridRowAmt(e.target.value)}
                            className="mt-1 block w-full pl-2 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            // defaultValue="none"
                            value={gridRowAmt}
                        >
                            <option value="2">2x2</option>
                            <option value="3">3x3</option>
                    </select>
                    {selectedLocation !== "" && <a className="ml-2 text-blue-400 cursor-pointer" onClick={() => setSelectedLocation('')}>Clear</a>}
                    </div>   
                </div>    
        </div>
    )
}
