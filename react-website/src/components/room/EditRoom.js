import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import RoomTypeSelector from "../common/RoomTypeSelector";

const EditRoom = () => {
    const [room, setRoom] = useState({
        nameRoom: "",
        roomType: "",
        status: "",
    });

    const [imagePreview, setImagePreview] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { roomId } = useParams();

    // Dummy room types data
    const roomTypes = [
        { id: "1", nameRoomType: "Single" },
        { id: "2", nameRoomType: "Double" },
        { id: "3", nameRoomType: "Suite" },
    ];

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setRoom({ ...room, photo: selectedImage });
        setImagePreview(URL.createObjectURL(selectedImage));
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setRoom({ ...room, [name]: value });
    };

    useEffect(() => {
        // Simulate fetching room data by ID
        const fetchRoom = () => {
            // Replace with actual data fetching logic
            const fetchedRoom = {
                nameRoom: "Deluxe Room",
                roomType: "2",
                status: "0",
                photo: "dummy-image.jpg", // replace with actual image URL
            };
            setRoom(fetchedRoom);
            setImagePreview(fetchedRoom.photo);
        };

        fetchRoom();
    }, [roomId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate updating the room data
        setSuccessMessage("Room updated successfully!");
        setErrorMessage("");
        setTimeout(() => {
            setSuccessMessage("");
            setErrorMessage("");
        }, 3000);
    };

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
                            <label htmlFor="nameRoom" className="form-label">
                                Room Name
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
                                roomTypes={roomTypes} // Pass the dummy room types data
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="status" className="form-label">
                                Status
                            </label>
                            <select
                                className="form-select"
                                id="status"
                                name="status"
                                value={room.status}
                                onChange={handleInputChange}
                            >
                                <option value="">Select status</option>
                                <option value="0">Available</option>
                                <option value="1">Occupied</option>
                            </select>
                        </div>
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Room preview"
                                style={{ maxWidth: "400px", maxHeight: "400px" }}
                                className="mt-3"
                            />
                        )}
                        <div className="d-grid gap-2 d-md-flex mt-2">
                            <Link to={"/existing-rooms"} className="btn btn-outline-info ml-5">
                                Back
                            </Link>
                            <button type="submit" className="btn btn-outline-warning">
                                Edit Room
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditRoom;
