import { useSWRConfig } from "swr";

export default function ManageCameraToolbar(props) {
    const {isEditing, setAdd, setOpen, setEdit, camera} = props;
    const {mutate} = useSWRConfig()

    const handleDelete = async(e) => {
        e.preventDefault();
        const url = `/api/cameras/${camera._id}`;
        const res = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(function (res) {             
            mutate('/api/cameras')
            return res.json()
    
            // `data` is the parsed version of the JSON returned from the above endpoint.
        }).then(function (data) {
            setEdit(false)
        }).catch((err) => {
            console.log('Cam Delete Err' +err)
          });
      }
    return (
        <div>
            <div className=" md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Cameras</h2>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                   
                {!isEditing ? (
                    <button
                        type="button"
                        onClick={() => setAdd(true)}
                        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                    Add Camera
                    </button>
                    ):(
                        <div className="flex flex-row">
                            <button
                            type="button"
                            onClick={() => setEdit(false)}
                            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                            Cancel Edit
                            </button>
                            <button
                            type="button"
                            onClick={(e) => handleDelete(e)}
                            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                            Delete Camera
                            </button>
                        </div>
                        )
                    }
             </div>
            </div>
        </div>
    )
}
