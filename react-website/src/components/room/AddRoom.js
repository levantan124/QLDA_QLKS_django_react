import React, { useState } from "react";
import { Link } from "react-router-dom";

const AddRoom = () => {
  const [newRoom, setNewRoom] = useState({
    nameRoom: "",
    roomType: "",
    status: 0,
    active: true,
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [roomTypes, setRoomTypes] = useState([
    { id: "1", nameRoomType: "Single" },
    { id: "2", nameRoomType: "Double" },
    { id: "3", nameRoomType: "Suite" },
  ]);

  const handleRoomInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoom({ ...newRoom, [name]: value });
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setNewRoom({ ...newRoom, photo: selectedImage });
    setImagePreview(URL.createObjectURL(selectedImage));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate a successful form submission
    setSuccessMessage("A new room was added successfully!");
    setNewRoom({ nameRoom: "", roomType: "", status: 0, active: true });
    setImagePreview("");
    setErrorMessage("");
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 3000);
  };

  return (
    <>
      <section className="container mt-5 mb-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <h2 className="mt-5 mb-2">Add a New Room</h2>
            {successMessage && (
              <div className="alert alert-success fade show">{successMessage}</div>
            )}

            {errorMessage && (
              <div className="alert alert-danger fade show">{errorMessage}</div>
            )}

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
                <select
                  required
                  className="form-select"
                  id="roomType"
                  name="roomType"
                  value={newRoom.roomType}
                  onChange={handleRoomInputChange}
                >
                  <option value="">Select a room type</option>
                  {roomTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.nameRoomType}
                    </option>
                  ))}
                </select>
              </div>

              <div className="d-grid gap-2 d-md-flex mt-2">
                <Link to={"/existing-rooms"} className="btn btn-outline-info">
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
