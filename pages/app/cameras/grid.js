import { useRouter } from "next/router";
import CamFrame from "../../../components/camera/CamFrame"
import {
    AcademicCapIcon,
    BadgeCheckIcon,
    CashIcon,
    ClockIcon,
    ReceiptRefundIcon,
    UsersIcon,
    ArrowCircleRightIcon,
    LocationMarkerIcon
  } from '@heroicons/react/outline'
import CamAnt from "../../../components/camera/CamAnt";
import useSWR from "swr";
import GridToolbar from "../../../components/toolbars/GridToolbar";
import { useEffect, useState } from "react";
import CamGridPlayer from "../../../components/camera/players/CamGridPlayer";
import WallService from "../../../components/services/WallService";


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  
async function fetcherFunc(url){
  const res = await fetch(url);
  return res.json();
  }
export default function Grid(props) {
    const router = useRouter();
    const [gridRowAmt, setGridRowAmt] = useState(router.query.axis === "3" ? '3' : '2')
    const [locationFilter, setLocationFilter] = useState('')
    const [cameras, setCameras] = useState([]);
    const [walls, setWalls] = useState([]);
    const [selectedWall, setSelectedWall] = useState(null);
    const [loaded, setLoaded] = useState(false)
    const [loadError, setLoadError] = useState(false)

    useEffect(() => {
      setGridRowAmt(router.query.axis)
    }, [router])

    const getWalls = async () => {
      const res = await WallService.getWalls()
      console.log(res)
      if(res.data.success && res.data.walls.length > 0){
        console.log('Fetched Walls')
        setWalls(res.data.walls)
        setSelectedWall(res.data.walls[0])
        getWallByPin(res.data.walls[0]?.pin)

      }else{
        console.log('FETCH WALLS ERROR ')
        setLoadError(true)
     }
     }

    const getWallByPin = async (pin) => {
      const res = await WallService.getWallByPin(pin)
      console.log(res)
        if(res.data.success){
          console.log('loaded wall by pin', pin)
          setSelectedWall(res.data.wall)
          setCameras(res.data.cameras)
          console.log(res.data.cameras)
          setLoaded(true)
        }else{
          console.log('FETCH WALL BY ID ERR')
          setLoadError(true)
      }
    }
    
    const handleWallChange = (e) => {
        e.preventDefault()
        setLoaded(false)
        getWallByPin(e.target.value)
    }


    useEffect(() => {
     getWalls()
    }, [])
    // const url ='/api/cameras';
    // const { data,error } = useSWR(url, fetcherFunc, {initialProps: props, revalidateOnMount: true});
    if (loadError) return <div>Camera Walls Not Found</div>
    if (!loaded) return <div>loading...</div>
    console.log(selectedWall.name, cameras)
    return (
      <>
         <GridToolbar setGridRowAmt={setGridRowAmt} gridRowAmt={gridRowAmt} walls={walls} selectedWall={selectedWall} handleWallChange={handleWallChange} locationFilter={locationFilter} setLocationFilter={setLocationFilter}/>
        <div className="w-[100%] mt-4">
          <div className={ gridRowAmt === '3'  ?
          "rounded-lg bg-gray-900 p-2 overflow-hidden shadow divide-y divide-gray-200 sm:divide-y-0 sm:grid sm:grid-cols-3 sm:gap-px"
          : 
          "rounded-lg bg-gray-900 p-2 overflow-hidden shadow divide-y divide-gray-200 sm:divide-y-0 sm:grid sm:grid-cols-2 sm:gap-px"}>
            {cameras.filter((val) => {
                    if(locationFilter  === ''){
                        return val
                    } else if ( val.location?.toLowerCase().includes(locationFilter.toLowerCase()) ){
                        return val
                    }}).map((camera, cameraIdx) => (
                          <div
                            key={camera.ip}
                           
              >
                {/* <div className="flex flex-row justify-between px-2 py-1">
                  <span className="text-white font-bold text-lg">{camera.name}</span>
                  <span className="text-white font-bold text-lg flex flex-row justify-end items-center">
                    {camera.location} 
                    < LocationMarkerIcon className="text-white h-8 w-8" />
                  </span>
                </div> */}
                {/* <CamGridPlayer camera={camera} /> */}
                <CamAnt streamId={camera.antStreamId} camera={camera} index={cameraIdx} height={'500px'} width={'600px'}/>  
              </div>
            ))}
        </div>

      </div>
    </>
    )
}
