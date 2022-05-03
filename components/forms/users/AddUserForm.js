export default function AddUserForm(props) {
    const { changeHandler, allValues } = props;
    return (
                <>
                <div className="mt-4">
                    <div>
                        <label htmlFor="userType" className="block text-lg font-medium text-gray-700">
                            User Type
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                            <select
                            id="userType"
                            name="userType"

                            onChange={changeHandler}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg rounded-md"
                            value={allValues.userType}
                        >
                             <option value={100}>Select</option>
                            <option value={3}>Tenant</option>
                            <option value={2}>Staff</option>
                            <option value={1}>Manager</option>

                        </select>
                        </div>
                    </div>
                </div>
                 <div className="mt-2">
                    
                    <div>
                        <label htmlFor="firstname" className="block text-lg font-medium text-gray-700">
                         First Name
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-lg">
                            First  Name
                            </span>
                            <input
                            type="text"
                            value={allValues.fName}
                            onChange={changeHandler}
                            name="fName"
                            id="firstname"
                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg border-gray-300"
                            // placeholder="Example: Lobby "
                            />
                        </div>
                    </div>
                
                </div>
                
                <div className="mt-3">
                    <div>
                        <label htmlFor="lName" className="block text-lg font-medium text-gray-700">
                            Last Name
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-lg">
                            Last Name
                            </span>
                        <input
                            type="text"
                            value={allValues.lName}
                            onChange={changeHandler}
                            name="lName"
                            id="lName"
                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg border-gray-300"
                            // placeholder="Example: Lobby "
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-2">
                    <div>
                        <label htmlFor="email" className="block text-lg font-medium text-gray-700">
                        Email
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-lg">
                           Email
                            </span>
                        <input
                            type="text"
                            value={allValues.email}
                            onChange={changeHandler}
                            name="email"
                            id="email"
                            autoComplete="email"
                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg border-gray-300"
                            // placeholder="Example: Lobby "
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-2">
                    <div>
                        <label htmlFor="phone" className="block text-lg font-medium text-gray-700">
                         Phone
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-lg">
                            Phone
                            </span>
                        <input
                            type="text"
                            value={allValues.phone}
                            onChange={changeHandler}
                            name="phone"
                            id="phone"
                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg border-gray-300"
                            // placeholder="Example: Lobby "
                            />
                        </div>
                    </div>
                </div>
               
                
                </>

    )
}
