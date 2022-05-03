export default function ManageAllListsToolbar(props) {
    const {addList, setAddList} = props;
    return (
        <div>
            <div className=" md:flex md:items-center md:justify-between text-white">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7  sm:text-3xl sm:truncate">Manage Lists</h2>
                </div>
                <div className="mt-4  flex md:mt-0 md:ml-4">

                   {!addList ?(
                       <>
                        <button
                        type="button"
                        onClick={() => setAddList(true)}
                        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                        Add List
                        </button>
                    </>
                   ):(
                        <button
                        type="button"
                        onClick={() => setAddList(false)}
                        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-400 hover:bg-rose-700"
                        >
                        Cancel Add
                        </button>
                   )}
                </div>
            </div> 
        </div>
    )
}
