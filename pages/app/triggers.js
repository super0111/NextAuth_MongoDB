import axios from "axios";
import { useEffect, useState } from "react";
import {HiFilter, HiOutlineFilter} from "react-icons/hi";
import TriggerEditForm from "../../components/forms/TriggerEditForm";
import ScheduledTriggerTable from "../../components/tables/ScheduledTriggerTable";
import TriggerListTable from "../../components/tables/TriggerListTable";
import ManageTriggersToolbar from "../../components/toolbars/ManageTriggersToolbar";

export default function trigger() {
    const [addTrigger, setAddTrigger] = useState(false);
    const [selectedEditItem, setSelectedEditItem] = useState({});
    const [editListItem, setEditListItem] = useState(false);
    const [contactEdit, setContactEdit] = useState(false)
    const [searchItem, setSearchItem] = useState('');
    const [filterType, setFilterType] = useState('instant');

    const handleEditItem = (e,item) => {
        e.preventDefault()
        setSelectedEditItem(item);
        setEditListItem(true)
    }

    const deleteNotifMember = (e, contact) => {
        e.preventDefault()
        let filtered = selectedEditItem.contact.filter((item) => item.phone !== contact.phone)
        console.log(filtered)
        selectedEditItem.contact = filtered
        setSelectedEditItem(selectedEditItem)
        setContactEdit(true)
    }
  
    useEffect(async() => {
        if(contactEdit){
           const res = await axios.put(`/api/triggers?trigger_id=${selectedEditItem._id}`,{
                updateType:'contact',
                updateVal: selectedEditItem.contact
    
            })
            setContactEdit(false)
        }
    }, [contactEdit])


    const triggerTypes = [
        { name: 'Edge ', type:'instant', href: '#', current: filterType === 'instant' ? true : false },
        { name: 'Scheduled', type:'scheduled', href: '#', current: filterType === 'scheduled' ? true : false },
    ]
    const handleSelectFilter = (e,filterType) => {
        e.preventDefault()
        setFilterType(filterType)
    }
    return (
        <div> 
            <div className="bg-gray-100 inset-x-0 top-0 px-4 py-5 sm:px-6">
                <div>
                    <div className="m-4 max-w-[300px]">
                        <label htmlFor="search-user" className="block text-xl font-medium text-gray-700">
                        Search Triggers
                        </label>
                        <div className="flex flex-row items-center">
                            <input
                                type="text"
                                name="search-user"
                                id="search-user"
                                autoComplete="off"
                                onChange={ (e) => setSearchItem(e.target.value) }
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-base border-gray-300 rounded-md"
                                placeholder="Search Trigger Name"
                            />
                        </div>
                    </div>
                    <nav className="flex  overflow-x-scroll min-h-[2.8rem]" aria-label="Breadcrumb">
                        <ol role="list" className="flex items-center space-x-4">
                            <li>
                            <div>
                                {filterType === '' ? 
                                    <HiOutlineFilter className="flex-shrink-0 h-5 w-5"  /> 
                                    : <HiFilter className="flex-shrink-0 h-5 w-5" aria-hidden="true" onClick={()=> setFilterType('') } />}
                                    <span className="sr-only">Filter</span>
                            </div>
                            </li>
                            {triggerTypes.map((type) => (
                            <li key={type.name}>
                                <div onClick={(e) => handleSelectFilter(e,type.type)} className="flex items-center">
                                    <svg
                                        className="flex-shrink-0 h-5 w-5 text-gray-300"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        aria-hidden="true"
                                    >
                                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                                    </svg>
                                    <a
                                        href={type.href}
                                        className={type.current ?"ml-4 text-lg font-medium text-blue-700 hover:text-gray-700"  :"ml-4 text-lg font-medium text-gray-500 hover:text-gray-700"}
                                        aria-current={type.current ? 'page' : undefined}
                                    >
                                        {type.name}  
                                    </a>
                                </div>
                            </li>
                            ))}
                        </ol>
                    </nav>
                </div>
             </div>
             <div className="bg-black px-2 pb-4 overflow-x-auto ">
                 <ManageTriggersToolbar filterType ={filterType}  addTrigger={addTrigger} setAddTrigger={setAddTrigger} editListItem={editListItem} item={selectedEditItem} setEditListItem={setEditListItem} />
                { !editListItem ?(
             
                    filterType === 'instant'  ||   filterType === '' ? 
                    <TriggerListTable handleEditItem={handleEditItem}  searchItem={searchItem} /> 
                    : <ScheduledTriggerTable  searchItem={searchItem} />
                   
                ):(
                <TriggerEditForm selectedEditItem={selectedEditItem}  deleteNotifMember={ deleteNotifMember}/>
            )}
             </div>
        </div>
    )
}
