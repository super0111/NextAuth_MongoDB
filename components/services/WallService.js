import http from '../http-common';
/* eslint-disable */

const deleteWall = (id) => http.delete(`/cameras/walls/${id}`);
const getWalls = (id) => http.get('/cameras/walls/');
const getWallByPin = (pin) => http.get(`/cameras/walls/?key=wallPinAuth&wallPin=${pin}`);





export default {
    getWalls,
    deleteWall,
    getWallByPin
};
