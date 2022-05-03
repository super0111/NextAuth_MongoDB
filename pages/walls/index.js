import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";
import CamGridPlayer from "../../components/camera/players/CamGridPlayer";
import {
    ViewGridAddIcon,
  } from '@heroicons/react/outline'

  async function fetcherFunc(url){
    const res = await fetch(url);
    return res.json();
    }
export default function index(props) {
const router = useRouter();
const [camWidth, setCamWidth] = useState('1')

const handleGridClick = () => {
    if(Number(camWidth) === 1){
        setCamWidth('2')
    }else if(Number(camWidth) === 2){
        setCamWidth('3')
    }else{
        setCamWidth('1')
    }
}

const url =`/api/cameras/walls/?key=wallPinAuth&wallPin=${router.query.pin}`;
const { data,error } = useSWR(router.query.pin ? url : null, fetcherFunc, {initialProps: props});
if (error) return <div>failed to load</div>
if (!data) return <div>loading...</div>
    return (
        <div className='bg-black  min-h-[100vh] '> 
            <div className={camWidth === '1' ? 'justify-items-center  grid-cols-3 grid w-full' : camWidth === '2' ? ' grid-cols-4 grid w-full' : 'justify-items-center  grid-cols-3 grid w-full' }> 

            {data.cameras?.map((cam,idx) =>{
                cam.width = cam.width ? cam.width : camWidth // Make this adjustable
            return <div key={idx} className={camWidth === '1' ?  "grid col-span-3 md:col-span-1 bg-white p-[0.1rem] w-full" : camWidth   ==='2' ?  "grid col-span-2 bg-white p-[0.1rem]" :"grid col-span-3 bg-white p-[0.1rem]"  }>
                    {/* <div className=' top-4 bg-black bg-opacity-20 px-[1.5rem] py-[1.2rem] left-2 rounded-3xl relative text-sm text-red-400'>
                        {cam.name}
                    </div> */}
                    <CamGridPlayer camera={cam} index={idx} />
                </div>
            }
            )}
            </div>

            <div className=" bg-opacity-10 backdrop-blur-sm bg-orange-100 p-2 rounded-full bottom-6 right-6 fixed ">
                < ViewGridAddIcon onClick={() => handleGridClick()} className=" h-8 w-8 sm:h-12 sm:w-12 text-white"/>
            </div>
        </div>
    )
}
