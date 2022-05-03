import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import CamAnt from "../../../components/camera/CamAnt";
import FullPageLoader from '../../../components/FullPageLoader';
import { Fragment } from 'react'
import { Menu, Popover, Transition } from '@headlessui/react'
import {
  ArrowNarrowLeftIcon,
  CheckIcon,
  HomeIcon,
  PaperClipIcon,
  QuestionMarkCircleIcon,
  SearchIcon,
  ThumbUpIcon,
  UserIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/solid'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
import Image from "next/image";
import NotesSection from "../../../components/section/NotesSection";
import CamEventTable from "../../../components/tables/CamEventTable";
import AiEventTable from "../../../components/tables/AiEventTable";
import CameraSingleToolbar from "../../../components/toolbars/CameraSingleToolbar";
import CamSinglePlayer from "../../../components/camera/players/CamSinglePlayer";
import CamDvrCustom from "../../../components/camera/CamDvrCustom";
import CamDVR from "../../../components/camera/players/dvr/CamDVR";

async function fetcherFunc(url){
    const res = await fetch(url);
    return res.json();
    }
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
    }
      

   
export default function camSinglePage(props) {
    const router = useRouter();
    const [showVideoClips, setShowVideoClips] = useState(true)
    const [showLive, setShowLive] = useState(true);
    const [showAiClips, setShowAiClips] = useState(false)

    const handleShowVidClips = (e) => {
      e.preventDefault()
      setShowAiClips(false)
      setShowVideoClips(true)
    }

    const handleShowAiClips = (e) => {
      e.preventDefault()
      setShowAiClips(true)
      setShowVideoClips(false)
    }

    const url =`/api/cameras/${router.query.id}`;
    const { data,error } = useSWR(url, fetcherFunc, {initialProps: props, revalidateOnMount: true});
    if (error) return <div>failed to load</div>
    if (!data) return <FullPageLoader />
    return (
        <div>
          {/* Page header */}
          <div className="max-w-3xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
            <CameraSingleToolbar handleShowVidClips={handleShowVidClips} handleShowAiClips={handleShowAiClips} camera={data.camera} />
          </div>
           <main className="py-6 ">
            <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
              <div className="space-y-6 lg:col-start-1 lg:col-span-2">
                {/* Description list*/}
                {/* <button onClick={() => setShowLive(!showLive)}>Show/Hide</button> */}

                <section className=" flex flex-row justify-center">
                  <div className="bg-gray-200 flex justify-center  rounded-2xl shadow-2xl px-3 py-3 w-full">
                     {!showLive ? <div className="bg-black p-1 rounded-2xl min-w-full max-h=[600px]">
                       {/* <CamSinglePlayer  camera={data.camera} /> */}
                        <CamAnt streamId={data.camera.antStreamId} camera={data.camera} />
                      </div> : (
                        <div className="bg-black p-1 rounded-2xl min-w-full max-h=[600px]">
                          <CamDVR camera={data.camera} />
                       </div> 
                      )}
                  </div>
                </section>

                {/* Notes Section*/}
              <NotesSection id={router.query.id} />
              </div>

                  {/* Activity Feed */}
              <section aria-labelledby="timeline-title" className="lg:col-start-3 lg:col-span-1">
                <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
                  {showVideoClips ?
                    <h2 id="timeline-title" className="text-lg font-medium text-gray-900">
                      Activity
                    </h2>
                    :
                    <h2 id="timeline-title" className="text-lg font-medium text-gray-900">
                      Ai Events
                    </h2>
                  }
                  <div className="mt-6 flow-root">
                    {showVideoClips ?
                    <CamEventTable camera={data.camera} showAiClips={showAiClips}  showVideoClips={showVideoClips}  />
                    :
                    <AiEventTable  camera={data.camera} showAiClips={showAiClips}  showVideoClips={showVideoClips}  />
                    }
                  </div>
                </div>
              </section>
            </div>
        </main>
        </div>
    )
}
