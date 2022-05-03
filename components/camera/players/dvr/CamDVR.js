import { createRef, useContext, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import axios from 'axios';
import dateformat from 'dateformat';
import ReactPlayer from 'react-player'
import Link from 'next/link';
import { AiFillCamera } from "react-icons/ai";

//timeline
import { ScrollMenu , VisibilityContext, getItemsPos} from 'react-horizontal-scrolling-menu'; // Timeline Scroll

////

export default function CamDvrCustom(props) {
    const {camera,  options, onReady  } = props
    const [loadedLiveUrls, setLoadedLiveUrls] = useState(false);
    const [loadedBounds, setLoadedBounds] = useState(false)
    const [calenderBounds, setCalenderBounds] = useState(null);
    const [watch, setWatch] = useState([]);
    const [dates, setDates] = useState([]);
    const [vidSrcArr, setVidSrcArr] = useState([]);
    const [playerLoaded, setPlayerLoaded] = useState(false)
    const [loadError, setLoadError] = useState(false);
    const [viewDayTimeline, setViewDayTimeline] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null); // Selected Daily Recording
    const [clipDuration, setClipDuration] = useState(0); // Loaded Src Clip Duration
    const [selectedInterval, setSelectedInterval] = useState([]); // DVR interval
    const [currentInterval, setCurrentInterval] = useState(null); // DVR Interval Highlight
    const [timelineIntervals, setTimelineIntervals] = useState([]); // DVR Timeline Intervals
    const [currentUrlIndex, setCurrentUrlIndex] = useState(0); //Vid Source Array Index
    const videoRef = useRef()
    const dvrRef = useRef({});

    
     //Player Config
    const [allValues, setAllValues] = useState({
        pip: true,
        controls: true,
        light: false,
        volume: 0.8,
        muted: true,
        played:0,
        loaded:0,
        duration:0,
        playbackRate: 1.0,
        loop: false,
        seeking: false
        });


         //  Calculate Intervals Func
    const everyNminutes = (n) => {
        let timeIntervals = [];    
        for(let hours = 0; hours < 24; hours++){
            for(let minutes = 0; minutes < 60; minutes = minutes+n){
                  let h = '';
                  let m = '';
                  if(hours<10){
                     h = '0' + hours;
                  }else{
                      h = hours;
                  }
                  if(minutes<10){
                     m = '0' + minutes;
                  }else{
                      m = minutes;
                  }
                  timeIntervals.push(h + ':' + m);
            }
        }
        setTimelineIntervals(timeIntervals)
    };

    // Load Timeline Interval 
    useEffect(() => {
       everyNminutes(1)  // 1 Min Intervals
    }, [])


    // Fetch Recording Calender Bounds
    useEffect(() => {
        const url =`/api/cameras/storage?id=${camera._id}&key=calender`;
        axios.get(url)
          .then((res) =>{
              console.log(res.data.calender.objects)
            setCalenderBounds(res.data.calender.objects)
          }).catch((err) => { 
              console.log(err); 
              setLoadError(true);
          })
    }, [])
    
    function parseDate(str) {
        var mdy = str.split('-');
        return new Date(mdy[2], mdy[0]-1, mdy[1]);
    }
    function datediff(first, second) {
        // Take the difference between the dates and divide by milliseconds per day.
        // Round to nearest whole number to deal with DST.
        return Math.round((second-first)/(1000*60*60*24));
    }
   
    // Set Dates of Recordings
    useEffect(() => {
       if(calenderBounds?.length){
        const start = new Date(calenderBounds[0]+'z') 
        const end = new Date(calenderBounds[1] +'z')    
        const daysBetween = datediff(parseDate(dateformat(start,"mm-dd-yyyy")), parseDate(dateformat(end,"mm-dd-yyyy"))) 
        const arr = [];
        for (let i = 0; i <= daysBetween ; i++) {
          const temp = new Date(parseDate(dateformat(start,"mm-dd-yyyy")));
          temp.setDate(temp.getDate() + i);
          arr.push(temp);
        }
        setDates(arr);
        setLoadedBounds(true)
       }
    }, [calenderBounds]);
    useEffect(() => {
        if(loadedBounds){
         handleFetchStartDate(calenderBounds[0])

        }
     }, [loadedBounds]);


    // Handle Load DVR Start
    const handleFetchStartDate = (date) => {
        // setSelectedDay(dateformat(date,  'yyyy-mm-dd'))
        console.log('Ran Fetch Start', date)
        let resArr = []
        const url =`/api/cameras/player?id=${camera._id}&key=recordedStart`;
        axios.post(url,{
            start: date // Send Calender Bounds in UTC TimeZone
        })
          .then((res) =>{
            if(res.data.success){
                console.log('Fetched Start File')
                console.log(res.data.clips)
                res.data.clips.objects.map((clip) => {
                    resArr.push({src: clip.url, type: 'video/mp4',start:clip.start, end:clip.end})
                })
            }
            setVidSrcArr(resArr)
            // console.log(resArr)
            setCurrentInterval(dateformat(resArr[0]?.start, "HH:MM"))
            setViewDayTimeline(true)

          }).catch((err) => { 
              console.log(err); 
              setLoadError(true);
         })
         setLoadedLiveUrls(true)
         setLoadedBounds(true)
    }   

    // Handle Click Start Date
    const handleClickStartDate = (date) => {
        handleDeselectDay() // Clear DVR STATE
        setSelectedDay(dateformat(date, 'yyyy-mm-dd'))
        let resArr = []
        const url =`/api/cameras/player?id=${camera._id}&key=recordedStart`;
        axios.post(url,{
            start: calenderBounds[0]  // Send Calender Bounds in UTC TimeZone
        })
          .then((res) =>{
            if(res.data.success){
                console.log('Fetched Start File')
                res.data.clips.objects.map((clip) => {
                    resArr.push({src: clip.url, type: 'video/mp4',start:clip.start, end:clip.end})
                })
            }
            setVidSrcArr(resArr)
            setCurrentInterval(dateformat(new Date(calenderBounds[0] + 'z'), 'HH:MM' ))
            setViewDayTimeline(true)
          }).catch((err) => { 
              console.log(err); 
              setLoadError(true);
         })
    } 

    // Handle Click Between Date
    const handleClickDate = (date) => {
        handleDeselectDay() // Clear DVR STATE
        let resArr = []
        setSelectedDay(dateformat(date, 'yyyy-mm-dd'))
        const url =`/api/cameras/player?id=${camera._id}&key=recordedStart`;
        axios.post(url,{
            start:  dateformat(date, 'yyyy-mm-dd') +'T05:00:00' // Add 5 Hours to correct Est TimeZone Offset (GMT -05:00) 
        })
          .then((res) =>{
            if(res.data.success){
                res.data.clips.objects.map((clip) => {
                    resArr.push({src: clip.url, type: 'video/mp4',start:clip.start, end:clip.end})
                }) 
            }
            setVidSrcArr(resArr) // Should Begin at 00:00 interval of selected day
            setCurrentInterval(dateformat(resArr[0].start, "HH:MM"))
            setViewDayTimeline(true)
          }).catch((err) => { 
              console.log(err); 
              setLoadError(true);
          })
    }  
   
    // Clear Intervals/Day
    const handleDeselectDay = () => {
        setViewDayTimeline(false);
        setSelectedDay(null);
        setSelectedInterval([])
        setCurrentInterval(null)
    } 

    
    ////// DVR Timeline Functions

  

    ///////////////////////////// Video Player Callbacks //////////////////////
    const handleProgress = state => {
        // console.log('onProgress', state)
        // We only want to update time slider if we are not currently seeking
        if (!allValues.seeking) {
          setAllValues(allValues)
        }
    }
    const handleDuration = (duration) => {
        console.log('onDuration', duration)
        setClipDuration(duration)
        setAllValues( prevValues => {
          return { ...prevValues, duration: duration}
        })
    }
    const handleEnded = () => {
        console.log('onEnded')
        setCurrentUrlIndex(currentUrlIndex + 1) // Set Next Clip to Next Idx Val
    }
    useEffect(() => {
       if(playerLoaded){
           console.log('Player Loaded')
           console.log(videoRef.current.getDuration())
       }
    }, [playerLoaded])

    // console.log( vidSrcArr,timelineIntervals, calenderBounds,dates)
    console.log(currentUrlIndex, vidSrcArr[currentUrlIndex])

    if(!loadedBounds ) return <h1>Searching For Recordings...</h1>
    return (
        <>
        <div>
            <div className="flex flex-row justify-start font-bold">  Today  {dateformat(new Date(), 'mm/dd/yyyy ') } </div>
                
                
            <div className="bg-black p-1  rounded-b" >
                 <div >
                    <ReactPlayer  width="100%" height="100%" 
                        ref={ (video) => videoRef.current = video}
                        controls={true} 
                        playing={loadedLiveUrls ? true : false}  
                        // url={selectedDay === null ? watch.hls+'.m3u8' : vidSrcArr} 
                        url={vidSrcArr[currentUrlIndex]?.src} 
                        onBuffer={() => {console.log('Buffering')}}
                        onBufferEnd={() => {console.log('Buffering Ended')}}
                        onError={(e) => { console.log('error',e)}}
                        onProgress={handleProgress}
                        onDuration={handleDuration}
                        onEnded={handleEnded}
                        onSeek={e => console.log('onSeek', e)}
                        pip={allValues.pip}
                        controls={allValues.controls}
                        light={allValues.light}
                        loop={allValues.loop}
                        playbackRate={allValues.playbackRate}
                        volume={allValues.volume}
                        muted={allValues.muted}
                        onReady={() => { setPlayerLoaded(true)}}
                        onStart={() => console.log('onStart')}
                        config={{ file: { attributes: { //Allows screenshot
                            crossOrigin: 'anonymous'
                          }}}}
                    />
                </div>
                  
            </div>
                 {/* <div  id="dvr-timeline"className="flex flex-row overflow-x-auto justify-between items-center bg-white px-2 py-1">
                         <div className="order-1">
                         🔍  Search Time Range 
                         </div>
                        <div className="flex flex-row order-2">
                            <div className="flex flex-col order-1">
                                <span>Start Time</span>
                                <span></span>
                            </div>
                        
                            <div className="flex flex-col order-2">
                                <span>End Time</span>
                                <span></span>
                            </div>
                        </div>
                        <div className="flex flex-col order-3">
                          2 Hr Time Range
                        </div>


                 </div> */}
                
                <div id="dvr-timeline"className="flex flex-row overflow-x-auto justify-start items-end bg-white rounded-lg" >
                    {timelineIntervals.map((interval, idx ) => {
                        return <div key={idx} className={idx % 2 === 0 && idx % 10 === 0 ? "border-2 border-red-200 mx-2 h-[4rem] flex flex-col items-center justify-end" : idx % 2 !== 0 && idx % 5 === 0 ? "border-2 border-gray-700 mx-2 h-[3rem] flex flex-col items-center justify-end"  :"border-2 mx-2 flex flex-col items-center justify-end "}>
                                <span>{interval}</span>

                            </div>
                    })}
                </div>
                
            
           
        </div>
     </>
    )
}
