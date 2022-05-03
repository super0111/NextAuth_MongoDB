import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import dateformat from 'dateformat'
import CamEventClipModal from '../modal/CamEventClipModal';

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
    
    const eventsUrl =`/api/cameras/storage?id=${camera._id}&key=getImages`;
   
    const viewEventModal = (e,eventTime) => {
        e.preventDefault()
        setSelectedEvent(eventTime)
        setShowEventModal(true);
    }

    //Load Video Clips
    useEffect(() => {
      axios.get(eventsUrl)
        .then((res) =>{
            // console.log(res.data)
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
        axios.get(eventsUrl)
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
    
    const loadNextEvents = async(e) => {
        e.preventDefault()
        if(loadNextUrl === null){
            return alert('Events Limit Reached')
        }
        const res = await axios.post(`/api/cameras/storage?id=${camera._id}&key=getNextImages`,{
            nextUrl: loadNextUrl
        })
        console.log(res)
        events.push(...res.data.events.objects)
        setEvents(events)
        setLoadNextUrl(res.data.events.meta.next)
    }

    if (loadError) return <div>{loadError && showAiClips && 'Sorry Events Not Found'}</div>
    if (!events) return <div className="cursor-progress">loading...</div>
    // console.log(events)
    return (
        <div>
            {showEventModal && <CamEventClipModal open={showEventModal} setOpen={setShowEventModal} eventTime={selectedEvent} camera={camera} />}
            <div className="overflow-y-auto overscroll-contain max-h-[480px] min-w-[200px]">
                {/* Show Video Clips */}
               { events.map((event,idx) => (
                   <div key={idx}> 
                    <div  className="bg-black" >      
                       <div className="flex flex-col items-center cursor-pointer hover:border-4 hover:border-rose-600">
                            <div className="px-2">
                                <span className="text-white text-lg">{dateformat(new Date(event.time + 'Z'), "mmmm d, yyyy h:MM:ss TT")}</span>
                            </div>
                           <div className="hover:border-2 hover:shadow-2xl  w-full "  onClick={(e) => viewEventModal(e, event.time)} >
                             <img src={event.url} alt="Cam Events Can't Load"  width={'100%'} height={'140px'} />
                           </div>
                        </div>
                    </div>
                    <hr/>
                </div>
                ))}
                {events?.length === 0 && <h1>No Events Created</h1>}
                
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
