import { Fragment, useEffect, useState } from "react"
import LicensePlate from "../assets/LicensePlate";
import {BsTrash} from "react-icons/bs";
import { useRouter } from "next/router";
import axios from "axios";
import TriggerService from "../services/TriggerService";

export default function AddListForm() {
    const router = useRouter()
    const [members, setMembers] = useState([])
    const [input, setInput] = useState('')
    const [currentTriggers, setCurrentTriggers] = useState([]);
    const [allValues, setAllValues] = useState({
       title: '',
       trigger_id: '',
       listType:'',
       notifications: false,
    });
   
    const changeHandler = e => {
        setAllValues( prevValues => {
        return { ...prevValues,[e.target.name]: e.target.value}
        })
    }
    const handleInput = (e) => {
        e.preventDefault()
        setInput(e.target.value)
    }

     // Add Plate From List
    // const handleAddPlate = (e) => {
    //     e.preventDefault()
    //     if((input === '')){
    //        alert('Empty Input')
    //     }else if ( (input.includes('!')) || (input.includes("-")) || (input.includes("_")) || (input.includes("@")) || (input.includes("/")) || (input.includes(","))){
    //         alert('Contains forbidden characters ("-","!","_", etc..)')
    //     }else if(members.includes(input)){
    //         alert('This Plate Already Exist')
    //     }else{
    //         members.push(input)
    //         setInput('')
    //         console.log('Added: ', input)
    //     }
    // }
    // // Delete Plate From List
    // const handleDeletePlate = (e, member) => {
    //     e.preventDefault() 
    //     setMembers(members.filter(p => p !== member))
     
    // }

    //Update Members List
    useEffect(() => {
        setMembers(members)
    }, [members])

    //Submit New List
    const handleSubmitList = async(e) => {
        e.preventDefault()
        if(input !== '' && input !== ' '&& !members.includes(input)){
            return alert('Add or Remove Plate Input')
        }
        const url = '/api/lpr-lists/';
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               title: allValues.title,
               listType: allValues.listType,
               notifications: allValues.notifications,
               trigger_id: allValues.trigger_id,
               members: members
            })
        })
        .then(function (res) {
            if(res.ok){
                // setOpen(false)
                router.push('/app/lists/main')
                // mutate('/api/lists')
                return res.json()
            }
            // `data` is the parsed version of the JSON returned from the above endpoint.
        }).then(function (data) {
            // console.log(data)
        }).catch((err) => {
            console.log(err)
        });
    }

    const getTriggers = async () => {
        const res = await TriggerService.getAllTriggers()
        if(res.data.success){
            setCurrentTriggers(res.data.triggers)
        }
    }
    useEffect(() => {
       getTriggers()
    }, [])
    return (
        <div>
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">List Information</h3>
                    <p className="mt-1 text-lg text-gray-500">Add License Plate Recognition List</p>
                        </div>
                        <div className="mt-5 md:mt-0 md:col-span-2">
                            <form action="#" method="POST">
                            <div className="grid grid-cols-6 gap-6">
                                <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="first-name" className="block text-lg font-medium text-gray-700">
                                    List Title
                                </label>
                                <input
                                    type="text"
                                    onChange={changeHandler}
                                    name="title"
                                    id="first-name"
                                    autoComplete="given-name"
                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-lg border-gray-300 rounded-md"
                                />
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="country" className="block text-lg font-medium text-gray-700">
                                Trigger Name ( Notifications -(N) )
                                </label>
                                <select
                                    id="country"
                                    onChange={changeHandler}
                                    name="trigger_id"
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
                                >
                                     <option value="select" >Select</option>
                                   {currentTriggers.map((currTrigger) => (
                                       <Fragment key={currTrigger._id}>
                                        <option value={currTrigger._id} > {currTrigger.name} {currTrigger.notifications ? '-(N)' : ''}</option>
                                        </Fragment>
                                   ))}
                                </select>
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="country" className="block text-lg font-medium text-gray-700">
                                    List Type
                                    </label>
                                    <select
                                        id="country"
                                        onChange={changeHandler}
                                        name="listType"
                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
                                    >
                                        <option value="" >Select</option>
                                        <option value="whitelist" >Whitelist</option>
                                        <option value="blacklist" >Blacklist</option>
                                    </select>
                                </div>

                                {/* <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="country" className="block text-lg font-medium text-gray-700">
                                Notifications
                                </label>
                                <select
                                    id="country"
                                    name="notifications"
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
                                >
                                    <option value={false} >None</option>
                                    <option value={true} > SMS Alert</option>
                                </select>
                                </div> */}

                                {/* Add Member Plate Input */}
                                {/* <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="company-website" className="block text-lg font-medium text-gray-700">
                                        Member Plates
                                    </label>
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                        <button onClick={(e) => handleAddPlate(e)} className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-green-300 text-black sm:text-lg">
                                            Add Plate
                                        </button>
                                        <input
                                        type="text"
                                        name="memberPlate"
                                        id="member-input"
                                        value={input}
                                        onChange={(e) => handleInput(e)}
                                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg border-gray-300"
                                        placeholder="ABC1234"
                                        />
                                    </div>
                                </div> */}
                                </div>
                            </form>
                            {/* List of Members */}
                            {/* <div className=" mt-2 pl-1 max-w-[250px] max-h-[360px] snap-y snap-mandatory  overflow-y-auto border-solid border-2 rounded-2xl border-indigo-600 hover:border-red-700">
                                {members.map((member, memIdx) => (
                                       <div key={memIdx}  className="my-6 flex flex-row items-center snap-always snap-start">
                                            <LicensePlate plate={member} handleDeletePlate={handleDeletePlate} />
                                            <div className="flex flex-row justify-end cursor-pointer" >
                                                <BsTrash className="h-10 w-10 text-rose-600"  onClick={(e) => handleDeletePlate(e, member)}/>
                                            </div>
                                        </div>
                                    ))}
                            </div> */}
                        <div className="mt-4">
                        <button
                                onClick={(e) => handleSubmitList(e)}
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Complete Adding List
                            </button>
                        </div>
                        <div>
                            {/* {members.map((member, index) => (
                                <div key={index}>
                                { member}
                                </div>
                            ))} */}
                        </div>
                </div>
                </div>
            </div>
        </div>
    )
}
