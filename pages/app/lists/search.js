import { useState } from "react";
import useSWR from "swr";
import SingleLprListMain from "../../../components/tables/SingleLprListMain";


async function fetcherFunc(url){
    const res = await fetch(url);
    return res.json();
    }
export default function search(props) {
    const [searchItem, setSearchItem] = useState('');
    const url ='/api/lpr-lists';
    const { data,error } = useSWR(url, fetcherFunc, {initialProps: props, revalidateOnMount: true});
    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>
    console.log(data)
    return (
        <div className=" ">
        {/*Search Component */}
            <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Tables Quick search
                </label>
                <div className="mt-1 relative flex items-center">
                    <input
                    type="text"
                    name="search"
                    id="search"
                    onChange={(e) => setSearchItem(e.target.value)}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                    />
                    <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                    <kbd className="inline-flex items-center border border-gray-200 rounded px-2 text-sm font-sans font-medium text-gray-400">
                        ⌘K
                    </kbd>
                    </div>
                </div>
            </div>
            
            {/*Lists*/}
            <div className="flex flex-row mt-2 overflow-x-auto max-w-[100%]">
                {data.lists.map((list) => (
                    <SingleLprListMain list={list} searchItem={searchItem} key={list.list_id}/>
                ))}
            
            </div>
        </div>
    )
}
