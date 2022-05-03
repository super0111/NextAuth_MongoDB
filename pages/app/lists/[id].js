import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import AddPlateModal from "../../../components/modal/AddPlateModal";
import DeletePlateModal from "../../../components/modal/DeletePlateModal";
import LprTriggerTable from "../../../components/tables/LprTriggerTable";
import SingleLprList from "../../../components/tables/SingleLprList";
import ManageListToolbar from "../../../components/toolbars/ManageListToolbar";

async function fetcherFunc(url){
    const res = await fetch(url);
    return res.json();
    }

export default function singleListPage(props) {
    const router = useRouter();
    const [addPlate, setAddPlate] = useState(false)
    const [deletePlate, setDeletePlate] = useState(false);
    const [selectedDelete, setSelectedDelete] = useState('');

    const handleDeletePlate = (member) => {
        console.log('Handle Delete', member)
        setSelectedDelete(member)
        setDeletePlate(true)
    }

    const url ='/api/lpr-lists';
    const { data,error } = useSWR(url, fetcherFunc, {initialProps: props, revalidateOnMount: true});
    if (error) return <div>failed to load</div>
    if (!data ) return <div>loading...</div>
    const filteredList = data.lists.filter( list => list.list_id === router.query.id)[0]

    console.log(data.lists)
    return (
        <div>
            <ManageListToolbar setAddPlate={setAddPlate} addPlate={addPlate} list={filteredList}/>
            <div className="mt-4">
                {addPlate && <AddPlateModal list={filteredList} setOpen={setAddPlate} open={addPlate}/>} 
                {deletePlate && <DeletePlateModal  plate={selectedDelete} list={filteredList} setOpen={setDeletePlate} open={deletePlate}/>}
               <div>
                   <LprTriggerTable list={filteredList}/>
               </div>
               <div className="mt-2">
                 <SingleLprList filter={router.query.id} list={filteredList}  handleDeletePlate={handleDeletePlate}/>
               </div>
            </div>
        </div>
    )
}
