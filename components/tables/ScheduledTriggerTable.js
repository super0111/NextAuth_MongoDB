import { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import {BsTrash} from 'react-icons/bs'
import {FaSms} from "react-icons/fa"
import cronstrue from 'cronstrue';
import ScheduleTaskToggle from "../../components/ScheduleTaskToggle";
import TriggerService from "../services/TriggerService";
import { useAuthContext } from '../../contexts/AuthContext';
import WebRelayService from "../services/WebRelayService";

async function fetcherFunc(url){
    const res = await fetch(url);
    return res.json();
    }
export default function ScheduledTriggerTable(props) {
   const {searchItem} = props;
   const [editTrigger, setEditTrigger] = useState(false);
   const [selectedTrigger, setSelectedTrigger] = useState(null);
   const [webrelays, setWebrelays] = useState([])
   const  auth  = useAuthContext() // MenuContext object.
    const {mutate} = useSWRConfig()

    const handleEditTrigger = async(trigger) => {
        const updatedTrigger = await TriggerService.editTriggerStatus(trigger.cron_job_id);
        if(updatedTrigger.success){
            mutate('/api/triggers/scheduled/')
        }
    }
    const handleDeleteTrigger = async (trigger) => {
        const deleteTrigger = await TriggerService.deleteScheduledTrigger(trigger.cron_job_id);
        if(deleteTrigger.success){
        mutate('/api/triggers/scheduled/')
        }
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

    // Strip Relay Position From Endpoint URL:
    function getRelayPosition(endpoint,relay_id) {
        return endpoint.split(`${relay_id}=`)[1];
    }

    const url ='/api/triggers/scheduled/';
    const { data : triggersData,error } = useSWR(url, fetcherFunc, {initialProps: props, revalidateOnMount: true , refreshInterval: 2000});
    if (error) return <div>failed to load</div>
    if (!triggersData) return <div>loading...</div>

    return (
        <div className="flex flex-col mt-4">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                        {auth.user.userType === 0 && 
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <span >Active/Off</span>
                            </th>
                        }
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
                            Execution Time
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Door Controller
                        </th>
                        {/* <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Door Position
                        </th> */}
                        {auth.user.userType === 0 && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <span >Total Suc | Err</span>
                        </th>
                        }
                         {auth.user.userType === 0 && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <span >Delete</span>
                        </th>
                        }
                        
                        </tr>
                    </thead>
                    <tbody>
                        {triggersData?.schedules?.filter((val) => {
                            if(searchItem === '' ){
                                return val
                            } else if ( val.cron_job_name.toLowerCase().includes(searchItem.toLowerCase()) || cronstrue.toString(val.cron_expression).toLowerCase().includes(searchItem.toLowerCase()) ){
                                return val
                            }}).map((trigger, triggerIdx) => {
                           let filteredTrig = triggersData.dbSchedules.filter((dbTrigger ) => dbTrigger.cron_id === trigger.cron_job_id)[0]
                           console.log(webrelays)
                           let filteredWebrelay = webrelays.filter((webR) => webR._id === filteredTrig?.webrelay_id  )[0]
                           let filteredRelay = filteredWebrelay?.relays.filter((relay) => relay._id === filteredTrig?.relay_id  )[0]
                            let relayPosition =  getRelayPosition(trigger.url, filteredRelay?.relay_id)
                            let triggerExecAmt = Number(trigger.total_successes) + Number(trigger.total_failures)
                         
                           return <tr key={ trigger.cron_job_id} className={ triggerIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                {auth.user.userType === 0 &&   
                                 <td className="px-6 py-4 whitespace-nowrap text-right text-lg font-medium">
                                    <div className="flex flex-row justify-evenly" >
                                     
                                            <div>
                                                <ScheduleTaskToggle item={trigger} enabled={trigger.status === "1" ? true : false} setEnabled={handleEditTrigger} />
                                            </div>
                                        
                                    </div>
                                </td>
                                }
                                <td className="px-6 py-4 whitespace-nowrap text-lg font-medium text-gray-900">{trigger.cron_job_name}</td>
                                <td className="px-3 py-4 whitespace-nowrap text-lg text-black font-bold  ">{cronstrue.toString(trigger.cron_expression)}</td>
                                <td className="px-3 py-4 whitespace-nowrap text-lg text-gray-500">{filteredWebrelay?.location} {filteredRelay?.name}
                                 -{Number(relayPosition) === 1 ? 
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
                                {/* <td className="px-3 py-4 whitespace-nowrap text-lg text-gray-500">
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
                                </td>    */}
                                {auth.user.userType === 0 &&   
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-lg font-medium">
                                        <div className="flex flex-row justify-evenly" >
                                        
                                            <div>
                                               <span className=" m-1 p-1   rounded border-[0.25] border-green-500 bg-green-100 text-green-800 "> {trigger.total_successes} </span>  
                                               <span className="text-2xl font-bold">|</span> 
                                               <span className="m-1 p-1 rounded border-[0.25] border-rose-500 bg-rose-100 text-red-800">{trigger.total_failures}</span>
                                            </div>
                                            
                                        </div>
                                    </td>
                                }                              
                               
                                 {auth.user.userType === 0 &&   <td className="px-6 py-4 whitespace-nowrap text-right text-lg font-medium">
                                    <div className="flex flex-row justify-evenly">
                                      <a>
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleDeleteTrigger(trigger)}
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-lg leading-4 font-medium rounded-md shadow-sm text-white bg-gray-400 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                Delete
                                                </button>
                                                                        
                                            </a>
                                        
                                    </div>
                                </td>
                                }
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
