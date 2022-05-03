import Link from "next/link";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { useAuthContext } from "../../contexts/AuthContext";
import TriggerService from "../services/TriggerService";

async function fetcherFunc(url){
    const res = await fetch(url);
    return res.json();
    }
export default function ManageLprListTable(props) {    
    const  auth  = useAuthContext() // MenuContext object.
    const [triggers, setTriggers] = useState([]);

    const fetchTriggers = async () => {
        const res = await TriggerService.getAllTriggers()
        if(res.data.success){
            setTriggers(res.data.triggers)
        }
    }
    useEffect(() => {
        fetchTriggers()
    }, [])
    const url ='/api/lpr-lists';
    const { data,error } = useSWR(url, fetcherFunc, {initialProps: props, revalidateOnMount: true});
    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>
    console.log('Fetched Lists', data.lists)
    // Needs Error Handling for Load Error (Currently Hides Map) To Do


    return (
        <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                    <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                        Name
                    </th>
                    <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                        Members
                    </th>
                    <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                        Type
                    </th>
                    {/* <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                        Group
                    </th> */}
                    <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                        Trigger
                    </th>
                    {auth.user.userType === 0 && <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">View</span>
                    </th>}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data?.lists?.map((list) => {
                        const trigger_id = new URLSearchParams(list.callback_url).get('trigger_id')
                        let filteredTrig = triggers.filter((trig) => trig._id === trigger_id)[0]
                    return <tr key={list.list_id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                            {/* <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full" src={list.image} alt="" />
                            </div> */}
                            <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{list.title}</div>
                            <div className="text-sm text-gray-500">{list.type}</div>
                            </div>
                        </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                {list.members.length > 1 ? `${list.members.length} Members`: `${list.members.length} Member`} 
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                           {list.type === 'whitelist' ?
                            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                               Whitelist
                            </span>:
                             <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-rose-100 text-rose-800">
                             Blacklist
                           </span>}
                        </div>
                        {/* <div className="text-sm text-gray-500">{list.department}</div> */}
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap">
                        {list.group_id !== '' ? <div className="text-sm text-gray-900">{list.group_id}</div> : 'N/A'}
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                           {filteredTrig?.name}
                        </span>
                        </td>
                       {auth.user.userType === 0 && <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium ">
                            <span className="px-4 py-2 cursor-pointer inline-flex text-md leading-5 font-semibold rounded-full  bg-blue-300 text-blue-800">
                                    <Link  href={`/app/lists/${list.list_id}`}>View</Link>
                            </span>
                        </td>}
                
                    </tr>
                    }).reverse()}
                </tbody>
                </table>
            </div>
            </div>
        </div>
        </div>
    )
}
