import { useState } from "react";
import AddLocationModal from "../../components/modal/AddLocationModal";

export default function ManageLocationsToolbar(props) {
    const [showAddItem, setShowAddItem] = useState(false);
    return (
        <div className="mb-1 mx-4 pt-6">
           {showAddItem && <AddLocationModal open={showAddItem} setOpen={setShowAddItem}/>}
            <div>
            <div className=" md:flex md:items-center md:justify-between ">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate">Locations</h2>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                   
                    <button
                        type="button"
                        onClick={() => setShowAddItem(true)}
                        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                    Add Location
                    </button>
                   
             </div>
            </div>
        </div>
            
        </div>
    )
}
