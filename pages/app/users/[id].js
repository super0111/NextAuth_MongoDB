import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import UserService from "../../../components/services/UserService";
import VehicleService from "../../../components/services/VehicleService";
import {FaCar} from 'react-icons/fa'
import useSWR, { mutate, useSWRConfig } from "swr";
import AdditionalVehicleForm from "../../../components/forms/AdditionalVehicleForm";
import PlateListService from "../../../components/services/PlateListService";
import { BsTrash } from "react-icons/bs";

async function fetcherFunc(url){
    const res = await fetch(url);
    return res.json();
}

export default function id(props) {
    const router = useRouter()
    const [addVehicle, setAddVehicle] = useState(false);
    const [addedVehicle, setAddedVehicle] = useState(false)
    const {mutate} = useSWRConfig()
    const [allValues, setAllValues] = useState({
        year: '', //Automobile
        make:'',//Automobile
        model:'',//Automobile
        plateNum:'',//Automobile
        hasVehicle: false,
        list: []
    });
   
    const changeHandler = e => {
        setAllValues( prevValues => {
        return { ...prevValues,[e.target.name]: e.target.value}
        })
    }

   // Delete User Vehicles
    const handleDeleteVehicle = async(e,user,vehicle, vInfo) => {
        e.preventDefault();
        try{
            const listRes = await PlateListService.deleteListMember(vInfo.list_id, vInfo.plateNum)
            const vRes = await VehicleService.deleteVehicle(vehicle.vehicle_id);
            const userRes = await UserService.deleteUserVehicle( user._id,vehicle.vehicle_id);
            if(listRes.success && vRes.data.success &&  userRes.data.success){
                mutate(`/api/users/${router.query.id}`)
                mutate('/api/vehicles')
            }
        }catch(err){
            console.log(err)
        }
    }

    // Handle Delete User
    const handleDeleteUser = async(user,vehiclesData) => {
      try{
          if(user.hasVehicle){
            return alert('Must Delete User Vehicles First')
          }  
          const userRes = await UserService.deleteUser( user._id);
          if( userRes.data.success){
             router.push('/app/users')
          }
      }catch(err){
          console.log(err)
      }
  }

    const  urlUser = `/api/users/${router.query.id}`
    const url = '/api/vehicles';
    const { data: userData , error: userError } = useSWR(urlUser, fetcherFunc, {initialProps: props, revalidateOnMount: true });
    const { data:vehiclesData , error: vehiclesError} = useSWR(url, fetcherFunc, {initialProps: props, revalidateOnMount: true});
    if (vehiclesError || userError ) return <div>failed to load</div>
    if (!userData?.success || !vehiclesData?.success )return <div>Load User Info error..</div>
    if (!userData || !vehiclesData ) return <div>loading...</div>

    return (
        <div>
            <section className="max-w-[750px]" aria-labelledby="applicant-information-title ">
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <div className="flex flex-row justify-between">
                      <h2 id="applicant-information-title" className="text-lg leading-6 font-medium text-gray-900">
                      {userData.user.fName} {userData.user.lName}
                      </h2>
                      <BsTrash size={28} className="text-rose-600 cursor-pointer" onClick={() => handleDeleteUser(userData.user,vehiclesData)} />
                    </div>
                    <p className="mt-1 max-w-2xl text-md text-gray-500">{userData.user.userType === 0 ? 'Admin' : userData.user.userType === 1 ? 'Manager' : userData.user.userType === 2 ? 'Staff' : 'Tenant'  }</p>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                     
                      <div className="sm:col-span-1">
                        <dt className="text-md font-medium text-gray-500">Email address</dt>
                        <dd className="mt-1 text-md text-gray-900">{userData.user.email}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-md font-medium text-gray-500">Phone</dt>
                        <dd className="mt-1 text-md text-gray-900">{userData.user.phone}</dd>
                      </div>
                      {/* <div className="sm:col-span-1">
                        <dt className="text-md font-medium text-gray-500">Salary expectation</dt>
                        <dd className="mt-1 text-md text-gray-900">$120,000</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-md font-medium text-gray-500">Phone</dt>
                        <dd className="mt-1 text-md text-gray-900">+1 555-555-5555</dd>
                      </div> */}
                      {/* <div className="sm:col-span-2">
                        <dt className="text-md font-medium text-gray-500">About</dt>
                        <dd className="mt-1 text-md text-gray-900">
                          Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat.
                          Excepteur qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia
                          proident. Irure nostrud pariatur mollit ad adipisicing reprehenderit deserunt qui eu.
                        </dd>
                      </div> */}
                      <div className="sm:col-span-2">
                        <div className="flex flex-row justify-between mb-2">
                            <dt className="text-md font-medium text-gray-500">Vehicles</dt>
                           {!addVehicle ? (
                                <span onClick={() => setAddVehicle(true)}  className="cursor-pointer inline-flex rounded-full items-center py-0.5 pl-2.5 pr-1 text-sm font-medium bg-indigo-100 text-indigo-700">
                                        Add Vehicle
                                    <button
                                    type="button"
                                    className="flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white"
                                    >
                                    +
                                    </button>
                                </span>
                            ):(
                                <span onClick={() => setAddVehicle(false)}  className="cursor-pointer inline-flex rounded-full items-center py-0.5 pl-2.5 pr-1 text-sm font-medium bg-rose-100 text-rose-700">
                                    Cancel 
                                    <button
                                    type="button"
                                    className="flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-rose-400 hover:bg-rose-200 hover:text-rose-500 focus:outline-none"
                                    >
                                    <span className="sr-only">Remove large option</span>
                                    <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                        <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                                    </svg>
                                    </button>
                                </span>
                            )}
                        </div>
                        <dd className="mt-4 text-md text-gray-900">
                          {!addVehicle ?( <ul role="list" className="border border-gray-200 rounded-md divide-y divide-gray-200">
                            {userData.user.hasVehicle ? (
                                userData.user.vehicles.map((vehicle,idx) => {
                                   let vInfo = vehiclesData.vehicles.filter((ve) => ve._id === vehicle.vehicle_id)[0]
                                   if(vInfo === undefined) return <span key={idx}>No Vehicles Matched</span>
                                   return  <li
                                        key={vehicle.vehicle_id}
                                        className="pl-3 pr-4 py-3 flex items-center justify-between text-md"
                                    >
                                        <div className="w-0 flex-1 flex items-center">
                                            <FaCar className="flex-shrink-0 h-5 w-5 text-black" aria-hidden="true" />
                                            <span className="ml-2 flex-1 w-0 truncate">{vInfo?.plateNum}</span>
                                        </div>
                                        <div className="ml-4 flex-shrink-0">
                                            <span onClick={(e) => handleDeleteVehicle(e, userData.user ,vehicle, vInfo)} className="cursor-pointer font-medium text-rose-600 hover:text-rose-800">
                                                Remove
                                            </span>
                                        </div>
                                    </li>
                                    }).reverse()
                                ):(
                                    <div className="p-1">
                                        No Vehicle
                                    </div>
                                )
                            }
                          </ul>
                        ):(
                            <AdditionalVehicleForm setAddVehicle={setAddVehicle} allValues={allValues} setAllValues={setAllValues} changeHandler={changeHandler} user={userData.user}  />
                        
                        )}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </section>
        </div>
    )
}
