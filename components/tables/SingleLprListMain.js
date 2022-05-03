import {useEffect} from 'react'
import {
    TrashIcon
} from '@heroicons/react/solid'
import useSWR from 'swr';


export default function SingleLprListMain(props) {
    const {list, searchItem} = props;
    // console.log(list)
    return (
        <div>
            <div className="flex flex-col shadow-2xl mt-4 m-2 ">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg ">
                        <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                             <div className="flex flex-col items-center">
                                  <span className="mb-4 text-black font-bold text-xl"> {list.title}</span>

                                {list.type === 'whitelist' ?
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        WHITELIST
                                      </span>
                                    :
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                                        BLACKLIST
                                        </span>
                                }
                                    <hr className="my-1"/>
                               
                             </div>
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.members.filter((val) => {
                            if(searchItem === '' || searchItem === list.type){
                                return val
                            } else if ( val.toLowerCase().includes(searchItem.toLowerCase()) ){
                                return val
                            }}).map((member, memIdx) => (
                            <tr key={memIdx} className={memIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member}</td>
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
