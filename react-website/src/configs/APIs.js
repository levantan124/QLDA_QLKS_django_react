    import axios from "axios";
    import cookie from "react-cookies";

    // export const BASE_URL = 'http://192.168.1.233:8000/';
    export const BASE_URL = 'http://127.0.0.1:8000/';


    export const endpoints = {

    // 'login': '/o/token/',
    // 'current_user': '/accounts/current_user/',
    // 'signup': '/accounts/',
    'list_reservations' : '/reservations/',
    'deactivate_reservation': (id) => `/reservations/${id}/deactivate/`, // Thêm hàm cho deactivate với tham số id
    'update_reservation': (id) => `/reservations/${id}/`, // Update reservation endpoint
    'roomtypes': '/roomtypes/',
    'reservation_service' : '/reservation_services/',
    'services_of_reservation': (id) => `/reservations/${id}/services/`,
    'services' : '/services/',
    'deactive_service': (id) => `/reservation_services/${id}/`, 
    'bills' : '/bills/',
    'customer_reservations' : '/reservations/customer-reservations/',

    }   



    export const authAPI = () => {
        const token = cookie.load('token');
        return axios.create({
            baseURL: BASE_URL,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    export default axios.create({
        baseURL: BASE_URL
    });