import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CogIcon} from '@heroicons/react/outline'
import { useSWRConfig } from 'swr'
import AddContactBanner from '../banners/AddContactBanner';
import WebRelayService from '../services/WebRelayService';


export default function AddTriggerModal(props) {
    const { setOpen, open} = props;
    const cancelButtonRef = useRef(null)
    const {mutate} = useSWRConfig()
    const [allValues, setAllValues] = useState({
       triggerName: '',
       triggerEndpoint: '',
       triggerNotifications: '',
       webRelay_id:'',
       relay_id:''
    });

    //Manage WebRelay Select
    const [webrelays, setWebrelays] = useState([])
    const [selectedWebrelay, setSelectedWebrelay] = useState(null);
    const [selectedRelay, setSelectedRelay] = useState(null);
    const [selectedRelayPosition, setSelectedRelayPosition] = useState('');
    const getWebRelays = async() => {
        const res = await WebRelayService.getAllWebRelay()
        setWebrelays(res.data.webrelays)
        // console.log(res)
    }
    const handleSelectedWebRelay = (e) => {
        if(e.target.value === 'false'){
            setSelectedWebrelay(null)
            setSelectedRelay(null)
            return console.log('Selected None')
        }
        setSelectedWebrelay(webrelays[e.target.value])
        setAllValues( prevValues => {
            return { ...prevValues, webRelay_id: webrelays[e.target.value]._id}
            })
    }
    const handleSelectedRelay = (e) => {
        if(e.target.value === 'false'){
            setSelectedRelay(null)
            return console.log('Selected None')
        }
        setSelectedRelay(selectedWebrelay.relays[e.target.value])
        setAllValues( prevValues => {
            return { ...prevValues, relay_id: selectedWebrelay.relays[e.target.value]._id}
            })
    }
    const handleSelectedRelayPosition = (e) => {
        setSelectedRelayPosition(e.target.value)
    }
    
    useEffect(() => {
        getWebRelays()
     }, [])

    useEffect(() => {
       if(selectedWebrelay && selectedRelay && selectedRelayPosition){
           // Handle WebRelay Model
           if(selectedWebrelay.model === 'Quad_OLD'){
               // Handle SSL IP
               if(selectedWebrelay.ip.includes('.com') || selectedWebrelay.ip.includes('.app') || selectedWebrelay.ip.includes('.io') || selectedWebrelay.ip.includes('.net')){
                    let endpoint = `https://${selectedWebrelay.ip}:${selectedWebrelay.port}/stateFull.xml?${selectedRelay.relay_id}=${selectedRelayPosition}`
                    setAllValues( prevValues => {
                        return { ...prevValues,triggerEndpoint: endpoint}
                        })
               }else{
                    let endpoint = `http://${selectedWebrelay.ip}:${selectedWebrelay.port}/stateFull.xml?${selectedRelay.relay_id}=${selectedRelayPosition}`
                    setAllValues( prevValues => {
                        return { ...prevValues,triggerEndpoint: endpoint}
                        })
               }
           }
       }
    }, [selectedRelay, selectedWebrelay, selectedRelayPosition])

    // Manage Trigger Notification contacts
    const [contactInput, setContactInput] = useState('')
    const [contactList, setContactList] = useState([])
    const handleAddContact = (e) => {
        e.preventDefault()
        if(contactInput === ''){
            return alert('Cannot Add Empty')
        }
        contactList.push(contactInput)
        setContactList([...contactList]);
        setContactInput({phone:''})
    }
    const changeHandler = e => {
        setAllValues( prevValues => {
        return { ...prevValues,[e.target.name]: e.target.value}
        })
    }

    // Add Trigger Func
    const handleAddTrigger = async(e) => {
        e.preventDefault();
        // console.log(contactInput.phone.length)
        if(allValues.triggerNotifications === "true" && contactInput.phone.length > 0  ){
           return  alert(`Finish Adding ${contactInput.phone}`)
        }else if ( allValues.triggerEndpoint === ''){
            return alert('Forgot To Add Endpoint')
        }
        const url = '/api/triggers';
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               triggerName: allValues.triggerName,
               triggerEndpoint: allValues.triggerEndpoint,
               triggerNotifications: allValues.triggerNotifications,
               webrelay_id: allValues.webRelay_id,
               relay_id: allValues.relay_id,
               contact: contactList
            })
        })
        .then(function (res) {
            // if(res.ok){
                setOpen(false)
                mutate('/api/triggers')
                return res.json()
            // }
        }).then(function (data) {

            console.log(data)
        }).catch((err) => {
            console.log(err)
          });
        }

    console.log(allValues.triggerEndpoint)
    return (
            <div>
                {/* <AddContactBanner/> */}
                <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={setOpen}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    >
                    <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>
        
                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                    &#8203;
                    </span>
                    <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                    <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                        <div>
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                <CogIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                            </div>
                            <div className="mt-3 text-center sm:mt-5">
                                <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                            Add List Trigger
                                </Dialog.Title>
                                <div className="mt-4">
                                    <div>
                                        <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                                        Trigger Name
                                        </label>
                                        <div className="mt-1 flex rounded-md shadow-sm">
                                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                        Name
                                            </span>
                                            <input
                                            type="text"
                                            onChange={changeHandler}
                                            name="triggerName"
                                            id="trigger-name"
                                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                                            placeholder="Example: Trigger Name "
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <div>
                                        <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                                            Trigger Endpoint
                                        </label>
                                        <div className="mt-1 flex rounded-md shadow-sm">
                                            <select
                                                id="notifications"
                                                onChange={(e) => handleSelectedWebRelay(e)}
                                                // name="triggerNotifications"
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                            >
                                                <option value="false">Select Controller</option>
                                                {webrelays.map((webrelay,idx) => (
                                                    <option key={idx} value={idx}>{webrelay.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {selectedWebrelay && 
                                                  <div className="mt-1 flex rounded-md shadow-sm">
                                                        <select
                                                            id="notifications"
                                                            onChange={(e) => handleSelectedRelay(e)}
                                                            // name="triggerNotifications"
                                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                           
                                                       >
                                                            <option value="false">Select Endpoint</option>
                                                        {selectedWebrelay.relays.map((relay, idx) => (
                                                                <option key={relay._id} value={idx}>{relay.name}</option>
                                                            ))}
                                                        </select>
                                                </div>
                                        }
                                        {selectedRelay && 
                                                  <div className="mt-1 flex rounded-md shadow-sm">
                                                        <select
                                                            id="notifications"
                                                            onChange={(e) => handleSelectedRelayPosition(e)}
                                                            // name="triggerNotifications"
                                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                           
                                                       >
                                                            <option value="false">Select Position</option>
                                                            <option value="1">Open</option> 
                                                            <option value="0">Close</option>
                                                            <option value="2">Pulse</option>
                                                        </select>
                                                </div>
                                            }

                                    </div>
                                 
                                </div>
                                <div className="mt-2">
                                    <div>
                                        <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                                       Trigger Notifications
                                        </label>
                                        <div className="mt-1 flex rounded-md shadow-sm">
                                        <select
                                            id="notifications"
                                            onChange={changeHandler}
                                            name="triggerNotifications"
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                            defaultValue="Canada"
                                        >
                                            <option value="false">No Notifications</option>
                                            <option value="true">SMS Notifications</option>
                                        </select>
                                        </div>
                                    </div>
                                </div>
                               {allValues.triggerNotifications === "true" && (
                                <div className="mt-2">
                                    <div>
                                        <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                                            SMS Contacts
                                        </label>
                                        <div className="mt-1 flex rounded-md shadow-sm">
                                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                                Phone: +1
                                            </span>
                                            <input
                                            type="text"
                                            onChange={(e) => setContactInput({phone: e.target.value})}
                                            name="triggerEndpoint"
                                            id="ip-address"
                                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                                            placeholder="9141237890"
                                            value={contactInput.phone}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-green-100 text-base font-medium text-gray-700 hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                                            onClick={(e) => handleAddContact(e)}
                                            >
                                            Add Contact
                                        </button>
                                    </div>
                                    <div className="mt-2">
                                    {contactList.length > 0 &&
                                        <>
                                         Added <strong>{contactList.length} Members</strong>
                                        </>}
                                    </div>
                                </div>
                               )}
                            </div>
                        </div>
                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                            <button
                                type="button"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                                onClick={(e) => handleAddTrigger(e)}
                            >
                            Complete Trigger
                            </button>
                            <button
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                                onClick={() => setOpen(false)}
                                ref={cancelButtonRef}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                    </Transition.Child>
                </div>
                </Dialog>
            </Transition.Root>
            </div>
    )
}
