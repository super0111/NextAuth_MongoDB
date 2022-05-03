import Link from "next/link";
import { useContext } from "react";
import { VisibilityContext } from 'react-horizontal-scrolling-menu'; // Timeline Scroll
import dateformat from 'dateformat';

export default function DvrIntervalCard(props) {
    const {interval,currentInterval,onClick, handleClickDvrDate,selectedDay,selectedInterval, calenderBounds} = props;
    const visibility = useContext(VisibilityContext); // DVR Interval Function

    const handleClickItem = () =>{
        onClick(visibility)
        handleClickDvrDate(interval)
    }
    // console.log(dateformat(calenderBounds[0], 'yyyy-mm-dd' )+'T'+dateformat(calenderBounds[0], 'HH:MM' )  )
    const earlyBound = new Date(calenderBounds[0] + 'z') //Recording Beginning Date
    const endBound = new Date(calenderBounds[1] + 'z') //Recording End Date
    const dvrDateClicked =  new Date(selectedDay+'T'+ currentInterval)
    const intervalDate =  new Date(selectedDay+'T'+ interval)
    // console.log(intervalDate === dvrDateClicked,dvrDateClicked > earlyBound ,dvrDateClicked < endBound)
    // console.log(currentInterval)
    // console.log( interval === "00:00" ?((interval === currentInterval) && (intervalDate > earlyBound ) && (intervalDate < endBound)) : '')

    return (
        <div  onClick={() => handleClickItem()}
        className={
        (((interval === currentInterval) && (intervalDate > earlyBound ) && (intervalDate < endBound)) )? (  // Handle Selected Interval
                "cursor-pointer mx-1 my-2 px-2  bg-blue-800 text-white shadow-white shadow-sm rounded-lg  flex flex-col items-center"
            ):(endBound < intervalDate) ?(
                "cursor-not-allowed mx-1 my-2 px-2  bg-rose-800 text-white rounded-lg  flex flex-col items-center"
            ):( intervalDate < earlyBound ) ?(
                "cursor-not-allowed mx-1 my-2 px-2  bg-rose-800  text-white rounded-lg  flex flex-col items-center"
            ):(
                " mx-1 my-2 px-2 cursor-pointer bg-gray-200 shadow-lg rounded-lg flex flex-col items-center"
            )}>
            {/* <Link href={`#container-${interval}`} > */}
                <div 
                onClick={ endBound === intervalDate ? undefined : earlyBound === intervalDate ? undefined : intervalDate < earlyBound ? undefined : endBound < intervalDate ? undefined: () => handleClickDvrDate(interval) }
                >
                    <div className="min-w-[6rem]">
                        {dateformat(selectedDay.replace(/-/g, '/') , 'mmm dd ')}
                    </div>
                    {interval} 
                </div>
            {/* </Link> */}
        </div>
    )
}
