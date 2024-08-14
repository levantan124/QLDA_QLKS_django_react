import React, { useState } from "react";

const RoomTypeSelector = ({ handleRoomInputChange, newRoom }) => {
  const [roomTypes, setRoomTypes] = useState([
    { id: 1, nameRoomType: "Single Room" },
    { id: 2, nameRoomType: "Double Room" },
    { id: 3, nameRoomType: "Suite" }
  ]);
  const [showNewRoomTypeInput, setShowNewRoomTypeInput] = useState(false);
  const [newRoomType, setNewRoomType] = useState("");

  const handleNewRoomTypeInputChange = (e) => {
    setNewRoomType(e.target.value);
  };

  const handleAddNewRoomType = () => {
    if (newRoomType !== "") {
      const newType = { id: roomTypes.length + 1, nameRoomType: newRoomType };
      setRoomTypes([...roomTypes, newType]);
      setNewRoomType("");
      setShowNewRoomTypeInput(false);
    }
  };

  return (
    <>
      {roomTypes.length > 0 && (
        <div>
          <select
            required
            className="form-select"
            name="roomType"
            onChange={(e) => {
              if (e.target.value === "Add New") {
                setShowNewRoomTypeInput(true);
              } else {
                handleRoomInputChange(e);
              }
            }}
            value={newRoom.roomType}
          >
            <option value="">Select a room type</option>
            {roomTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.nameRoomType}
              </option>
            ))}
            <option value={"Add New"}>Add New</option>
          </select>
          {showNewRoomTypeInput && (
            <div className="mt-2">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter New Room Type"
                  value={newRoomType}
                  onChange={handleNewRoomTypeInputChange}
                />
                <button className="btn btn-hotel" type="button" onClick={handleAddNewRoomType}>
                  Add
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default RoomTypeSelector;
