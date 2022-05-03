import Link from "next/link"
import { useState,useEffect } from "react";
import VehicleService from "../services/VehicleService"
import useSWR from "swr";

async function fetcherFunc(url){
  const res = await fetch(url);
  return res.json();
  }
  export default function UsersTable(props) {
    const { users, searchItem, filterType } = props
  
        
    const url = '/api/vehicles';
    const { data,error } = useSWR(url, fetcherFunc, {initialProps: props, revalidateOnMount: true});
    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>

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
                      Vehicles
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Role
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.filter( (user) => user.userType !== 0 ) // Filter System Admins
                  .filter((val) => {
                    let userVs = []
                         val.vehicles.map((v) => {
                            userVs.push(data.vehicles.filter((ve) => ve._id === v.vehicle_id)[0])
                         })
                      if(searchItem   === ''){
                          return val
                      } else if ( val.fName?.toLowerCase().includes(searchItem.toLowerCase()) 
                      || val.lName?.toLowerCase().includes(searchItem.toLowerCase()) 
                      || val.email?.toLowerCase().includes(searchItem.toLowerCase()) 
                      || val.phone?.toLowerCase().includes(searchItem.toLowerCase()) 
                      || userVs.some((e) => e.plateNum.toLowerCase().includes(searchItem.toLowerCase()) ) ) {
                          return val
                    }}).filter((val) => {
                      if( filterType   === ''){
                          return val
                      } else if ( filterType === 'manager' && val.userType === 1 || filterType === 'staff' && val.userType === 2 || filterType === 'tenant' && val.userType === 3 ){
                          return val
                      }
                  }).map((user) => {
                        let userVehicles = []
                         user.vehicles.map((v) => {
                            userVehicles.push(data.vehicles.filter((ve) => ve._id === v.vehicle_id)[0])
                         })
                   return  <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full" src={user.image} alt="" /> 
                          </div>
                          <div className="ml-4">
                            <div className="text-lg font-medium text-gray-900">{user.fName} {user.lName}</div>
                            <div className="text-lg text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      {user.hasVehicle ?(
                         <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-lg font-bold text-gray-900">{userVehicles[0]?.plateNum}</div>
                            <div className="text-lg text-gray-500">{userVehicles[0]?.make}</div>
                            <span className="text-lg text-gray-400">{userVehicles.length === 1 ? '1 Vehicle' : user.vehicles.length +' '+ 'Vehicles'}</span>
                          </td>
                      ):(
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg text-gray-900 font-bold">No Vehicle</div>
                      
                        </td>
                        
                      )
                      }
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-lg leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-lg text-black font-bold">{user.userType === 0 ? 'Admin' : user.userType === 1 ? 'Manager' : user.userType === 2 ? 'Staff' : 'Tenant'  }</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-lg font-medium">
                      <Link href={`/app/users/${user._id}`} >  
                        <span className="px-4 py-2 cursor-pointer inline-flex text-lg leading-5 font-semibold rounded-full  bg-blue-300 text-blue-800">
                                View
                        </span>
                      </Link>
                      </td>
                    </tr>
                    }).reverse() }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
  