import { ScrollMenu , VisibilityContext, getItemsPos} from 'react-horizontal-scrolling-menu'; // Timeline Scroll
import DvrIntervalCard from '../cards/DvrIntervalCard';
import {AiOutlineDoubleLeft ,AiOutlineLeft,AiOutlineDoubleRight,AiOutlineRight } from "react-icons/ai"
import { useContext, useEffect, useRef, useState } from 'react';
import dateformat from 'dateformat';

export default function DvrTimelineCard(props) {
    const { currentInterval, selectedInterval,setCurrentInterval,setSelectedInterval,handleClickDvrDate, calenderBounds, selectedDay, setSelectedDay} = props;
    const [timelineIntervals, setTimelineIntervals] = useState([])
    const { isFirstItemVisible, scrollPrev,scrollToItem,visibleItems, getItemById } = useContext(VisibilityContext);
    const dvrRef = useRef({});
    
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

    

     // @React-Horizontal-Scroll (DVR scroll)
     const isItemSelected = (id) => !!selectedInterval.find((el) => el === id);
     // Handle Dvr Interval Clicked
     const handleClick = (id) =>
     ({ getItemById, scrollToItem }) => {
       const itemSelected = isItemSelected(id);
       setSelectedInterval((currentSelected) =>
         itemSelected
           ? currentSelected.filter((el) => el !== id)
           : currentSelected.concat(id)
       );
       if (!itemSelected) {
        let earlyBound = new Date(calenderBounds[0]+'z') //Recording Beginning Date
        let endBound = new Date(calenderBounds[1]+'z') //Recording End Date
        let dvrDateClicked =  new Date(selectedDay+'T'+ id)

        if( dvrDateClicked < earlyBound){
            console.log('Handle Click Before Start Boundary', dateformat(earlyBound, 'HH:MM' ))
            scrollToItem(getItemById(dateformat(earlyBound, 'HH:MM' )), 'smooth', 'center', 'nearest');
            setCurrentInterval(dateformat(earlyBound, 'HH:MM' ))
        }else if( dvrDateClicked > endBound){
            // NOTE: center item on select
            console.log('Handle Click After End Boundary',dateformat(endBound, 'HH:MM' ))
            scrollToItem(getItemById(dateformat(endBound, 'HH:MM' )), 'smooth', 'center', 'nearest');
            setCurrentInterval(dateformat(endBound, 'HH:MM' ));
        }else{
            console.log('Handle Within Bounds',id)
             // NOTE: center item on select
             scrollToItem(getItemById(id), 'smooth', 'center', 'nearest');
             setCurrentInterval(id);
        }
      }
    };

     // Center on Recording Start Bound
    const centerOnInitStartBound = ({
        getItemById,
        scrollToItem,
        visibleItems
      }) => {
        // const { center: centerItemKey } = getItemsPos(visibleItems); //Scroll to center Item on Init
        scrollToItem(getItemById(dateformat(new Date(calenderBounds[0] + 'z'), 'HH:MM' )), "auto", "center");
        setCurrentInterval(dateformat(new Date(calenderBounds[0] + 'z'), 'HH:MM' ))
    };
       // Center on Recording Start Bound
    const centerOnInit = ({
        getItemById,
        scrollToItem,
        visibleItems
      }) => {
        // const { center: centerItemKey } = getItemsPos(visibleItems); //Scroll to center Item on Init
        scrollToItem(getItemById("00:00"), "auto", "center");
        setCurrentInterval("00:00")
    };
    

    // Ref Reset Exampl
    const reset = () => {
        // console.log(centerItemKey , hour, minute)
        dvrRef.current.scrollToItem(
          dvrRef.current.getItemById("00:00"),
          // OR if you not sure about id for first item
          // dvrRef.current.getItemById(dvrRef.current.items.toItems()[0]),
          "auto",
          "center"
        );
      };

     function LeftArrow() {
         const { isFirstItemVisible, scrollPrev,scrollToItem,visibleItems, getItemById } = useContext(VisibilityContext);
         const { center: centerItemKey } = getItemsPos(visibleItems); //Scroll to center Item on Init
         const minusHour = () => {
             const timearray = centerItemKey.split(":");
             const hour = timearray[0];
             const minute = timearray[1];
             // console.log(centerItemKey , hour, minute)
             scrollToItem(getItemById((Number(hour) - 1).toString().padStart(2, '0') +':'+ minute), "auto", "center")
         }
         return (
            <div className="flex flex-col justify-between min-w-[4rem] divide-y-2 text-white">
                <button disabled={isFirstItemVisible} className="cursor-pointer h-[50%] bg-gray-500 flex flex-row  justify-evenly items-center min-w-[2rem]" onClick={() => scrollPrev()}>
                    <AiOutlineLeft className="hover:text-rose-700" />   
                    <span>Min</span>
                </button>
                <button disabled={isFirstItemVisible} className="cursor-pointer h-[50%] bg-gray-500 flex flex-row  justify-evenly  items-center min-w-[2rem]" onClick={() => minusHour()}>
                   <AiOutlineDoubleLeft className="hover:text-rose-700" />
                    <span>H</span>
                </button>
            </div>
         );
       }
       
     function RightArrow() {
         const { isLastItemVisible, scrollNext,scrollToItem,visibleItems, getItemById } = useContext(VisibilityContext);
         const { center: centerItemKey } = getItemsPos(visibleItems); //Scroll to center Item on Init
        //  console.log(centerItemKey) 
        const addHour = () => {
            const timearray = centerItemKey.split(":");
            const hour = timearray[0];
            const minute = timearray[1];
            // console.log(centerItemKey , hour, minute)
            scrollToItem(getItemById((Number(hour) + 1).toString().padStart(2, '0') +':'+ minute), "auto", "center")
        }
         return (
             <div className="flex flex-col  justify-between min-w-[4rem] divide-y-2 text-white">
                <button disabled={isLastItemVisible} className="cursor-pointer h-[50%] bg-gray-500 flex flex-row justify-evenly  items-center min-w-[2rem]" onClick={() => scrollNext()}>
                    <span>Min </span>
                    <AiOutlineRight className="hover:text-rose-700" />

                </button>
                <button disabled={isLastItemVisible}  className="cursor-pointer h-[50%] bg-gray-500 flex flex-row justify-evenly  items-center min-w-[2rem]" onClick={() => addHour()}>
                    <span>H </span>
                    <AiOutlineDoubleRight className="hover:text-rose-700" />

                </button>
            </div>
         );
       }
       
    const earlyBound = new Date(calenderBounds[0] + 'z') //Recording Beginning Date
    const endBound = new Date(calenderBounds[1] + 'z') //Recording End Date
    const dvrDateClicked =  new Date(selectedDay+'T'+ currentInterval)
    // console.log(earlyBound, new Date(selectedDay+'T'+ currentInterval) , endBound)
    return (
            <div className="flex flex-col" >
                 <ScrollMenu
                     LeftArrow={LeftArrow} 
                     RightArrow={RightArrow} 
                     apiRef={dvrRef}
                     scrollContainerClassName={"py-4" }
                     onInit={(dateformat(new Date(calenderBounds[0] + 'z'), 'yyyy-mm-dd' ) === (selectedDay)) ?  centerOnInitStartBound  : centerOnInit }  //replaced with useEffect/Ref
                    >
                    {timelineIntervals.map((interval,idx) => (
                        <DvrIntervalCard   
                        key={interval}
                        currentInterval={currentInterval}
                        handleClickDvrDate={handleClickDvrDate}
                        onClick={handleClick(interval)} 
                        selected={isItemSelected(interval)}  
                        itemId={interval}  
                        interval={interval} 
                        selectedDay={selectedDay} 
                        selectedInterval={selectedInterval} 
                        calenderBounds={calenderBounds} />
                    ))}
                </ScrollMenu>
             </div>
    )
}
