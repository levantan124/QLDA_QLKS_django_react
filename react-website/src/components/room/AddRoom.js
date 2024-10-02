import React, { useState, useEffect } from "react"
import { addRoom, getRoomTypes } from "../utils/ApiFunctions"
import RoomTypeSelector from "../common/RoomTypeSelector"
import { Link } from "react-router-dom"
import axios from 'axios';


const AddRoom = () => {
	const [newRoom, setNewRoom] = useState({
		nameRoom: "",
		roomType: "",
		status: 0,
		active: true
	})

	const [successMessage, setSuccessMessage] = useState("")
	const [errorMessage, setErrorMessage] = useState("")
	const [imagePreview, setImagePreview] = useState("")
  const [roomTypes, setRoomTypes] = useState([]);


	const handleRoomInputChange = (e) => {
		const { name, value } = e.target
		setNewRoom({ ...newRoom, [name]: value })
	}

	const handleImageChange = (e) => {
		const selectedImage = e.target.files[0]
		setNewRoom({ ...newRoom, photo: selectedImage })
		setImagePreview(URL.createObjectURL(selectedImage))
	}

  useEffect(() => {
    // Fetch room types from the API
    const fetchRoomTypes = async () => {
      try {
        const response = await getRoomTypes()
        setRoomTypes(response.data);
      } catch (error) {
        console.error("Error fetching room types:", error);
        setErrorMessage("Error fetching room types.");
      }
    };

    fetchRoomTypes();
  }, []);

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const success = await addRoom(newRoom.nameRoom, newRoom.roomType, newRoom.status, newRoom.active)
			console.log('API response:', success)
			if (success) {
				setSuccessMessage("A new room was added successfully!")
				setNewRoom({ nameRoom: "", roomType: "", status: 0, active: true })
				setImagePreview("")
				setErrorMessage("")
			} else {
				setErrorMessage("Error adding new room")
			}
		} catch (error) {
			setErrorMessage(error.message)
		}
		setTimeout(() => {
			setSuccessMessage("")
			setErrorMessage("")
		}, 3000)
	}


	return (
		<>
		  <section className="container mt-5 mb-5">
			<div className="row justify-content-center">
			  <div className="col-md-8 col-lg-6">
				<h2 className="mt-5 mb-2">Add a New Room</h2>
				{successMessage && (
				  <div className="alert alert-success fade show">{successMessage}</div>
				)}
	
				{errorMessage && <div className="alert alert-danger fade show">{errorMessage}</div>}
	
				<form onSubmit={handleSubmit}>
				  <div className="mb-3">
					<label htmlFor="nameRoom" className="form-label">
					  Room Name
					</label>
					<input
					  required
					  type="text"
					  className="form-control"
					  id="nameRoom"
					  name="nameRoom"
					  value={newRoom.nameRoom}
					  onChange={handleRoomInputChange}
					/>
				  </div>
				  <div className="mb-3">
					<label htmlFor="roomType" className="form-label">
					  Room Type
					</label>
					<RoomTypeSelector
					  handleRoomInputChange={handleRoomInputChange}
					  newRoom={newRoom}
					/>
				  </div>
	
				  <div className="d-grid gap-2 d-md-flex mt-2">
					<Link to={"/admin/existing-rooms"} className="btn btn-outline-info">
					  Existing rooms
					</Link>
					<button type="submit" className="btn btn-outline-primary ml-5">
					  Save Room
					</button>
				  </div>
				</form>
			  </div>
			</div>
		  </section>
		</>
	  );
	};
	
	export default AddRoom;



// import React, { useState, useEffect } from "react";
// import axios from 'axios';

// import { Link } from "react-router-dom";

// const AddRoom = () => {
//   const [newRoom, setNewRoom] = useState({
//     nameRoom: "",
//     roomType: "", // Store ID of the selected RoomType
//     status: 0,
//     active: true
//   });

//   const [successMessage, setSuccessMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [imagePreview, setImagePreview] = useState("");
//   const [roomTypes, setRoomTypes] = useState([]);
//   const [showNewRoomTypeInput, setShowNewRoomTypeInput] = useState(false);
//   const [newRoomType, setNewRoomType] = useState("");

//   useEffect(() => {
//     // Fetch room types from the API
//     const fetchRoomTypes = async () => {
//       try {
// 		const response = await axios.get("http://127.0.0.1:8000/roomtypes/")
// 		    setRoomTypes(response.data);
//       } catch (error) {
//         console.error("Error fetching room types:", error);
//         setErrorMessage("Error fetching room types.");
//       }
//     };

//     fetchRoomTypes();
//   }, []);

//   const handleRoomInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewRoom({ ...newRoom, [name]: value });
//   };

//   const handleImageChange = (e) => {
//     const selectedImage = e.target.files[0];
//     setNewRoom({ ...newRoom, photo: selectedImage });
//     setImagePreview(URL.createObjectURL(selectedImage));
//   };

//   const handleNewRoomTypeInputChange = (e) => {
//     setNewRoomType(e.target.value);
//   };

//   const handleAddNewRoomType = async () => {
//     if (newRoomType !== "") {
//       try {
//         // Assuming API endpoint to add new room type
//         const response = await axios.post('http://127.0.0.1:8000/room-types/', { nameRoomType: newRoomType });
//         setRoomTypes([...roomTypes, response.data]);
//         setNewRoomType("");
//         setShowNewRoomTypeInput(false);
//       } catch (error) {
//         console.error("Error adding new room type:", error);
//         setErrorMessage("Error adding new room type.");
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://127.0.0.1:8000/rooms/', {
//         nameRoom: newRoom.nameRoom,
//         roomType: newRoom.roomType, // ID of the selected RoomType
//         status: newRoom.status,
//         active: newRoom.active
//       });

//       if (response.data) {
//         setSuccessMessage("A new room was added successfully!");
//         setNewRoom({ nameRoom: "", roomType: "", status: 0, active: true });
//         setImagePreview("");
//         setErrorMessage("");
//       } else {
//         setErrorMessage("Error adding new room");
//       }
//     } catch (error) {
//       setErrorMessage(error.message);
//     }
//     setTimeout(() => {
//       setSuccessMessage("");
//       setErrorMessage("");
//     }, 3000);
//   };

//   return (
//     <>
//       <section className="container mt-5 mb-5">
//         <div className="row justify-content-center">
//           <div className="col-md-8 col-lg-6">
//             <h2 className="mt-5 mb-2">Add a New Room</h2>
//             {successMessage && (
//               <div className="alert alert-success fade show">{successMessage}</div>
//             )}

//             {errorMessage && <div className="alert alert-danger fade show">{errorMessage}</div>}

//             <form onSubmit={handleSubmit}>
//               <div className="mb-3">
//                 <label htmlFor="nameRoom" className="form-label">
//                   Room Name
//                 </label>
//                 <input
//                   required
//                   type="text"
//                   className="form-control"
//                   id="nameRoom"
//                   name="nameRoom"
//                   value={newRoom.nameRoom}
//                   onChange={handleRoomInputChange}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label htmlFor="roomType" className="form-label">
//                   Room Type
//                 </label>
//                 {roomTypes.length > 0 && (
//                   <div>
//                     <select
//                       required
//                       className="form-select"
//                       name="roomType"
//                       onChange={(e) => {
//                         if (e.target.value === "Add New") {
//                           setShowNewRoomTypeInput(true);
//                         } else {
//                           handleRoomInputChange(e);
//                         }
//                       }}
//                       value={newRoom.roomType}
//                     >
//                       <option value="">Select a room type</option>
//                       {roomTypes.map((type) => (
//                         <option key={type.id} value={type.id}>
//                           {type.nameRoomType}
//                         </option>
//                       ))}
//                       <option value="Add New">Add New</option>
//                     </select>
//                     {showNewRoomTypeInput && (
//                       <div className="mt-2">
//                         <div className="input-group">
//                           <input
//                             type="text"
//                             className="form-control"
//                             placeholder="Enter New Room Type"
//                             value={newRoomType}
//                             onChange={handleNewRoomTypeInputChange}
//                           />
//                           <button className="btn btn-hotel" type="button" onClick={handleAddNewRoomType}>
//                             Add
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>

//               <div className="d-grid gap-2 d-md-flex mt-2">
//                 <Link to={"/existing-rooms"} className="btn btn-outline-info">
//                   Existing rooms
//                 </Link>
//                 <button type="submit" className="btn btn-outline-primary ml-5">
//                   Save Room
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default AddRoom;
