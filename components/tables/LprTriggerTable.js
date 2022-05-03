/* This example requires Tailwind CSS v2.0+ */
import { CalendarIcon, LocationMarkerIcon, UsersIcon, ChatAltIcon, CogIcon } from '@heroicons/react/solid'
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import useSWR from 'swr';
import WebRelayService from '../services/WebRelayService';
import EditListTriggerModal from '../../components/modal/EditListTriggerModal';

async function fetcherFunc(url){
    const res = await fetch(url);
    return res.json();
    }
export default function LprTriggerTable(props) {
    const { list } = props;
    const [editListTrigger, setEditListTrigger] = useState(false);
    const [trigger, setTrigger] = useState({});
    const [loadingTrigger, setLoadingTrigger] = useState(false)
    const [loadTriggerError, setLoadTriggerError] = useState(false)
    const [triggerWebRelay, setTriggerWebRelay] = useState({});

    const triggers = [
        {
          id: 1,
          endpoint: list.callback_url,
          type:list.type,
          title: 'Back End Developer',
          location: 'Garage',
          department: 'Engineering',
          closeDate: '2020-01-07',
          closeDateFull: 'January 7, 2020',
        }
    ]
    //Get trigger_id query Param
 
    const trigger_id = new URLSearchParams(list.callback_url).get('trigger_id')
    const url =`/api/triggers?trigger_id=${trigger_id}`;
    useEffect(() => {
       const getTrigger = async () => {
           try{
                setLoadingTrigger(true)
                const res = await axios.get(url)
                if(res.data.success){
                    setTrigger(res.data.trigger)
                    const webrelayRes = await WebRelayService.getWebRelay(res.data.trigger.webrelay_id)
                    setTriggerWebRelay(webrelayRes.data.webrelay)
                    setLoadingTrigger(false)
                }
           }catch(error){
               setLoadTriggerError(true)
               console.log(error)
           }
       }
       getTrigger()
    }, [])

    if (loadTriggerError ) return <div>failed to load trigger</div>
    if (loadingTrigger ) return <div>loading...</div>
    return (
        <div>
            {editListTrigger && <EditListTriggerModal open={editListTrigger} setOpen={setEditListTrigger} list={list} currentTriggerId={trigger_id}  />}
             <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
                <li >
                    <a href="#" className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-black truncate">Trigger: {trigger.name}</p>
                        
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex w-full">
                            
                            <p className="flex items-center text-sm text-gray-500 sm:ml-2 md:ml-2 lg:ml-2">
                                <CogIcon onClick={() => setEditListTrigger(true)} className="flex-shrink-0 mr-1.5 h-8 w-8 text-black hover:text-blue-400" aria-hidden="true" />
                                {list.type === 'whitelist' ?
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {list.type.toUpperCase()}
                                </span>
                                :
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-rose-100 text-rose-800">
                                {list.type.toUpperCase()}
                                </span>}
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                <LocationMarkerIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                {triggerWebRelay.name + '-'+triggerWebRelay.relays?.filter(relay => relay._id === trigger.relay_id).map((relay) => relay.name)}
                            </p>
                            {trigger.notifications &&
                            <p className="flex items-center text-sm text-gray-500 sm:ml-2 md:ml-2 lg:ml-2">
                                <ChatAltIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                {trigger.contact.length === 1 ? '1 Contact' : `${trigger.contact.length} Notification Contacts`}
                            </p>}
                        </div>
                        </div>
                    </div>
                    </a>
                </li>
            </ul>
            </div>
            
        </div>
    )
}
