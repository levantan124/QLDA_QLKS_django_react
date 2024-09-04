import axios from "axios"
import cookie from "react-cookies"

const BASE_URL = "http://192.168.1.113:8000"
export const api = axios.create({
	baseURL: "http://192.168.1.113:8000"
})

export const getHeader = () => {
	const token = localStorage.getItem("token")
	return {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json"
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
}

export async function getEmployeeById(EmployeeId) {
	try {
		const result = await api.get(`/accounts/${EmployeeId}/`)
		return result.data
	} catch (error) {
		throw new Error(`Error fetching room ${error.message}`)
	}
}

export const addEmployee = async (username, name, email, role, password, isActive, avatarUrl) => {
	const data = {
		username, 
		name, 
		email, 
		role,
		password, 
		isActive, 
		avatar: avatarUrl
    };
	
	try {
	//   const formData = new FormData();
	//   formData.append("username", username);
	//   formData.append("name", name);
	//   formData.append("email", email);
	//   formData.append("role", role);
	//   formData.append("password", password);
	//   if (avatarUrl) {
	// 	formData.append("avatar", avatarUrl);
	//   }
  
	  const response = await authAPI().post('/accounts/', data);
  
	  return response.data;
	} catch (error) {
	  console.error("Error adding employee:", error);
  
	  // Detailed error logging
	  if (error.response) {
		console.error('Server responded with:', error.response.data);
		console.error('Status code:', error.response.status);
		console.error('Headers:', error.response.headers);
	  } else if (error.request) {
		console.error('Request made but no response received:', error.request);
	  } else {
		console.error('Error message:', error.message);
	  }
  
	  throw error; // Rethrow to handle it further up if necessary
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
}

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
        const response = await axios.patch(`/roomtypes/${roomTypeId}/`, formData, {
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


/* This function gets all room types from thee database */
export async function getRoomTypes() {
	try {
		const response = await api.get("/roomtypes/")
		// console.log(response.data)
		return response.data
	} catch (error) {
		throw new Error(error)
	}
}

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

export async function addRoomType(nameRoomType, price, quantity, imageUrl) {
	const data = {
        nameRoomType,
        price,
        quantity,
        image: imageUrl
    };
   
	try {
		const response = await axios.post("/roomtypes/", data, {
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
        const response = await axios.patch(`/roomtypes/${roomTypeId}/`, formData, {
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

/* This function deletes a roomtype by the Id */
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

/* This function gets all rooms from the database */
export async function getAllRooms() {
	try {
		const result = await api.get("/rooms/")
		return result.data
	} catch (error) {
		throw new Error("Error fetching rooms")
	}
}

/* This function deletes a room by the Id */
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

/* This function update a room */
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


/* This function gets a room by Id*/
export async function getRoomById(roomId) {
	try {
		const result = await api.get(`/rooms/${roomId}/`)
		return result.data
	} catch (error) {
		throw new Error(`Error fetching room ${error.message}`)
	}
}

/* This function saves a new booking to the database */
export async function bookRoom(roomId, booking) {
	try {
		const response = await api.post(`/bookings/room/${roomId}/booking`, booking)
		return response.data
	} catch (error) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`Error booking room : ${error.message}`)
		}
	}
}

/* This function gets alll bokings from the database */
export async function getAllBookings() {
	try {
		const result = await api.get("/reservations/", {
			// headers: getHeader()
		})
		return result.data
	} catch (error) {
		throw new Error(`Error fetching bookings : ${error.message}`)
	}
}

/* This function get booking by the cnfirmation code */
export async function getBookingById(id) {
	try {
		const result = await api.get(`/reservations/${id}/`)
		return result.data
	} catch (error) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`Error find booking : ${error.message}`)
		}
	}
}


/* This function get booking by the cnfirmation code */
export async function getBookingByConfirmationCode(confirmationCode) {
	try {
		const result = await api.get(`/bookings/confirmation/${confirmationCode}`)
		return result.data
	} catch (error) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`Error find booking : ${error.message}`)
		}
	}
}

/* This is the function to cancel user booking */
export async function cancelBooking(bookingId) {
	const confirmed = window.confirm("Bạn có muốn xoá phiếu đặt phòng này?")
	if (!confirmed) {
        // Nếu người dùng không xác nhận, không thực hiện việc hủy đặt phòng
        return;
    }
	try {
		const result = await api.patch(`/reservations/${bookingId}/cancel-reservation/`)
		return result.data
	} catch (error) {
		throw new Error(`Error cancelling booking :${error.message}`)
	}
}

/* This function gets all availavle rooms from the database with a given date and a room type */
export async function getAvailableRooms(checkInDate, checkOutDate, roomType) {
	const result = await api.get(
		`rooms/available-rooms?checkInDate=${checkInDate}
		&checkOutDate=${checkOutDate}&roomType=${roomType}`
	)
	return result
}

/* This function register a new user */
export async function registerUser(registration) {
	try {
		const response = await api.post("/auth/register-user", registration)
		return response.data
	} catch (error) {
		if (error.reeponse && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`User registration error : ${error.message}`)
		}
	}
}

// export const authAPI = () => {
// 	const token = cookie.load('token');
// 	return axios.create({
// 		baseURL: "http://127.0.0.1:8000",
// 		headers: {
// 			'Authorization': `Bearer ${token}`
// 		}
// 	});
// }
// Hàm tạo instance axios với Authorization header
export const authAPI = () => {
    const token = cookie.load('token');
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": `Application/json`
        }
    });
};
/* This function login a registered user */
export async function loginUser(username, password) {
	try {
		// const response = await api.post("/auth/login", login)
		const response = await api.post("/o/token/", {
			'username':username,
			'password':password, 
			'client_id':"E1WxCUm9YFWU6Y7QPQ2RAYtua7zfmn2uH8NOYfUy", 
			'client_secret': "zJAi6vKX52hvUrldWC14n9JkXUQ3EssgHnLMQNCDoQbAg8B3PsWJPM39ph58bHG5Jq2JYCCEUEvEL7zVWuJB0gIkCDc999OBtykWEc7UsVs6SVIpaoM5bBAD9g4i77T8",
			'grant_type': "password",
		},{
			headers: {
				'Content-type': 'muiltipart/formdata'
			}
		});
		if (response.status >= 200 && response.status < 300) {
			return response.data
		} else {
			return null
		}
	} catch (error) {
		console.error(error)
		return null
	}
}

/*  This is function to get the user profile */
export async function getUserProfile(userId, token) {
	try {
		const response = await api.get(`users/profile/${userId}`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		throw error
	}
}

/* This isthe function to delete a user */
export async function deleteUser(userId) {
	try {
		const response = await api.delete(`/users/delete/${userId}`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		return error.message
	}
}

/* This is the function to get a single user */
export async function getUser(userId, token) {
	try {
		const response = await api.get(`/users/${userId}`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		throw error
	}
}

/* This is the function to get user bookings by the user id */
export async function getBookingsByUserId(userId, token) {
	try {
		const response = await api.get(`/bookings/user/${userId}/bookings`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		console.error("Error fetching bookings:", error.message)
		throw new Error("Failed to fetch bookings")
	}
}