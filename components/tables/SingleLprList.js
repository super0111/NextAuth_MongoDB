import {useEffect} from 'react'
import {
    TrashIcon
} from '@heroicons/react/solid'
import useSWR from 'swr';

async function fetcherFunc(url){
    const res = await fetch(url);
    return res.json();
    }

export default function SingleLprList(props) {
    const {filter,list, handleDeletePlate} = props; 
    // const url ='/api/lpr-lists';
    // const { data,error } = useSWR(url, fetcherFunc, {initialProps: props, revalidateOnMount: true, });
    // if (error) return <div>failed to load</div>
    // if (!data ) return <div>loading...</div>
    
  console.log('Single',list)
    return (
        <div>
            <div className="flex flex-col max-w-[650px]">
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
                               Plate Number
                            </th>
                           
                            {/* <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Delete</span>
                            </th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {list.members.map((member, memIdx) => (
                            <tr key={memIdx} className={memIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member}</td>
                                     
                            {/* Delete Plate  */}
                                {/* <td onClick={() => handleDeletePlate(member)} className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium hover:bg-red-300">
                                    <a  className="flex flex-row justify-center text-rose-700 text-base hover:text-rose-900">
                                        <TrashIcon className="h-6 text-rose-700"/> Delete
                                    </a>
                                </td> */}
                            </tr>
                            )).reverse()}
                        </tbody>
                        </table>
                    </div>
                    </div>
                </div>
                </div>
        </div>
    )
}
