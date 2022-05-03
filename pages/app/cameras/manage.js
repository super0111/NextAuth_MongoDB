import { useState } from "react";
import CamAnt from "../../../components/camera/CamAnt";
import ManageCameraToolbar from "../../../components/toolbars/ManageCameraToolbar";
import AddCameraModal from "../../../components/modal/AddCameraModal";
import ManageCameraTable from "../../../components/tables/ManageCameraTable";
import useSWR from "swr";
import CameraEditForm from "../../../components/forms/CameraEditForm";

export default function Manage(props) {
    const [showAddCams, setShowAddCams] = useState(false); //Show Add Camera Modal
    const [showEditCamera, setShowEditCamera] = useState(false)
    const [selectedCam, setSelectedCam] = useState(null)
    const [cameras, setCameras] = useState([
        {name:'Invid', streamId:'Invid-test1'},
        {name:'Vivo Dome', streamId:'vivo-test2'}
    ])
    const [height, setHeight] = useState('');
    const [width, setWidth] = useState('');

    const handleEditCamera = (e,camera) => {
        e.preventDefault()
        setShowEditCamera(true)
        setSelectedCam(camera)
    }
    return (
        <div className="min-h-max ">
            <ManageCameraToolbar  setAdd={setShowAddCams} isEditing={showEditCamera} setEdit={setShowEditCamera} camera={selectedCam}/>
            {showAddCams && <AddCameraModal open={showAddCams} setOpen={setShowAddCams}/> }
           {!showEditCamera && <ManageCameraTable setOpen={handleEditCamera}/>}
           {showEditCamera && selectedCam && 
            <div className="mt-4">
                <CameraEditForm open={showEditCamera} setEdit={setShowEditCamera} camera={selectedCam}/>
                </div>
            }
        </div>
    )
}
