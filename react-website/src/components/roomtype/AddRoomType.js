import React, { useState, useEffect } from "react"
import { addRoomType, getRoomTypes, uploadToCloudinary } from "../utils/ApiFunctions"
// import RoomTypeSelector from "../common/RoomTypeSelector"
import { Link } from "react-router-dom"
import axios from 'axios';


const AddRoomType = () => {
	const [newRoomType, setNewRoomType] = useState({
		nameRoomType: "",
		price: "",
		quantity: "",
		image: ""
	})

	const [successMessage, setSuccessMessage] = useState("")
	const [errorMessage, setErrorMessage] = useState("")
	const [imagePreview, setImagePreview] = useState("")
  	// const [roomTypes, setRoomTypes] = useState([]);


	const handleRoomInputChange = (e) => {
		const { name, value } = e.target
		setNewRoomType({ ...newRoomType, [name]: value })
	}

	const handleImageChange = (e) => {
		const selectedImage = e.target.files[0]
		setNewRoomType({ ...newRoomType, image: selectedImage })
		setImagePreview(URL.createObjectURL(selectedImage))
	}

  useEffect(() => {
    // Fetch room types from the API
    const fetchRoomTypes = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/roomtypes/")
        // setRoomTypes(response.data);
      } catch (error) {
        console.error("Error fetching room types:", error);
        setErrorMessage("Error fetching room types.");
      }
    };

    fetchRoomTypes();
  }, []);

	const handleSubmit = async (e) => {
		e.preventDefault()

		console.log("Image field value:", newRoomType.image);
		try {
			const photoUrl = await uploadToCloudinary(newRoomType.image);
			const success = await addRoomType(newRoomType.nameRoomType, newRoomType.price, newRoomType.quantity, photoUrl);
			console.log('API response:', newRoomType)
			if (success) {
				setSuccessMessage("A new room was added successfully!")
				setNewRoomType({ nameRoomType: "", price: "", quantity: "", image: "" })
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
				<h2 className="mt-5 mb-2">Add a New Room Type</h2>
				{successMessage && (
				  <div className="alert alert-success fade show">{successMessage}</div>
				)}
	
				{errorMessage && <div className="alert alert-danger fade show">{errorMessage}</div>}
	
				<form onSubmit={handleSubmit}>
				  <div className="mb-3">
					<label htmlFor="nameRoomType" className="form-label">
					  Room Type Name
					</label>
					<input
					  required
					  type="text"
					  className="form-control"
					  id="nameRoomType"
					  name="nameRoomType"
					  value={newRoomType.nameRoomType}
					  onChange={handleRoomInputChange}
					/>
				  </div>
				  <div className="mb-3">
					<label htmlFor="price" className="form-label">
					  Price
					</label>
					<input
					  required
					  type="text"
					  className="form-control"
					  id="price"
					  name="price"
					  value={newRoomType.price}
					  onChange={handleRoomInputChange}
					/>
				  </div>
                  <div className="mb-3">
					<label htmlFor="quantity" className="form-label">
					  Quantity
					</label>
					<input
					  required
					  type="text"
					  className="form-control"
					  id="quantity"
					  name="quantity"
					  value={newRoomType.quantity}
					  onChange={handleRoomInputChange}
					/>
				  </div>
				  <div className="mb-3">
								<label htmlFor="image" className="form-label">
									Room Type Photo
								</label>
								<input
									required
									name="image"
									id="image"
									type="file"
									className="form-control"
									onChange={handleImageChange}
								/>
								{imagePreview && (
									<img
										src={imagePreview}
										alt="Preview  room photo"
										style={{ maxWidth: "400px", maxHeight: "400px" }}
										className="mb-3"></img>
								)}
							</div>
				  <div className="d-grid gap-2 d-md-flex mt-2">
					<Link to={"/existing-roomtypes"} className="btn btn-outline-info">
					  Existing roomtypes
					</Link>
					<button type="submit" className="btn btn-outline-primary ml-5">
					  Save RoomType
					</button>
				  </div>
				</form>
			  </div>
			</div>
		  </section>
		</>
	  );
	};
	
	export default AddRoomType;



