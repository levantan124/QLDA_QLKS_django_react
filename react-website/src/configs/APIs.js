    import axios from "axios";
    import cookie from "react-cookies";
    import moment from "moment";

    // export const BASE_URL = 'http://192.168.1.233:8000/';
    export const BASE_URL = 'http://127.0.0.1:8000/';

    export const formatNS = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };
    
    export const formatDate = (date) => {
        return moment(date).format(' HH:mm - DD/MM/YYYY');
    };


    export const endpoints = {

    'login': '/o/token/',
    'current_user': '/accounts/current_user/',
    'signup': '/accounts/',
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


    export const api = axios.create({
        baseURL: BASE_URL
    })
    
    export async function getRoomTypes() {
        try {
            const response = await api.get("/roomtypes/")
            // console.log(response.data)
            return response.data
        } catch (error) {
            throw new Error(error)
        }
    }


    export async function getAllEmployees() {
        try {
            const response = await api.get("/accounts/")
            // console.log(response.data)
            return response.data
        } catch (error) {
            throw new Error(error)
        }
    };

    export const addEmployee = async (username, name, email, role, password, isActive, avatar) => {
        try {
          const formData = new FormData();
          formData.append("username", username);
          formData.append("name", name); // Thêm trường name
          formData.append("email", email);
          formData.append("role", role);
          formData.append("password", password); // Thêm mật khẩu mặc định
          formData.append("is_active", isActive);
          if (avatar) {
            formData.append("avatar", avatar);
          }
      
          const response = await api.post("/accounts/", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
      
          return response.data;
        } catch (error) {
          console.error("Error adding employee:", error);
          throw error;
        }
    };

      export const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "roomtype"); // Thay "your_upload_preset" bằng giá trị thực tế từ Cloudinary
    
        try {
            const response = await axios.post("https://api.cloudinary.com/v1_1/thanhlem/image/upload", formData);
            return response.data.secure_url; // URL của ảnh đã được tải lên
        } catch (error) {
            console.error("Error uploading to Cloudinary: ", error);
            throw error;
        }
    };

    export async function getEmployeeById(EmployeeId) {
        try {
            const result = await api.get(`/accounts/${EmployeeId}/`)
            return result.data
        } catch (error) {
            throw new Error(`Error fetching room ${error.message}`)
        }
    };

    export async function updateEmployee(roomTypeId, roomTypeData) {
        // Nếu có ảnh mới, tải lên Cloudinary và lấy URL
        let imageUrl = roomTypeData.image;
        if (roomTypeData.image && typeof roomTypeData.image === 'object') {
            const fullImageUrl = await uploadToCloudinary(roomTypeData.image);
            imageUrl = fullImageUrl; // Chỉ lấy phần cần thiết của URL
        }
    
        const formData = new FormData();
        formData.append("nameRoomType", roomTypeData.nameRoomType);
        formData.append("price", roomTypeData.price);
        formData.append("quantity", roomTypeData.quantity);
        formData.append("image", imageUrl);
    
        try {
            console.log(...formData.entries());
            const response = await axios.patch(`http://127.0.0.1:8000/roomtypes/${roomTypeId}/`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating room type:', error);
            throw error;
        }
    };

    export async function deleteEmployee(AccId) {
        const confirmed = window.confirm("Bạn có muốn xoá account này?")
        if(confirmed){
            try {
                const result = await api.patch(`/accounts/${AccId}/delete-staff/`, {
                    // headers: getHeader()
                })
                return result.data
            } catch (error) {
                throw new Error(`Error deleting room type ${error.message}`)
            }
        }
    };

    export async function addRoom(nameRoom, roomType, status, active) {
        const formData = new FormData();
        formData.append("nameRoom", nameRoom);
        formData.append("roomType", roomType); // Đây là tên của RoomType
        try {
            console.log(formData);
            const response = await api.post("/rooms/", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 201) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error("Error in API call: ", error.response ? error.response.data : error.message);
            return false;
        }
    }

    export async function updateRoom(roomId, roomData) {
        const formData = new FormData();
        formData.append("nameRoom", roomData.nameRoom);
        formData.append("roomType", roomData.roomType);
        formData.append("status", roomData.status);
    
        try {
            const response = await api.patch(`/rooms/${roomId}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating room:', error);
            throw error;
        }
    }

    export async function getRoomById(roomId) {
        try {
            const result = await api.get(`/rooms/${roomId}/`)
            return result.data
        } catch (error) {
            throw new Error(`Error fetching room ${error.message}`)
        }
    }

    export async function deleteRoom(roomId) {
        const confirmed = window.confirm("Bạn có muốn xoá phòng này?")
        if(confirmed){
            try {
                const result = await api.patch(`/rooms/${roomId}/delete-room/`, {
                    // headers: getHeader()
                })
                return result.data
            } catch (error) {
                throw new Error(`Error deleting room type ${error.message}`)
            }
        }
    }

    export async function getAllRooms() {
        try {
            const result = await api.get("/rooms/")
            return result.data
        } catch (error) {
            throw new Error("Error fetching rooms")
        }
    }

    export async function addRoomType(nameRoomType, price, quantity, imageUrl) {
        const data = {
            nameRoomType,
            price,
            quantity,
            image: imageUrl
        };
       
        try {
            const response = await api.post("/roomtypes/", data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            if (response.status === 201) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error("Error in API call: ", error.response ? error.response.data : error.message);
            return false;
        }
    }

    export async function deleteRoomType(roomTypeId) {
        const confirmed = window.confirm("Bạn có muốn xoá loại phòng này?")
        if(confirmed){
            try {
                const result = await api.patch(`/roomtypes/${roomTypeId}/delete-roomTypes/`, {
                    // headers: getHeader()
                })
                return result.data
            } catch (error) {
                throw new Error(`Error deleting room type ${error.message}`)
            }
        }
    }

    export async function getRoomTypeById(roomTypeId) {
        try {
            const result = await api.get(`/roomtypes/${roomTypeId}/`)
            return result.data
        } catch (error) {
            throw new Error(`Error fetching room ${error.message}`)
        }
    }
    
    export async function updateRoomType(roomTypeId, roomTypeData) {
        // Nếu có ảnh mới, tải lên Cloudinary và lấy URL
        let imageUrl = roomTypeData.image;
        if (roomTypeData.image && typeof roomTypeData.image === 'object') {
            const fullImageUrl = await uploadToCloudinary(roomTypeData.image);
            imageUrl = fullImageUrl; // Chỉ lấy phần cần thiết của URL
        }
    
        const formData = new FormData();
        formData.append("nameRoomType", roomTypeData.nameRoomType);
        formData.append("price", roomTypeData.price);
        formData.append("quantity", roomTypeData.quantity);
        formData.append("image", imageUrl);
    
        try {
            console.log(...formData.entries());
            const response = await axios.patch(`http://127.0.0.1:8000/roomtypes/${roomTypeId}/`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating room type:', error);
            throw error;
        }
    }



