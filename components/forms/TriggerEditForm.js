import { BsTrash } from "react-icons/bs";

export default function TriggerEditForm(props) {
    const {selectedEditItem,  deleteNotifMember} = props;
    return (
        <div>
            <div className="bg-white mt-4 shadow sm:rounded-lg lg:min-h-[800px]">
                        <div className="px-4 py-5 sm:px-6">
                            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                            <div className="md:grid md:grid-cols-3 md:gap-6">
                            <div className="mt-5 md:mt-0 md:col-span-2">
                                <form action="#" method="POST">
                                <div className="grid grid-cols-6 gap-6">
                                    <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                    <strong>  Trigger Name:</strong> {selectedEditItem.name}
                                    </label>
                                    <input
                                        type="text"
                                        name="first-name"
                                        id="first-name"
                                        autoComplete="given-name"
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                    </div>


                                    <div className="col-span-6 sm:col-span-4">
                                    <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                                    <strong>  Trigger Endpoint:</strong> {selectedEditItem.endpoint}
                                    </label>
                                    <input
                                        type="text"
                                        name="endpoint"
                                        id="endpoint"
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="notifications" className="block text-sm font-medium text-gray-700">
                                        Notifications
                                    </label>
                                    <select
                                        id="notifications"
                                        name="notifications"
                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    >
                                        {selectedEditItem.notifications &&  <>
                                         <option value="true">SMS Notifications</option> 
                                         </>}
                                        <option>No Notifications</option>
                                       {!selectedEditItem.notifications && 
                                       <option>SMS Notifications</option>}
                                    </select>
                                    </div>

                                    {/* <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                        Add Member
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        id="city"
                                        autoComplete="address-level2"
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                    <button className="w-full bg-green-200 py-1 rounded-2xl mt-2"> Add Members</button>
                                    </div> */}
                                    <div className="col-span-6 sm:col-span-4 flex flex-row justify-start">
                                    { selectedEditItem.notifications ?
                                        <div className="flex flex-col ">
                                            <strong> Notification Members </strong>
                                                {selectedEditItem.contact.map((contact, idx) => (
                                                    <div  key={idx} onClick={(e) => deleteNotifMember(e,contact)} className="flex flex-row cursor-pointer m-1">
                                                        <BsTrash className="mr-2 hove: text-red-400" size={32}/>
                                                        <div className="text-lg " >
                                                            Phone: <span className="text-blue-600">{contact.phone}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                        :
                                        'Notifications Off'
                                        }
                                    </div>
                                </div>
                                </form>
                            </div>
                            </div>
                        </div>

                        </div>
                    </div>
        </div>
    )
}
