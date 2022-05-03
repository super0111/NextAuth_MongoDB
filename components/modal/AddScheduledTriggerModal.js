
import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CogIcon} from '@heroicons/react/outline'
import { useSWRConfig } from 'swr'
import AddContactBanner from '../banners/AddContactBanner';
import WebRelayService from '../services/WebRelayService';
import TriggerService from '../services/TriggerService';
import cronTime from "cron-time-generator";

const hourOfDay = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23']
const minOfDay = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59']    
const dayOptions = [
    {
      label: "Mon",
      value: "monday"
    }, {
      label: "Tue",
      value: "tuesday"
    }, {
      label: "Wed",
      value: "wednesday"
    }, {
      label: "Thu",
      value: "thursday"
    }, {
      label: "Fri",
      value: "friday"
    }, {
      label: "Sat",
      value: "saturday"
    }, {
        label: "Sun",
        value: "sunday"
      }
  ];

export default function AddScheduledTriggerModal(props) {
    const { setOpen, open} = props;
    const cancelButtonRef = useRef(null)
    const {mutate} = useSWRConfig()
    //Manage WebRelay Select
    const [webrelays, setWebrelays] = useState([])
    const [selectedWebrelay, setSelectedWebrelay] = useState(null);
    const [selectedRelay, setSelectedRelay] = useState(null);
    const [selectedRelayPosition, setSelectedRelayPosition] = useState(null);
    // Manage Schedule Select
    const [selectedScheduleType, setSelectedScheduleType] = useState(null);
    const [cron, setCron] = useState('');

    // CRON Interval Type
    const [hourlyRunType, setHourlyRunType] = useState('every'); // Handle Single (at) or Repeating Task (every)
    const [dailyRunType, setDailyRunType] = useState('every')
    const [minutes, setMinutes] = useState('') // Not Used if runType Hourly/Every Hour
    const [hour, setHour] = useState('') ;
    const [days, setDays] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);

    const [allValues, setAllValues] = useState({
        triggerName: '',
        triggerDescription:'',
        triggerEndpoint: '',
        webRelay_id:'',
        relay_id:''
     });
     const changeHandler = e => {
         setAllValues( prevValues => {
         return { ...prevValues,[e.target.name]: e.target.value}
         })
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
    const handleSelectedScheduleType = (e) => {
        setSelectedScheduleType(e.target.value)
    }
    // Handle Schedule Type Hourly
    const handleHourlyRunType = (e) => {
        if(e.target.value === 'every'){
            setHourlyRunType('every')
            // setHour('')
        }else{
            setHourlyRunType('at')
            // setHour('')
        }
    }
     // Handle Schedule Type Daily
     const handleDailyRunType = (e) => {
        if(e.target.value === 'every'){
            setDailyRunType('every')
        }else if(e.target.value === 'weekday'){
            setDailyRunType('weekday')
        }else if(e.target.value === 'weekend'){
            setDailyRunType('weekend')
        }
    }

    //Handle Weekly Day Select
    const handleWeeklyDaySelect = (selectedDay) => {
        if(selectedDays.some((day) => day === selectedDay.value)){
           setSelectedDays( selectedDays.filter((day) => day !== selectedDay.value) )
            alert('ran filter')
        }else{
            alert('ran push')
            setSelectedDays(oldArray => [...oldArray, selectedDay.value] );
        }

    }
    console.log(selectedDays)
    //Fetch WebRelays
    useEffect(() => {
        const getWebRelays = async() => {
            const res = await WebRelayService.getAllWebRelay()
            setWebrelays(res.data.webrelays)
            // console.log(res)
        }
        getWebRelays()
     }, [])
    //Handle Trigger Endpoint (Only OLD_QUAD Implemented)
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
            }else if (selectedWebrelay.model === 'X401'){
                // Handle SSL IP
                if(selectedWebrelay.ip.includes('.com') || selectedWebrelay.ip.includes('.app') || selectedWebrelay.ip.includes('.io') || selectedWebrelay.ip.includes('.net')){
                     let endpoint = `https://${selectedWebrelay.ip}:${selectedWebrelay.port}/customState.json?${selectedRelay.relay_id}=${selectedRelayPosition}`
                     setAllValues( prevValues => {
                         return { ...prevValues,triggerEndpoint: endpoint}
                         })
                }else{
                     let endpoint = `http://${selectedWebrelay.ip}:${selectedWebrelay.port}/customState.json?${selectedRelay.relay_id}=${selectedRelayPosition}`
                     setAllValues( prevValues => {
                         return { ...prevValues,triggerEndpoint: endpoint}
                         })
                }
            }else if (selectedWebrelay.model === 'X410'){
                // Handle SSL IP
                if(selectedWebrelay.ip.includes('.com') || selectedWebrelay.ip.includes('.app') || selectedWebrelay.ip.includes('.io') || selectedWebrelay.ip.includes('.net')){
                     let endpoint = `https://${selectedWebrelay.ip}:${selectedWebrelay.port}/customState.json?${selectedRelay.relay_id}=${selectedRelayPosition}`
                     setAllValues( prevValues => {
                         return { ...prevValues,triggerEndpoint: endpoint}
                         })
                }else{
                     let endpoint = `http://${selectedWebrelay.ip}:${selectedWebrelay.port}/customState.json?${selectedRelay.relay_id}=${selectedRelayPosition}`
                     setAllValues( prevValues => {
                         return { ...prevValues,triggerEndpoint: endpoint}
                         })
                }
            }
       }
    }, [selectedRelay, selectedWebrelay, selectedRelayPosition])

    useEffect(() => {
        getCronTime()
    }, [hour,minutes,selectedDays])

    const getCronTime = () => {
        if (selectedScheduleType == 'minutes'){      
            // Every X minutes
            setCron(cronTime.every(Number(minutes)).minutes())    
       
        }else if(selectedScheduleType == 'hourly'){
            if(hourlyRunType === 'every'){
                // Every X hours 
                setCron(cronTime.every(Number(hour)).hours())
            }else{
                // At Specific HH:mm
                setCron(cronTime.every(1).days(Number(hour),Number(minutes)))
            }
            
        }else if(selectedScheduleType == 'daily'){
            if(dailyRunType === 'every'){
                // Every X hours 
                setCron(cronTime.every(Number(days)).days())
            }else if (dailyRunType === 'weekday'){
                // At Specific HH:mm WEEKDAY
                setCron(cronTime.everyWeekDayAt(Number(hour),Number(minutes)))
            }else{
                // At Specific HH:mm WEEKEND
                setCron(cronTime.everyWeekendAt( Number(hour), Number(minutes) ))
            }
            
        }else if(selectedScheduleType == 'weekly'){
           
            // At Specific HH:mm WEEKEND
            setCron(cronTime.onSpecificDaysAt( selectedDays , Number(hour), Number(minutes) ))
        
        }

    }
   

    // Add Trigger Func
    const handleAddTrigger = async(e) => {
        e.preventDefault();
        // console.log(contactInput.phone.length)
        if ( allValues.triggerEndpoint === ''){
            return alert('Forgot To Add Endpoint')
        }
       try{
        const url = '/api/triggers';
        const res = await TriggerService.createScheduledTrigger(allValues,cron)    
        console.log(res)
            if(res.success){
                mutate('/api/triggers/scheduled/')
                reset()
                setOpen(false)
            }
       }catch(err){
        alert('Add Schedule Trigger Error'); 
        reset()
        setOpen(false)
        console.log('err')
     }
       
    }
    const reset = () => {
        setSelectedScheduleType(null)
        setSelectedWebrelay(null);
        setSelectedRelay(null);
        setSelectedRelayPosition(null);
        setHourlyRunType('every')
        setDailyRunType('every')
        setCron('')
        setMinutes('')
        setHour('')
        setDays('')
        setSelectedDays([])
    }

    return (
            <div>
                <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={setOpen}>
                <div className="flex items-end justify-center  min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
                    <div className="inline-block align-middle w-full bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                        <div>
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                <CogIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                            </div>
                            <div className="mt-3 text-center sm:mt-5">
                                <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                            Add Scheduled Trigger
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
                                <div className="mt-4 flex flex-row w-full">      
                                    {selectedRelayPosition && 
                                            <div className="mt-1 flex flex-col rounded-md shadow-sm w-full">
                                                 <label  className="block text-md font-medium text-gray-700">
                                                     Schedule Type
                                                </label>
                                                <select
                                                    id="notifications"
                                                    onChange={(e) => handleSelectedScheduleType(e)}
                                                    // name="triggerNotifications"
                                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                    
                                                >
                                                    <option value="false">Select Schedule Type</option>
                                                    <option value="minutes">Minutes</option> 
                                                    <option value="hourly">Hourly</option> 
                                                    <option value="daily">Daily</option>
                                                    <option value="weekly">Weekly</option>
                                                </select>
                                            </div>
                                    }
                                </div>
                               {selectedScheduleType && selectedScheduleType === 'minutes' &&
                                    <div className="border-2 rounded mt-4 py-2 px-1 flex flex-col justify-between ">
                                        {/* Repeating Minutes*/}
                                        <div className="flex flex-row justify-start items-center ">
                                            <span className="ml-2"> Every </span>
                                            <input className="ml-2 rounded" type="number" min={1} max={59}  value={minutes} onChange={(e)=> setMinutes(Number(e.target.value) > 59 ? '59' : Number(e.target.value) < 1 ? '1' : e.target.value)} />
                                            <span className="ml-2"> Minutes</span>
                                        </div>
                                       
                                    </div>
                                }
                                 {selectedScheduleType && selectedScheduleType === 'hourly' &&
                                    <div className="border-2 rounded mt-4 py-2 px-1 flex flex-col justify-between ">
                                        {/* Repeating Hourly*/}
                                        <div className="flex flex-row justify-start items-center ">
                                            <input type="checkbox" className="rounded" checked={hourlyRunType === 'every' ? true : false} value={'every'} onChange={(e) => handleHourlyRunType(e)} /> 
                                            <span className="ml-2"> Every </span>
                                            <input className="ml-2 rounded" type="number" min={1} max={23}  value={hourlyRunType === 'every' ? hour : ''} onChange={(e)=> setHour(Number(e.target.value)) > 23 ? '23' : setHour(Number(e.target.value)) < 1 ? '1' : e.target.value}  disabled={hourlyRunType === 'at' ?  "readonly":  ""}/>
                                            <span className="ml-2"> Hour(s)</span>
                                        </div>
                                        {/* Run at Hour*/}
                                        <div className="mt-4 flex flex-row justify-start items-center">
                                            <input type="checkbox" className="rounded" checked={hourlyRunType === 'at' ? true : false} value ={'at'} onChange={(e) => handleHourlyRunType(e)}/> 
                                            <span className="ml-2"> At </span>
                                            <div className="flex flex-row ml-2">
                                                <select className="rounded-l" onChange={(e)=> setHour(e.target.value)} disabled={hourlyRunType === 'every' ? true : false}>
                                                    {hourOfDay.map((hour,idx) => (
                                                        <option key={idx} value={hour} >{hour}</option>
                                                    ))}
                                                </select>
                                                <select className="rounded-r" onChange={(e)=> setMinutes(e.target.value)}  disabled={hourlyRunType === 'every' ? true : false}>
                                                    {minOfDay.map((min,idx) => (
                                                        <option key={idx} value={min}>{min}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            
                                        </div>
                                    </div>
                                }
                                {selectedScheduleType && selectedScheduleType === 'daily' &&
                                     <div className="border-2 rounded mt-4 py-2 px-1 flex flex-col justify-between ">
                                        {/* Every X Days*/}
                                        <div className="flex flex-row justify-start items-center ">
                                            <input type="checkbox" className="rounded" checked={dailyRunType === 'every' ? true : false} value={'every'} onChange={(e) => handleDailyRunType(e)} /> 
                                            <span className="ml-2"> Every </span>
                                            <input className="ml-2 rounded" type="number" min={1} max={30}  value={dailyRunType === 'every' ? days : ''} onChange={(e)=> setDays(Number(e.target.value)) > 30 ? '30' : setDays(Number(e.target.value)) < 1 ? '1' : e.target.value}  disabled={(dailyRunType === 'weekend' || dailyRunType === 'weekday') ?  "readonly":  ""}/>
                                            <span className="ml-2"> Day(s)</span>
                                        </div>
                                        {/* Weekday*/}
                                        <div className="mt-4 flex flex-row justify-start items-center">
                                            <input type="checkbox" className="rounded" checked={dailyRunType === 'weekday' ? true : false} value ={'weekday'} onChange={(e) => handleDailyRunType(e)}/> 
                                            <span className="ml-2"> Every Week Day </span>
            
                                        </div>
                                          {/* WeekEnd*/}
                                        <div className="mt-4 flex flex-row justify-start items-center">
                                            <input type="checkbox" className="rounded" checked={dailyRunType === 'weekend' ? true : false} value ={'weekend'} onChange={(e) => handleDailyRunType(e)}/> 
                                            <span className="ml-2"> Every Weekend </span>
                                        </div>
                                        <div>
                                            <span className="mb-4">Start Time</span>
                                            <div className="flex flex-row justify-center ml-2 mt-6">
                                                <select className="rounded-l" onChange={(e)=> setHour(e.target.value)} >
                                                    {hourOfDay.map((hour,idx) => (
                                                        <option key={idx} value={hour} >{hour}</option>
                                                    ))}
                                                </select>
                                                <select className="rounded-r" onChange={(e)=> setMinutes(e.target.value)}  >
                                                    {minOfDay.map((min,idx) => (
                                                        <option key={idx} value={min}>{min}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                }
                                {selectedScheduleType && selectedScheduleType === 'weekly' &&
                                     <div className="border-2 rounded mt-6 py-2 px-1 flex flex-col justify-between ">
                                        {/* Every X Days*/}
                                        <div className="flex flex-row flex-wrap justify-between items-center ">
                                            {dayOptions.map(option => {
                                                return (
                                                <div key={option.value} className="mx-4 my-1">
                                                    {' '}
                                                    <input 
                                                        type="checkbox" 
                                                        className="rounded" 
                                                        // checked={hourlyRunType === 'at' ? true : false} 
                                                        value={option} onChange={() => handleWeeklyDaySelect(option)}/> 

                                                    <span className="ml-2">{option.label}</span>
                                                </div>
                                                );
                                            })}
                                        </div>
                                        <div>
                                            <span className="mb-4">Start Time</span>
                                            <div className="flex flex-row justify-center ml-2 mt-6">
                                                <select className="rounded-l" onChange={(e)=> setHour(e.target.value)} >
                                                    {hourOfDay.map((hour,idx) => (
                                                        <option key={idx} value={hour} >{hour}</option>
                                                    ))}
                                                </select>
                                                <select className="rounded-r" onChange={(e)=> setMinutes(e.target.value)}  >
                                                    {minOfDay.map((min,idx) => (
                                                        <option key={idx} value={min}>{min}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                }
                               

                              
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
                                onClick={() => {reset(); setOpen(false)}}
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
