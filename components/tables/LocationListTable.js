import useSWR, { useSWRConfig } from "swr";
import {GrMapLocation} from "react-icons/gr"
import { useState } from "react";
import UpdateLocationModal from "../modal/UpdateLocationModal";
import LocationsService from "../services/LocationsService";

async function fetcherFunc(url){
    const res = await fetch(url);
    return res.json();
    }
export default function LocationListTable(props) {
    const { searchItem } = props;
    const [editLocation, setEditLocation] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const {mutate} = useSWRConfig()

    const handleEditLocation = (e, item) => {
        setSelectedLocation(item);
        setEditLocation(true);
    }
    const handleDeleteLocation = async (e,location) => {
        const deleteLocation = await LocationsService.deleteLocation(location._id);
        mutate("/api/locations")

    }

    const url ='/api/locations';
    const { data,error } = useSWR(url, fetcherFunc, {initialProps: props, revalidateOnMount: true});
    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>
    // console.log(data)  
    return (
        <div>
           {editLocation && <UpdateLocationModal open={editLocation} setOpen={setEditLocation} item={selectedLocation} />}
            <div className="flex flex-col mt-4">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 flex flex-row text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                            >
                               <GrMapLocation className="mr-2" size={30}/>  Name
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Edit
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Delete
                            </th>
                           
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.locations.filter((val) => {
                            if(searchItem === '' ){
                                return val
                            } else if ( val.name.toLowerCase().includes(searchItem.toLowerCase()) ){
                                return val
                            }}).map((location) => (
                            <tr key={location._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                        {/* <img className="h-10 w-10 rounded-full" src={person.image} alt="" /> */}
                                        </div>
                                        <div className="ml-4">
                                        <div className="text-md font-medium text-gray-900">{location.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td  className="px-6 py-4 whitespace-nowrap ">
                                    <span onClick ={(e) => handleEditLocation(e,location)} className="px-4 py-2 cursor-pointer inline-flex text-md leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                                        Edit
                                    </span>
                                </td>
                                <td  className="px-6 py-4 whitespace-nowrap text-right text-md font-medium ">
                                    <span onClick={(e) => handleDeleteLocation(e,location)} className="px-4 py-2 cursor-pointer inline-flex text-md leading-5 font-semibold rounded-full bg-rose-200 text-rose-800">
                                        Delete
                                    </span>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                    </div>
                </div>
                </div>
        </div>
    )
}
