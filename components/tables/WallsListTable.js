import useSWR, { mutate, useSWRConfig } from "swr";
import { useState } from "react";
import Link from "next/link";
import WallService from "../services/WallService";
import { MdContentCopy } from "react-icons/md";
import { AiFillEye, AiFillEyeInvisible  } from "react-icons/ai";

async function fetcherFunc(url){
    const res = await fetch(url);
    return res.json();
    }
export default function WallsListTable(props) {
    const { searchItem } = props;
    const [hover, setHover] = useState(false);
    const onHover = () => {
      setHover(!hover)
    }

   const handleDeleteWall = async(e,wall) => {
    e.preventDefault()
    const res = await WallService.deleteWall(wall._id)
     if(!res.data.success){
         return alert('Could Not Delete Wall')
     }
    mutate('/api/cameras/walls')
   }



    const url ='/api/cameras/walls';
    const { data,error } = useSWR(url, fetcherFunc, {initialProps: props, revalidateOnMount: true});
    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>

    // console.log(data)  
    return (
        <div>
            <div className="flex flex-col mt-4">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 flex flex-row text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Name
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                            >
                               Cameras
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                            >
                               Pin
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                            >
                               Wall URL
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                            >
                               View
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                            >
                               Delete
                            </th>
                           
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.walls.filter((val) => {
                            if(searchItem === '' ){
                                return val
                            } else if ( val.name.toLowerCase().includes(searchItem.toLowerCase()) ){
                                return val
                            }}).map((wall) => (
                            <tr key={wall._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {wall.name}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {wall.cameras.length} cameras
                                    </div>
                                </td>
                                <td  className="px-6 py-4  whitespace-nowrap cursor-pointer" >
                                       {!hover ? (
                                       <span onMouseEnter={onHover} onMouseLeave={onHover}  className="flex flex-row justify-start items-center" >
                                             <AiFillEyeInvisible size={16} className="text-gray-400 mr-2" /> View Pin
                                       </span>
                                       ):(
                                       <span onMouseEnter={onHover} onMouseLeave={onHover}  className="flex flex-row justify-start items-center" >
                                       <AiFillEye size={16} className="text-gray-400 mr-2"/>  {wall.pin} 
                                       </span>
                                       )}
                                </td>
                                <td  className="px-6 py-4 whitespace-nowrap">
                                    <div onClick={() => {navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL}/walls/?pin=${wall.pin}`)}} className="flex items-center cursor-pointer hover:animate-[ping_3s_infinite]">
                                       <MdContentCopy/> Copy URL
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link href={`/walls/?pin=${wall.pin}`}> 
                                        <span className="px-4 py-2 cursor-pointer inline-flex text-md leading-5 font-semibold rounded-full  bg-blue-300 text-blue-800">
                                            View
                                        </span>
                                    </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-md font-medium">
                                    <span onClick={(e) => handleDeleteWall(e,wall)} className="px-4 py-2 cursor-pointer inline-flex text-md leading-5 font-semibold rounded-full bg-rose-200 text-rose-800">
                                        Delete
                                    </span>
                                </td>

                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                    </div>
                </div>
                </div>
        </div>
    )
}
