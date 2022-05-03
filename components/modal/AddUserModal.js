import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { UserIcon } from '@heroicons/react/outline'
import { useSWRConfig } from 'swr'
import LocationsService from '../services/LocationsService'
import AddUserForm from '../forms/users/AddUserForm'
import AddUserVehicleForm from '../forms/users/AddUserVehicleForm'
import VehicleService from '../services/VehicleService'

export default function AddUserModal({open, setOpen}) {
    const {mutate} = useSWRConfig()
    const cancelButtonRef = useRef(null)
    const [showAddVehicle, setShowAddVehicle] = useState(false);
    const [addPlateError, setAddPlateError] = useState(false);
    const [addPlateSuccess, setAddPlateSuccess] = useState(false);
    
    const [allValues, setAllValues] = useState({
        fName:'',
        lName:'',
        email:'',
        phone:'',
        year: '', //Automobile
        make:'',//Automobile
        model:'',//Automobile
        plateNum:'',//Automobile
        list: [],
        hasVehicle: false,
        userType: 100, // 100 to handle select Errors within App,   0 (defult admin)    1 (custom-manager)  2 (staff)   3(tenant)
    });
   
    const changeHandler = e => {
        setAllValues( prevValues => {
        return { ...prevValues,[e.target.name]: e.target.value}
        })
    }
  

    const handleValidateToVehicle = (e) => {
        e.preventDefault();
        if(allValues.fName.length > 0 && allValues.lName.length > 0 && allValues.userType !== 100 && (allValues.email.length > 3 || allValues.phone.length > 6) ){
            setShowAddVehicle(true)  // Details Verified

        }else if(allValues.fName.length === 0 ){
            alert('Enter First Name')
        }else if( allValues.lName.length === 0 ){
            alert('Enter Last Name')
        }else if ( allValues.userType === 100 ){
            alert('Select User Type')
        }else{
           alert('Finish Adding Phone or Email')
        }
         
    }
    const handleAddPlate = async() => {
      try{

        if(allValues.list?.length === 0 ||  allValues.list === null){
          return alert('Must Select List!')
        }       
        allValues.list.members.push(allValues.plateNum.replace(/\s/g, '').replace(/-|\s/g,"").toUpperCase()) 
        const res = await VehicleService.addVehiclePlate(allValues.list.list_id, allValues.list.members )
          if(res.data.success){
            setAddPlateSuccess(true)
            return res
          }
      }catch(err){
        console.log('Add Plate Err',err)
        setAddPlateError(true)
      }
    }

    const handleRegisterUser = async(e) => {
        e.preventDefault();
        if(allValues.hasVehicle === ('true' || true) && (allValues.plateNum.length === 0  )){
            return alert('Missing Vehicle Plate ')
        }else if(allValues.hasVehicle === ('true' || true) && allValues.list  ===  null){
          return alert('Missing Access List')
        }
       
        const url = '/api/users/';
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                allValues: allValues
            })
        })
        .then(function (res) {
          if (res.ok) {
             return res.json()
          }
           return Promise.reject(res); 
          }).then(function (data) {
          if(data.success){

            if(allValues.hasVehicle === ('true' || true)){
               
              // Handle Add Plate To LPR Lists
              const res = handleAddPlate()
              res.then(function(result){
                if(result.data.success){
                  mutate('/api/users')
                  mutate('/api/vehicles')
                  setOpen(false)
                }
              })
            }else{
              mutate('/api/users')
              mutate('/api/vehicles')
              setOpen(false)
            }
            
          }else {
            alert(data.message )
          
          }
        }).catch((err) => {
            console.log(err)
          });
      }
    
    return (
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
              <div className="inline-block align-bottom h-[100vh] bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                {!showAddVehicle &&   <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <UserIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div>}
                  <div className="mt-3 text-center sm:mt-5">
                  {!showAddVehicle &&  <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                      Register User
                    </Dialog.Title>}
                        { !showAddVehicle ? ( 
                            <AddUserForm changeHandler={changeHandler} allValues={allValues}/> 
                        ):(
                            <AddUserVehicleForm changeHandler={changeHandler} allValues={allValues } setAllValues={setAllValues}/>
                        )  }
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  {!showAddVehicle ? (
                    <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                    onClick={(e) => handleValidateToVehicle(e)}
                >
                    Next
                </button>
                  ):(
                    <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                    onClick={(e) => handleRegisterUser(e)}
                >
                    Register
                </button>
                  )}

                 {!showAddVehicle ? (
                      <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                  ):(
                    <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    onClick={() => setShowAddVehicle(false)}
                  >
                   Back
                  </button>
                      
                  )}
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    )
}
