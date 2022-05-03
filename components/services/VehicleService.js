import http from '../http-common';
/* eslint-disable */

const findAllVehicles = () => http.get('/vehicles');
const deleteVehicle = (id) => http.delete(`/vehicles/${id}`);
const addVehiclePlate = (list_id, members) => http.put('lpr-lists',{
    list_id: list_id,
    members: members,
    updateType: 'member'
})



export default {
    findAllVehicles,
    deleteVehicle,
    addVehiclePlate
};
