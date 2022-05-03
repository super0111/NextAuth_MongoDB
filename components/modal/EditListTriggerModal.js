/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { PhoneIcon, PlayIcon, XIcon } from '@heroicons/react/outline'
import TriggerService from '../services/TriggerService';
import { useSWRConfig } from 'swr';
import { Router, useRouter } from 'next/router';



export default function EditListTriggerModal(props) {
    const { open,setOpen,currentTriggerId, list } = props;
    const [triggers, setTriggers] = useState([]);
    const router = useRouter()
    const [selectedTrigger, setSelectedTrigger] = useState({});
    const { mutate } = useSWRConfig()
    const getTriggers = async () => {
        const res = await TriggerService.getAllTriggers()
        console.log(res)
        if(res.data.success){
            setTriggers(res.data.triggers)
        }
    }
    useEffect(() => {
       getTriggers()
    }, [])

    const handleUpdateTrigger = async(e) => {
        e.preventDefault()
        const url = '/api/lpr-lists';
        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                list: list,
                trigger_id: selectedTrigger,
                updateType:'callback'
            })
        })
        .then(function (res) {
            if(res.ok){
                return res.json()
            }
            // `data` is the parsed version of the JSON returned from the above endpoint.
        }).then(function (data) {
            console.log(data)
            mutate('/api/lpr-list')
            router.push('/app/lists/manage')
            setOpen(false)
        }).catch((err) => {
            console.log(err)
          });
    }
    console.log(selectedTrigger)
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={setOpen}>
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay className="absolute inset-0" />

          <div className="fixed inset-y-0 right-0  max-w-full flex sm:pl-16 ">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-screen max-w-2xl ">
                <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900">Panel title</Dialog.Title>
                      <div className="ml-3 h-7 flex items-center">
                        {/* <button
                          type="button"
                          className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={() => setOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button> */}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 relative flex-1 px-4 sm:px-6">
                    {/* Start Content */}
                    <div className="ml-3 h-7 flex items-center">
                       <div className="flex flex-row justify-between w-full">
                       <button
                          type="button"
                          className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={() => setOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <XIcon className="h-6 w-6 text-red-400" aria-hidden="true" />
                        </button>
                        <span className="text-blue-500 font-bold text-xl">Update LPR List Trigger</span>
                       </div>
                      </div>
                        
                        <div className="mt-6">
                            <div className="p-1 border-2">
                                <span>Current Trigger: {' '}</span>
                                <span className="font-bold">{triggers.filter((trig) => trig._id === currentTriggerId ).length ? triggers.filter((trig) => trig._id === currentTriggerId )[0]?.name : ' Trigger No Longer Exists'}</span>
                            </div>
                            
                            <div className="mt-8">
                                <span className="text-lg"> Select New Trigger </span>
                                <select
                                    id="triggers"
                                    onChange={(e) => setSelectedTrigger(e.target.value)}
                                    name="trigger_id"
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="select" >Select</option>
                                {triggers.map((currTrigger) => (
                                    <Fragment key={currTrigger._id}>
                                        <option value={currTrigger._id} > {currTrigger.name} {currTrigger.notifications ? '-(N)' : ''}</option>
                                        </Fragment>
                                ))}
                                </select>
                            </div>
                        </div>

                        <button onClick={(e) => handleUpdateTrigger(e)} className='bg-blue-500 px-4 py-2 mt-8 w-full rounded text-white font-bold'>
                            Update Trigger
                        </button>
                
                    {/* /End Content */}
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
