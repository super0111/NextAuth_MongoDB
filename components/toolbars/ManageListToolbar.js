import { useState } from "react";
import DeleteListModal from '../modal/DeleteListModal';

export default function ManageListToolbar(props) {
    const {addPlate, setAddPlate, list} = props;
    const [showDeleteList, setShowDeleteList] = useState(false)
    return (
        <div>
            <div className=" md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Manage List</h2>
                </div>
                {showDeleteList && < DeleteListModal open={showDeleteList} setOpen={setShowDeleteList} list={list} />}
                <div className="mt-4 flex md:mt-0 md:ml-4">

                   {!addPlate ?(
                       <>
                       {/* Add Plate To List - Removed-Conflicting with vehicles collection */}
                        {/* <button
                        type="button"
                        onClick={() => setAddPlate(true)}
                        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                        Add Plate
                        </button> */}
                        <button
                            type="button"
                            onClick={() => setShowDeleteList(true)}
                            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                        Delete List
                        </button>
                    </>
                   ):(
                    <button
                    type="button"
                    onClick={() => setAddPlate(false)}
                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-400 hover:bg-rose-700  "
                    >
                    Cancel Add
                    </button>
                   )}
                </div>
            </div> 
        </div>
    )
}
