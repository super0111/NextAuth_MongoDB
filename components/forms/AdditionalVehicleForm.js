import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import VehicleService from "../services/VehicleService";


async function fetcherFunc(url){
    const res = await fetch(url);
    return res.json();
    }
export default function AdditionalVehicleForm(props) {
    const {allValues, setAllValues ,changeHandler,setAddVehicle, user} = props;
    const [addPlateError, setAddPlateError] = useState(false);
    const [addPlateSuccess, setAddPlateSuccess] = useState(false);
    const {mutate} = useSWRConfig()
   
   
    // Handle List Members
    const handleListSelect = (e, lists) => {
        e.preventDefault()
        if(allValues.plateNum.length === 0){
            return alert('Add Plate Number First')
        }
        const filteredList = lists.filter((list) => list.list_id === e.target.value)[0]
        setAllValues( prevValues => {
            return { ...prevValues, list: filteredList !== undefined ? filteredList : null }
        })
    }
    const handleResetForm = () => {
        setAllValues({ //RESET FORM STATE
            year: '', //Automobile
            make:'',//Automobile
            model:'',//Automobile
            plateNum:'',//Automobile
            hasVehicle: false,
            list: []
        });
    }
    
    // Handle Add PLate
    const handleAddPlate = async() => {
        try{

         if(allValues.list?.length === 0 ||  allValues.list === null){
             return alert('Must Select List!')
         }
         let addedPlate = allValues.plateNum.replace(/\s/g, '').replace(/-|\s/g,"").toUpperCase()
          allValues.list.members.push(addedPlate)
          console.log(allValues)
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
    
    
    const handleAddVehicle = async(e) => {
        e.preventDefault()
        if(allValues.plateNum.length === 0){
            return alert('Enter Plate Number')
        }else if(allValues.list?.length === 0 ||  allValues.list === null){
            return alert('Must Select List!')
        }
        const url = `/api/users/${user._id}`;
        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                allValues: allValues,
                key: 'addVehicle'
            })
        }).then(function (res){
            // console.log(res.ok,res)
            if (res.ok) {
                return res.json();
            }
            return Promise.reject(res); 
        }).then(function (data) {
            if(data.success){                   
                // Handle Add Plate To LPR Lists
                const res = handleAddPlate()
                console.log(res)
                res.then(function(result){
                    console.log('result',result)
                    if(result.data.success){
                        console.log(result)
                        mutate(`/api/users/${user._id}`)
                        mutate('/api/vehicles')
                        handleResetForm()
                        setAddVehicle(false)
                    }
                })    
            }
        }).catch((err) => {
            err.json().then(function(e) {
                alert(e.message)
                console.log(e.message)
            })
            console.log(err)
        });
    }

    console.log(allValues)
    const url ='/api/lpr-lists';
    const { data: listsData ,error } = useSWR(url, fetcherFunc, {initialProps: props, revalidateOnMount: true});
    if (error) return <div>failed to load</div>
    if (!listsData) return <div>loading...</div>
    return (
        <>
         <div>
            <div className="mt-4">
                <div>
                    <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                        Vehicle Plate Number
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                        License Plate
                        </span>
                        <input
                        type="text"
                        value={allValues.plateNum}
                        onChange={changeHandler}
                        name="plateNum"
                        id="firstname"
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                        // placeholder="Example: Lobby "
                        />
                    </div>
                </div>
            
            </div>
            <div className="my-4">
                <label htmlFor="userType" className="block text-lg font-medium text-gray-700">
                 Garage Access List
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                    <select
                    id="userType"
                    name="list"
                    onChange={(e) => handleListSelect(e,listsData.lists)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg rounded-md"
                    value={allValues.list?.list_id ? allValues.list.list_id : 'Select'}
                >        <option value={null} >Select</option>
                       {listsData.lists.map( (list) => (
                            <option key={list.list_id} value={list.list_id}>{list.title}</option>
                            )
                       )}
                       

                </select>
                </div>
            </div>
            <div className="mt-3">
                <div>
                    <label htmlFor="make" className="block text-sm font-medium text-gray-700">
                    Vehicle Make
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    Make
                        </span>
                    <input
                        type="text"
                        value={allValues.make}
                        onChange={changeHandler}
                        name="make"
                        id="make"
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                        placeholder="BMW, Mercedez..."
                        />
                    </div>
                </div>
            </div>
            <div className="mt-2">
                <div>
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                    Vehicle Model
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                            Model
                        </span>
                    <input
                        type="text"
                        value={allValues.model}
                        onChange={changeHandler}
                        name="model"
                        id="model"
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                        // placeholder="Example: Lobby "
                        />
                    </div>
                </div>
            </div>
            <div className="mt-2">
                <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                        Year
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    Year
                        </span>
                    <input
                        type="text"
                        value={allValues.year}
                        onChange={changeHandler}
                        name="year"
                        id="year"
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                        // placeholder="Example: Lobby "
                        />
                    </div>
                </div>
            </div>
                <button
                    onClick={(e) => handleAddVehicle (e)}
                    type="button"
                    className="inline-flex items-center mt-4 px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Add New Vehicle
                </button>
        </div>

        
        
       </>
    )
}
