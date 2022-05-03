import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import KioskControlModal from "../modal/KioskControlModal";
import KioskService from "../services/KioskService"
import { MdContentCopy } from "react-icons/md";

async function fetcherFunc(url){
    const res = await fetch(url);
    return res.json();
    }
export default function KioskListTable(props) {
      const {locationFilter, searchItem} = props;
      const {mutate} = useSWRConfig()
      const [editKiosk, setEditKiosk] = useState(false);
      const [viewKiosk, setViewKiosk] = useState(false);
      const [selectedKiosk, setSelectedKiosk] = useState(null);

      const handleDeleteKiosk = async(e,kiosk) => {
          e.preventDefault()
          const res = await KioskService.deleteKiosk(kiosk._id)
          mutate('/api/kiosks')
      }
      const handleEditKiosk = async(e,kiosk) => {
        e.preventDefault()
        console.log('Edit Closed')
        setSelectedKiosk(kiosk)
      }
      const handleViewKiosk = async(e,kiosk) => {
        e.preventDefault()
        console.log('Edit Closed')
        setSelectedKiosk(kiosk)
        setViewKiosk(true)
      }
      const url ='/api/kiosks';
      const { data,error } = useSWR(url, fetcherFunc, {initialProps: props, revalidateOnMount: true});
      if (error) return <div>failed to load</div>
      if (!data) return <div>loading...</div>
      console.log(data)

    return (
        <div>
            {viewKiosk && <KioskControlModal open={viewKiosk} setOpen={setViewKiosk} kiosk={selectedKiosk} />}
            <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Name
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                            >
                               Location
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
                                Kiosk URL
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
                            {data.kiosks.filter((val) => {
                            if(locationFilter  === ''){
                                return val
                            } else if ( val.location?.toLowerCase().includes(locationFilter.toLowerCase()) ){
                                return val
                            }}).filter((val) => {
                                if(searchItem === ''){
                                    return val
                                } else if ( 
                                    val.name?.toLowerCase().includes(searchItem.toLowerCase())
                                    // val.location?.toLowerCase().includes(searchItem.toLowerCase()) 
                                ){
                                    return val
                                }}).map((kiosk) => (
                            <tr key={kiosk._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                        {/* <img className="h-10 w-10 rounded-full" src={person.image} alt="" /> */}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-md font-medium text-gray-900">{kiosk.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 py-2 inline-flex text-md leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        {kiosk.location}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap  text-md font-medium">
                                 <span  onClick ={(e) => handleViewKiosk(e,kiosk)} className="px-4 py-2 cursor-pointer inline-flex text-md leading-5 font-semibold rounded-full bg-blue-300 text-blue-800">
                                    View
                                </span>
                                </td>
                                <td  className="px-6 py-4 whitespace-nowrap">
                                    <div onClick={() => {navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL}/kiosks/?kiosk_id=${kiosk.kiosk_id}`)}} className="flex items-center cursor-pointer hover:animate-[ping_3s_infinite]">
                                       <MdContentCopy/> Copy URL
                                    </div>
                                </td>
                                {/* <td className="px-6 py-4 whitespace-nowrap text-right text-md font-medium">
                                 <span onClick ={(e) => handleEditKiosk(e,kiosk)} className="px-4 py-2 cursor-pointer inline-flex text-md leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                                    Edit
                                </span>
                                </td> */}
                                <td className="px-6 py-4 whitespace-nowrap text-right text-md font-medium">
                                    <span onClick={(e) => handleDeleteKiosk(e,kiosk) } className="px-4 py-2 cursor-pointer inline-flex text-md leading-5 font-semibold rounded-full bg-rose-200 text-rose-800">
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
