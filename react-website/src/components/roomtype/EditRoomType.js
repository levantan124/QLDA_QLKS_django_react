import React, { useEffect, useState } from "react"
import { getRoomTypeById, updateRoomType } from "../utils/ApiFunctions"
import { Link, useParams } from "react-router-dom"
// import RoomTypeSelector from "../common/RoomTypeSelector"

const EditRoom = () => {
    const [roomType, setRoomType] = useState({
		nameRoomType: "",
		price: "",
		quantity: "",
		image: ""
	})

	const [imagePreview, setImagePreview] = useState("")
	const [successMessage, setSuccessMessage] = useState("")
	const [errorMessage, setErrorMessage] = useState("")
	const { roomTypeId } = useParams()

    const handleImageChange = (e) => {
		const selectedImage = e.target.files[0]
		setRoomType({ ...roomType, image: selectedImage })
		setImagePreview(URL.createObjectURL(selectedImage))
	}

    const handleInputChange = (event) => {
		const { name, value } = event.target
		setRoomType({ ...roomType, [name]: value })
	}

    useEffect(() => {
		const fetchRoomType = async () => {
			try {
				const roomTypeData = await getRoomTypeById(roomTypeId)
				setRoomType(roomTypeData)
				setImagePreview(roomTypeData.photo)
				return(roomTypeData.data)
			} catch (error) {
				console.error(error)
			}
		}

		fetchRoomType()
	}, [roomTypeId])


    const handleSubmit = async (e) => {
		e.preventDefault()

		try {
			const response = await updateRoomType(roomTypeId, roomType)
            console.log('Updated Room Type:', response);
			if (response.status === 200) {
				setSuccessMessage("Room updated successfully!")
				const updatedRoomTypeData = await getRoomTypeById(roomTypeId)
				setRoomType(updatedRoomTypeData)
				setImagePreview(updatedRoomTypeData.image)
				setErrorMessage("")
			} else {
				setErrorMessage("Error updating roomType fe")
			}
		} catch (error) {
			console.error(error)
			setErrorMessage(error.message)
		}
	}

    // return (
	// 	<div className="container mt-5 mb-5">
	// 		<h3 className="text-center mb-5 mt-5">Edit Room</h3>
	// 		<div className="row justify-content-center">
	// 			<div className="col-md-8 col-lg-6">
	// 				{successMessage && (
	// 					<div className="alert alert-success" role="alert">
	// 						{successMessage}
	// 					</div>
	// 				)}
	// 				{errorMessage && (
	// 					<div className="alert alert-danger" role="alert">
	// 						{errorMessage}
	// 					</div>
	// 				)}
	// 				<form onSubmit={handleSubmit}>
	// 					<div className="mb-3">
	// 						<label htmlFor="roomType" className="form-label hotel-color">
	// 							Name Room 
	// 						</label>
	// 						<input
	// 							type="text"
	// 							className="form-control"
	// 							id="nameRoom"
	// 							name="nameRoom"
	// 							value={roomType.nameRoomType}
	// 							onChange={handleInputChange}
	// 						/>
	// 					</div>
	// 					<div className="mb-3">
	// 						<label htmlFor="roomType" className="form-label">
	// 							Room Type
	// 						</label>
	// 						<RoomTypeSelector
	// 							handleRoomInputChange={handleInputChange}
	// 							newRoom={room}
	// 						/>
	// 					</div>

	// 					<div className="mb-3">
	// 						<label htmlFor="status" className="form-label hotel-color">
	// 							Status
	// 						</label>
	// 						<select
	// 							className="form-select"
	// 							id="status"
	// 							name="status"
	// 							value={room.status}
	// 							onChange={handleInputChange}
	// 						>
	// 							<option value="">Chọn trạng thái</option>
	// 							<option value="0">Trống</option>
	// 							<option value="1">Có người</option>
	// 						</select>
	// 					</div>

	// 					{imagePreview && (
	// 						<img
	// 							src={`data:image/jpeg;base64,${imagePreview}`}
	// 							alt="Room preview"
	// 							style={{ maxWidth: "400px", maxHeight: "400px" }}
	// 							className="mt-3"
	// 						/>
	// 					)}
	// 					<div className="d-grid gap-2 d-md-flex mt-2">
	// 						<Link to={"/existing-rooms"} className="btn btn-outline-info ml-5">
	// 							back
	// 						</Link>
	// 						<button type="submit" className="btn btn-outline-warning">
	// 							Edit Room
	// 						</button>
	// 					</div>
	// 				</form>
	// 			</div>
	// 		</div>
	// 	</div>
	// )
    return (
		<div className="container mt-5 mb-5">
			<h3 className="text-center mb-5 mt-5">Edit Room Type</h3>
			<div className="row justify-content-center">
				<div className="col-md-8 col-lg-6">
					{successMessage && (
						<div className="alert alert-success" role="alert">
							{successMessage}
						</div>
					)}
					{errorMessage && (
						<div className="alert alert-danger" role="alert">
							{errorMessage}
						</div>
					)}
					<form onSubmit={handleSubmit}>
						<div className="mb-3">
							<label htmlFor="nameRoomType" className="form-label hotel-color">
								Room Type Name
							</label>
							<input
								type="text"
								className="form-control"
								id="nameRoomType"
								name="nameRoomType"
								value={roomType.nameRoomType}
								onChange={handleInputChange}
							/>
						</div>
						<div className="mb-3">
							<label htmlFor="price" className="form-label">
								Price
							</label>
							<input
								type="text"
								className="form-control"
								id="price"
								name="price"
								value={roomType.price}
								onChange={handleInputChange}
							/>
						</div>
						<div className="mb-3">
							<label htmlFor="quantity" className="form-label">
								Quantity
							</label>
							<input
								type="text"
								className="form-control"
								id="quantity"
								name="quantity"
								value={roomType.quantity}
								onChange={handleInputChange}
							/>
						</div>
						<div className="mb-3">
							<label htmlFor="image" className="form-label">
								Room Type Image
							</label>
							<input
								type="file"
								className="form-control"
								id="image"
								name="image"
								onChange={handleImageChange}
							/>
						</div>
						{imagePreview && (
							<img
								src={imagePreview}
								alt="Room Type preview"
								style={{ maxWidth: "400px", maxHeight: "400px" }}
								className="mt-3"
							/>
						)}
						<div className="d-grid gap-2 d-md-flex mt-2">
							<Link to={"/admin/existing-roomtypes"} className="btn btn-outline-info ml-5">
								Back
							</Link>
							<button type="submit" className="btn btn-outline-warning">
								Edit Room Type
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default EditRoom