import { useEffect, useState } from "react";
import AddListForm from "../../../components/forms/AddListForm";
import ManageLprListTable from "../../../components/tables/ManageLprListTable";
import ManageAllListsToolbar from "../../../components/toolbars/ManageAllListsToolbar";

export default function manage() {
    const [addList, setAddList] = useState(false)
    const [searchItem, setSearchItem] = useState('')

    return (
        <div className="bg-white shadow sm:rounded-lg lg:min-h-[800px]">
            <div className="bg-gray-100 inset-x-0 top-0 px-4 py-5 sm:px-6">
                         
                <div>
                    <div className="m-4 max-w-[300px]">
                        <label htmlFor="searchDevices" className="block text-xl font-medium text-gray-700">
                        Search License Plate Lists
                        </label>
                        <div className="flex flex-row items-center">
                            <input
                                type="searchDevices"
                                name="searchDevices"
                                id="searchDevices"
                                onChange={ (e) => setSearchItem(e.target.value) }
                                className="shadow-sm mt-1 block w-full pl-3 pr-10 py-2 text-base focus:ring-indigo-500 focus:border-indigo-500 sm:text-xl border-gray-300 rounded-md"
                                placeholder="Search ..."
                            />
                        </div>
                    </div>
                </div>
            </div>

                <div className ="bg-black px-2 pb-4 py-2">
                    <ManageAllListsToolbar addList={addList} setAddList={setAddList} />
                    <div className="mt-4">
                        { !addList ?
                        ( <ManageLprListTable  />)
                            :
                        (<AddListForm />)
                        }
                        </div>
                </div>
        </div>
    )
}
