import React, { useEffect, useState } from "react"
import { getRoomById, updateRoom } from "../utils/ApiFunctions"
import { Link, useParams } from "react-router-dom"
import RoomTypeSelector from "../common/RoomTypeSelector"

const EditRoom = () => {
    const [room, setRoom] = useState({
		nameRoom: "",
		roomType: "",
		status: ""
	})

	const [imagePreview, setImagePreview] = useState("")
	const [successMessage, setSuccessMessage] = useState("")
	const [errorMessage, setErrorMessage] = useState("")
	const { roomId } = useParams()

    const handleImageChange = (e) => {
		const selectedImage = e.target.files[0]
		setRoom({ ...room, photo: selectedImage })
		setImagePreview(URL.createObjectURL(selectedImage))
	}

    const handleInputChange = (event) => {
		const { name, value } = event.target
		setRoom({ ...room, [name]: value })
	}

    useEffect(() => {
		const fetchRoom = async () => {
			try {
				const roomData = await getRoomById(roomId)
				setRoom(roomData)
				setImagePreview(roomData.photo)
				return(roomData.data)
			} catch (error) {
				console.error(error)
			}
		}

		fetchRoom()
	}, [roomId])


    const handleSubmit = async (e) => {
		e.preventDefault()

		try {
			const response = await updateRoom(roomId, room)
			if (response.status === 0) {
				setSuccessMessage("Room updated successfully!")
				const updatedRoomData = await getRoomById(roomId)
				setRoom(updatedRoomData)
				// setImagePreview(updatedRoomData.photo)
				setErrorMessage("")
			} else {
				setErrorMessage("Error updating room")
			}
		} catch (error) {
			console.error(error)
			setErrorMessage(error.message)
		}
	}

    return (
		<div className="container mt-5 mb-5">
			<h3 className="text-center mb-5 mt-5">Edit Room</h3>
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
							<label htmlFor="roomType" className="form-label hotel-color">
								Name Room
							</label>
							<input
								type="text"
								className="form-control"
								id="nameRoom"
								name="nameRoom"
								value={room.nameRoom}
								onChange={handleInputChange}
							/>
						</div>
						<div className="mb-3">
							<label htmlFor="roomType" className="form-label">
								Room Type
							</label>
							<RoomTypeSelector
								handleRoomInputChange={handleInputChange}
								newRoom={room}
							/>
						</div>

						<div className="mb-3">
							<label htmlFor="status" className="form-label hotel-color">
								Status
							</label>
							<select
								className="form-select"
								id="status"
								name="status"
								value={room.status}
								onChange={handleInputChange}
							>
								<option value="">Chọn trạng thái</option>
								<option value="0">Trống</option>
								<option value="1">Có người</option>
							</select>
						</div>

						{imagePreview && (
							<img
								src={`data:image/jpeg;base64,${imagePreview}`}
								alt="Room preview"
								style={{ maxWidth: "400px", maxHeight: "400px" }}
								className="mt-3"
							/>
						)}
						<div className="d-grid gap-2 d-md-flex mt-2">
							<Link to={"/existing-rooms"} className="btn btn-outline-info ml-5">
								back
							</Link>
							<button type="submit" className="btn btn-outline-warning">
								Edit Room
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

export default EditRoom