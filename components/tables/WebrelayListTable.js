import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import WebRelayControlModal from "../modal/WebRelayControlModal";
import WebRelayService from "../services/WebRelayService";


async function fetcherFunc(url){
    const res = await fetch(url);
    return res.json();
    }
export default function WebrelayListTable(props) {
      const {locationFilter,searchItem} = props;
      const [viewWebRelay, setViewWebRelay] = useState(false);
      const [selectedWebRelay, setSelectedWebRelay] = useState(null)
      const [pageNumber, setPageNumber] = useState(0);
      const {mutate} = useSWRConfig()

      const handleViewWebRelay = (e,webrelay) => {
          e.preventDefault()
          setSelectedWebRelay(webrelay)
          setViewWebRelay(true)
      }
     const handleDeleteWebRelay = async (e,webrelay) => {
        const deleteWebrelay = await WebRelayService.deleteWebRelay(webrelay._id);
        mutate("/api/webrelays?action=retrieve&action_type=all")

    }
      const url = '/api/webrelays?action=retrieve&action_type=all';
      const { data,error } = useSWR(url, fetcherFunc, {initialProps: props, revalidateOnMount: true});
      if (error) return <div>failed to load</div>
      if (!data) return <div>loading...</div>
    //   console.log(data)
        const pages = new Array(data.totalPages).fill(null).map((v, i) => i);
        const gotoPrevious = () => {
            setPageNumber(Math.max(0, pageNumber - 1));
        };

        const gotoNext = () => {
            setPageNumber(Math.min(data.totalPages - 1, pageNumber + 1));
        };
    return (
        <div>
            <div className="flex flex-col">
                {viewWebRelay && selectedWebRelay && <WebRelayControlModal open={viewWebRelay} setOpen={setViewWebRelay} webrelay={selectedWebRelay} />}
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
                                Edit
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
                            {data.webrelays.filter((val) => {
                            if(locationFilter  === ''){
                                return val
                            } else if ( val.location?.toLowerCase().includes(locationFilter.toLowerCase()) ){
                                return val
                            }}).filter((val) => {
                                if(searchItem === ''){
                                    return val
                                } else if ( val.name?.toLowerCase().replaceAll('-', '').includes(searchItem.toLowerCase()) || val.location?.toLowerCase().replaceAll('-', '').includes(searchItem.toLowerCase()) ){
                                    return val
                                }}).map((webrelay) => (
                            <tr key={webrelay._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                        {/* <img className="h-10 w-10 rounded-full" src={person.image} alt="" /> */}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-md font-medium text-gray-900">{webrelay.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 py-2 inline-flex text-md leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        {webrelay.location}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-md font-medium">
                                    <span onClick={(e) => handleViewWebRelay(e,webrelay)} className="px-4 py-2 cursor-pointer inline-flex text-md leading-5 font-semibold rounded-full bg-blue-300 text-blue-800">
                                        View
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-md font-medium">
                                    <span className="px-4 py-2 cursor-pointer inline-flex text-md leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                                        Edit
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-md font-medium">
                                    <span onClick={(e) => handleDeleteWebRelay(e,webrelay)} className="px-4 py-2 cursor-pointer inline-flex text-md leading-5 font-semibold rounded-full bg-rose-200 text-rose-800">
                                        Delete
                                    </span>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                        <nav
                                className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
                                aria-label="Pagination"
                                >
                                {/* <div className="hidden sm:block">
                                    <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                                    <span className="font-medium">20</span> results
                                    </p>
                                </div> */}
                                <div className="flex-1 flex justify-start ">
                                    <a
                                    onClick={gotoPrevious}
                                    href="#"
                                    className="cursor-pointer relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                    Previous
                                    </a>
                                    <a
                                    onClick={gotoNext}
                                    className="cursor-pointer ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                    Next
                                    </a>
                                </div>
                                <div className="bg-white  flex flex-row justify-between items-center" >
                                {pages.map((pageIndex) => (
                                    <button key={pageIndex} onClick={() => setPageNumber(pageIndex)} className={pageIndex === pageNumber ? "m-2 p-2 rounded bg-gray-200 shadow-lg shadow-blue-600 px-2 border-4 border-blue-800 w-10 h-10 flex flex-col justify-center items-center" : "p-2 rounded bg-gray-200 shadow-lg px-2  w-10 h-10 flex flex-col justify-center items-center"}>
                                    {pageIndex + 1}
                                    </button>
                                ))}
                               
                            </div>
                            
                            </nav>
                    </div>
                    </div>
                </div>
                </div>
        </div>
    )
}
