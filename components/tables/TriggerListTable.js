import { useEffect, useState } from 'react';
import {BsTrash} from 'react-icons/bs'
import {FaSms} from "react-icons/fa"
import useSWR from 'swr';
import { useAuthContext } from '../../contexts/AuthContext';
import WebRelayService from '../services/WebRelayService';

async function fetcherFunc(url){
    const res = await fetch(url);
    return res.json();
    }
export default function TriggerListTable(props) {
    const { handleEditItem, searchItem } = props;
    const [webrelays, setWebrelays] = useState([])
    const  auth  = useAuthContext() // MenuContext object.


     // function you can use:
     function getRelayPosition(endpoint,relay_id) {
        return endpoint.split(`${relay_id}=`)[1];
    }
      //Fetch WebRelays
      useEffect(() => {
        const getWebRelays = async() => {
            const res = await WebRelayService.getAllWebRelay()
            setWebrelays(res.data.webrelays)
            // console.log(res)
        }
        getWebRelays()
     }, [])

    const url ='/api/triggers';
    const { data,error } = useSWR(url, fetcherFunc, {initialProps: props, revalidateOnMount: true});
    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>
    // console.log(data)
    return (
        <div className="flex flex-col mt-4">
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
                     Door Controller
                    </th>
                    <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                     Position
                    </th>
                    <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                        Notifications
                    </th>
                 
                {auth.user.userType === 0 && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <span >Edit</span>
                                </th>
                                }
                                
                                </tr>
                            </thead>
                            <tbody>
                    {data.triggers.filter((val) => {
                            if(searchItem === '' ){
                                return val
                            } else if ( val.name.toLowerCase().includes(searchItem.toLowerCase()) ){
                                return val
                            }}).map((trigger, triggerIdx) => {
                                let filteredWebrelay = webrelays.filter((webR) => webR._id === trigger?.webrelay_id  )[0]
                                let filteredRelay = filteredWebrelay?.relays.filter((relay) => relay._id === trigger?.relay_id  )[0]
                                 let relayPosition =  getRelayPosition(trigger.endpoint, filteredRelay?.relay_id)
                                return <tr key={ triggerIdx} className={ triggerIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{trigger.name}</td>
                                    {/* <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{trigger.endpoint}</td> */}
                                    <td className="px-3 py-4 whitespace-nowrap text-lg text-gray-500">{filteredWebrelay?.location} {filteredRelay?.name}</td> 
                                    <td className="px-3 py-4 whitespace-nowrap text-lg text-gray-500">
                                    {Number(relayPosition) === 1 ? 
                                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-lg font-medium bg-green-100 text-green-800">
                                       Open
                                         </span> 
                                         : 
                                         Number(relayPosition) === 0 ? 
                                         
                                         <span className="inline-flex items-center px-3 py-0.5 rounded-full text-lg font-medium bg-rose-100 text-red-800">
                                            Closed
                                          </span> 
                                          :
                                          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-lg font-medium bg-orange-100 text-orange-800">
                                            Pulse
                                          </span> 
                                          }
                                        </td> 
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trigger.notifications ? (
                                        <div className="flex flex-col">
                                            <span className="inline-flex items-center px-2 py-0.5 max-w-[8rem] rounded text-sm font-medium bg-yellow-100 text-yellow-800">
                                            SMS Enabled
                                            </span>
                                            <span className="inline-flex items-center px-2 py-0.5 max-w-[8rem] rounded text-sm font-medium bg-blue-100 text-blue-800">
                                            {trigger.contact.length === "1" ? "1 Contact" : `${trigger.contact.length} Contacts `} 
                                            </span>
                                        </div>    
                                        ):( 
                                            <span className="inline-flex items-center px-2 py-0.5 max-w-[10rem] rounded text-sm font-medium bg-red-100 text-red-800">
                                                Notifications Disabled
                                            </span>
                                        )}</td>
                                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{camera.role}</td> */}
                                    
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex flex-row justify-evenly">
                                        {auth.user.userType === 0 &&  <a>
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleEditItem(e,trigger)}
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                Edit 
                                                </button>
                                                                        
                                            </a>
                                    }
                            </div>
                        </td>
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
