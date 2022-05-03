import { useEffect, useState } from "react"
import CameraService from "../services/CameraService"
import { GoLocation } from "react-icons/go"
import { useSWRConfig } from "swr";

export default function AddCamWallForm(props) {
    const { setOpen } = props;
    const [cameras, setCameras] = useState([])
    const [loading, setLoading] = useState(true);
    const [camsChecked, setCamsChecked] = useState([]);
    const [wallName, setWallName] = useState('');
    const {mutate} = useSWRConfig()

    const fetchCameras = async() => {
        const res = await CameraService.getAllCamera()
        if(res.data.success){
            setCameras(res.data.cameras)
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchCameras()
    }, [])

    const handleCheck = (cam) => {
        console.log( camsChecked.some((camera) => camera._id === cam._id) )
        if( camsChecked.some((camera) => camera._id === cam._id) ){
            setCamsChecked( camsChecked.filter((camera) => camera._id !== cam._id))
        }else{
            setCamsChecked([...camsChecked, cam])
        }
    }
   
  
    const handleAddWall = async(e) => {
        e.preventDefault();
        if(wallName === ''){
          return alert('Add Wall Name')
        }
        const url = '/api/cameras/walls/';
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: wallName,
                cameras: camsChecked
            })
        })
        .then(function (res) {
              return res.json()
            // `data` is the parsed version of the JSON returned from the above endpoint.
        }).then(function (data) {
            if(data.success){
              mutate(`/api/cameras/walls`)
              setOpen(false)
            }
            console.log(data)
        }).catch((err) => {
            console.log(err)
          });
      }
    
    console.log(camsChecked)
    if(loading) return <h1>Loading Cameras...</h1>
    return (
        <div className="flex flex-col">
             <div className="mt-4">
                <div>
                    <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                    Camera Wall Name
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-lg">
                         Name
                        </span>
                        <input
                        type="text"
                        value={wallName}
                        onChange={(e) => setWallName(e.target.value)}
                        id="name"
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-lg border-gray-300"
                        />
                    </div>
                </div>
            </div>
            <div className="max-h-[360px] overflow-y-auto">
                {cameras.map((cam) => {
                    return (
                        <div key={cam._id} className={ camsChecked.some((camera) => camera._id === cam._id)  ? " rounded bg-gray-200 py-2 px-2 text-blue-500 my-4 flex flex-col w-full" : "rounded bg-gray-100 py-2 px-2 my-4 flex flex-col w-full" }>
                            <div className="flex flex-row cursor-pointer"   >
                                <input type="checkbox" className="cursor-pointer"  onChange={() => handleCheck(cam)} />
                                <span className="font-bold text-xl px-2 ml-1">{cam.name}</span>
                            </div>
                        <span className="font-bold text-xl px-2 ml-1 flex flex-row items-center"> <GoLocation  className="h-10 mr-1"/>{cam.location}</span>
                        </div>
                    )
                })}
                
            </div>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                onClick={(e) => handleAddWall(e)}
                >
                Add Camera Wall
                </button>
                <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                onClick={() => setOpen(false)}
                >
                Cancel
                </button>
            </div>

        
            
        </div>
    )
}
