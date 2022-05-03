import { useEffect, useState } from "react";
import useSWR from "swr";

async function fetcherFunc(url){
    const res = await fetch(url);
    return res.json();
    }
export default function AddUserVehicleForm(props) {
    const {allValues, setAllValues,  changeHandler } = props;
    const [loadedLists, setLoadedLists] = useState([])
    // Handle List Members
    const handleListSelect = (e, lists) => {
        e.preventDefault()
        if(allValues.plateNum.length === 0){
            return alert('Add Plate Number First')
        }
        const filteredList = lists.filter((list) => list.list_id === e.target.value)[0]
        setAllValues( prevValues => {
            return { ...prevValues, list: filteredList !== undefined ? filteredList : null }
        })
    }

    const url ='/api/lpr-lists';
    const { data: listsData ,error } = useSWR(url, fetcherFunc, {initialProps: props, revalidateOnMount: true});
    if (error) return <div>failed to load</div>
    if (!listsData) return <div>loading...</div>

    return (
        <>
            <div className="mt-2">
            <div>
                <label htmlFor="userType" className="block text-lg font-medium text-gray-700">
                    Select Add Vehicle To Grant User Access
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                    <select
                    id="userType"
                    name="hasVehicle"
                    onChange={changeHandler}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg rounded-md"
                    value={allValues.hasVehicle }
                >
                        <option value={"false"}>No Vehicle</option>
                        <option value={"true"}>Add Vehicle</option> 

                </select>
                </div>
            </div>
        </div>
      {allValues.hasVehicle === 'true' &&  <div>
            <div className="mt-4">
                <div>
                    <label htmlFor="company-website" className="block text-lg font-medium text-gray-700">
                        Vehicle Plate Number
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-lg">
                        License Plate
                        </span>
                        <input
                        type="text"
                        value={allValues.plateNum}
                        onChange={changeHandler}
                        name="plateNum"
                        id="firstname"
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg border-gray-300"
                        // placeholder="Example: Lobby "
                        />
                    </div>
                </div>
            
            </div>
            <div className="my-4">
                <label htmlFor="userType" className="block text-lg font-medium text-gray-700">
                 Garage Access List
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                    <select
                    id="userType"
                    name="list_id"
                    onChange={(e) => handleListSelect(e,listsData.lists)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg rounded-md"
                    value={allValues.list?.list_id ? allValues.list.list_id : 'Select'}
                >       
                        <option value={null}>Select List</option>
                       {listsData.lists.map( (list) => (
                            <option key={list.list_id} value={list.list_id}>{list.title}</option>
                            )
                       )}
                       

                </select>
                </div>
            </div>
            
            <div className="mt-3">
                <div>
                    <label htmlFor="make" className="block text-lg font-medium text-gray-700">
                    Vehicle Make
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-lg">
                    Make
                        </span>
                    <input
                        type="text"
                        value={allValues.make}
                        onChange={changeHandler}
                        name="make"
                        id="make"
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg border-gray-300"
                        placeholder="BMW, Mercedez..."
                        />
                    </div>
                </div>
            </div>
            <div className="mt-2">
                <div>
                    <label htmlFor="model" className="block text-lg font-medium text-gray-700">
                    Vehicle Model
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-lg">
                            Model
                        </span>
                    <input
                        type="text"
                        value={allValues.model}
                        onChange={changeHandler}
                        name="model"
                        id="model"
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg border-gray-300"
                        // placeholder="Example: Lobby "
                        />
                    </div>
                </div>
            </div>
            <div className="mt-2">
                <div>
                    <label htmlFor="year" className="block text-lg font-medium text-gray-700">
                        Year
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-lg">
                    Year
                        </span>
                    <input
                        type="text"
                        value={allValues.year}
                        onChange={changeHandler}
                        name="year"
                        id="year"
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg border-gray-300"
                        // placeholder="Example: Lobby "
                        />
                    </div>
                </div>
            </div>
        </div>}

        
        
       </>
    )
}
