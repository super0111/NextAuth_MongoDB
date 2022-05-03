import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import dateformat from 'dateformat'
import CamEventClipModal from '../modal/CamEventClipModal';
import AiBoxModal from '../modal/AiBoxModal';

export default function CamEventTable(props) {
    const {camera, showAiClips, showVideoClips} = props;
    const [loadMore, setLoadMore] = useState(false);
    const [loadNextUrl, setLoadNextUrl] = useState('');
    const [refresh, setRefresh] = useState(false)
    const [events, setEvents] = useState(null);
    const [eventsMeta, setEventsMeta] = useState(null);
    const [loadError, setLoadError] = useState(false);
    const [loadErrMessage, setLoadErrMessage] = useState('');
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const aiEventsUrl = `/api/cameras/ai` ;

    const loadNextEvents = async(e) => {
        e.preventDefault()
        if(loadNextUrl === null){
            return alert('Reached End of Ai Recordings')
        }
        const res = await axios.post(`/api/cameras/ai?id=${camera._id}&next=true`,{
            nextUrl: loadNextUrl
        })
        console.log(res)
        // setEvents(res.events)
        events.push(... res.data.events.objects)
        setEventsMeta(res.data.events.meta)
        setLoadNextUrl(res.data.events.meta.next)
    }
    const viewEventModal = (e,event) => {
        e.preventDefault()
        setSelectedEvent(event)
        setShowEventModal(true);
    }

    //Load Video Clips
    useEffect(() => {
    console.log('Fetching Ai Clips')
      axios.get(aiEventsUrl, 
        {
        params: {
            id: camera._id
          }
        }
        )
        .then((res) =>{
            console.log(res.data)
            setEvents(res.data.events.objects)
            setEventsMeta(res.data.events.meta)
            setLoadNextUrl(res.data.events.meta.next)
        }).catch((err) => { 
            console.log(err); 
            setLoadError(true);
            setLoadErrMessage(err.message)
        })
    }, [])

   
    useEffect(() => {
       if(refresh){
        axios.get(aiEventsUrl, {
            params: {
                id: camera._id
              }
            }
        )
        .then((res) =>{
            // console.log(res.data)
            setEvents(res.data.events.objects)
            setEventsMeta(res.data.events.meta)
            setLoadNextUrl(res.data.events.meta.next)
            setRefresh(false)
        }).catch((err) => { 
            console.log(err); 
            setLoadError(true);
        })
       }
    }, [refresh])

    if (loadError) return <div>Fetch Events Error</div>
    if (!events) return <div className="cursor-progress">loading...</div>
    console.log(events)
    // console.log(selectedEvent)
    return (
        <div>
            {/* {showEventModal && <CamEventClipModal open={showEventModal} setOpen={setShowEventModal} event={selectedEvent} camera={camera} />} */}
            {showEventModal && <AiBoxModal open={showEventModal} setOpen={setShowEventModal} event={selectedEvent} camera={camera} />}


            <div className="overflow-y-auto overscroll-contain max-h-[480px] min-w-[200px]">
                {/* Show Video Clips */}
                { events.filter( 
                        (e) => e.meta.total !== "0").filter((e) => e.thumb !== undefined).map((event, idx) => (
                    <div key={idx}>
                        <div key={event.id}> 
                            <div  className="bg-black" >      
                            <div className="flex flex-col items-center cursor-pointer hover:border-4 hover:border-rose-600">
                                    <div className="px-1 py-2 flex flex-row justify-between items-center text-white w-full">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">{ event.meta.total && `Ai Detections ${event.meta.total }`} </span>
                                        <span className="text-sm">{dateformat(new Date(event.time + 'Z'), " mm/dd/yyyy h:MM:ss TT ")}</span>
                                    </div>
                                <div className="hover:border-2 hover:shadow-2xl  w-full "  onClick={(e) => viewEventModal(e, event)} >
                                    <img src={event.thumb?.url} alt="Cam Events Can't Load"  width={'100%'} height={'140px'} />
                                </div>
                                </div>
                            </div>
                            <hr/>
                        </div>
                    </div>
                ))}
                {events.filter(e => e.meta.total !== "0").length === 0 && <h1>No Recent Events</h1>}

            </div>
                   
            <div className="mt-6 flex flex-col justify-stretch">
            {(events.length === 0) || (loadError === true) ?
              <button
                onClick={() => setRefresh(true)}
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Refresh
                </button>
                :
                <button
                onClick={(e) => loadNextEvents(e)}
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                Load Previous Events
                </button>
            }
            </div>
        </div>
    )
}
