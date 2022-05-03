import { useEffect, useState } from "react";
import useSWR from "swr";
import {HiFilter, HiOutlineFilter} from "react-icons/hi";
import UsersTable from "../../../components/tables/UsersTable";
import UsersToolbar from "../../../components/toolbars/UsersToolbar";
import UserService from "../../../components/services/UserService";


async function fetcherFunc(url){
    const res = await fetch(url);
    return res.json();
    }

export default function users(props) {
    const [users, setUsers] = useState([])
    const [searchItem, setSearchItem] = useState('');
    const [filterType, setFilterType] = useState('');

    const userTypes = [
        { name: 'Tenants',type:'tenant', href: '#', current: filterType === 'tenant' ? true : false },
        { name: 'Staff',type:'staff', href: '#', current: filterType === 'staff' ? true : false },
        { name: 'Manager',type:'manager', href: '#', current: filterType === 'manager' ? true : false  },
    ]
    const handleSelectFilter = (e,filterType) => {
        e.preventDefault()
        setFilterType(filterType)
    }


    const url = '/api/users';
    const { data,error } = useSWR(url, fetcherFunc, {initialProps: props, revalidateOnMount: true});
    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>
    return (
        <div>
            <div className="bg-gray-100 inset-x-0 top-0 px-4 py-5 sm:px-6">
                <div>
                    <div className="m-4 max-w-[300px]">
                        <label htmlFor="search-user" className="block text-xl font-medium text-gray-700">
                        Search Users
                        </label>
                        <div className="flex flex-row items-center">
                            <input
                                type="text"
                                name="search-user"
                                id="search-user"
                                autoComplete="off"
                                onChange={ (e) => setSearchItem(e.target.value) }
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-base border-gray-300 rounded-md"
                                placeholder="User Info or Plate Number"
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
                            {userTypes.map((type) => (
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
            <div className="bg-black px-2 pb-4">
                <UsersToolbar />
                <div className="mt-4">
                    <UsersTable users={data.users} searchItem={searchItem} filterType={filterType}/>
                </div>
           </div>
        </div>
    )
}
