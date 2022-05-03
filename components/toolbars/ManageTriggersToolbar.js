import { useState } from "react";
import AddTriggerModal from "../modal/AddTriggerModal";
import { useAuthContext } from '../../contexts/AuthContext';
import { useRouter } from "next/router";
import AddScheduledTriggerModal from "../modal/AddScheduledTriggerModal";

export default function ManageTriggersToolbar(props) {
    const  auth  = useAuthContext() // AuthContext object.
    const router = useRouter();
    const { addTrigger, setAddTrigger, item, editListItem, setEditListItem, filterType } = props;
    const [showDeleteList, setShowDeleteList] = useState(false)

    const handleDeleteItem = async(e) => {
        e.preventDefault()
        const url = '/api/triggers';
        const res = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                item_id:item._id,
            })
        })
        .then(function (res) {
            // if(res.ok){
                // mutate('/api/triggers')
                return res.json()
            // }
            // `data` is the parsed version of the JSON returned from the above endpoint.
        }).then(function (data) {
            console.log('Ran Delete Trigger')
            setEditListItem(false)
        }).catch((err) => {
            console.log(err)
          });

    }
    console.log(filterType)
      return (
            <div className=" md:flex md:items-center md:justify-between pt-4 px-6">
                <div className="flex-1 min-w-0">
                   {   filterType === 'instant'  ||   filterType === ''  ? (
                    <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate">Edge Triggers</h2>
                    ):(
                        <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate">Scheduled Triggers</h2>
                   )}
                </div>
                {addTrigger && 
                      filterType === 'instant'  ||   filterType === ''  ?  <AddTriggerModal open={addTrigger} setOpen={setAddTrigger}  /> : <AddScheduledTriggerModal open={addTrigger} setOpen={setAddTrigger}  /> 
                }
                <div className="mt-4 flex md:mt-0 md:ml-4">
                {!editListItem ?(
                        auth.user.userType === 0 &&
                                <button
                                    type="button"
                                    onClick={() => setAddTrigger(true)}
                                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                               {   filterType === 'instant'  ||   filterType === ''  ?  'Add Trigger' : 'Add Scheduled Trigger'} 
                                </button>
                                        
                    ):(
                    <>
                        <button
                        type="button"
                        onClick={() => setEditListItem(false)}
                        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                        Close Edit
                        </button>

                        <button
                        type="button"
                        onClick={(e) => handleDeleteItem(e)}
                        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                        Delete Trigger
                        </button>
                    </>
                    )}
                </div>
            </div> 
    )
}
