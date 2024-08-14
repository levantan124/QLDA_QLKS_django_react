import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { FaEdit, FaEye, FaPlus, FaTrashAlt } from "react-icons/fa";

const mockRoomTypes = [
  { id: "1", nameRoomType: "Standard Room", price: "100", quantity: "10", image: "https://via.placeholder.com/100" },
  { id: "2", nameRoomType: "Deluxe Room", price: "150", quantity: "8", image: "https://via.placeholder.com/100" },
];

const mockDeleteRoomType = (roomTypeId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Deleted Room Type:", roomTypeId);
      resolve({ status: 0 }); 
    }, 1000);
  });
};

const ExistingRoomTypes = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomTypesPerPage] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setRoomTypes(mockRoomTypes);
      setFilteredRooms(mockRoomTypes);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (selectedRoomType === "") {
      setFilteredRooms(roomTypes);
    } else {
      const filtered = roomTypes.filter(
        (roomType) => roomType.nameRoomType === selectedRoomType
      );
      setFilteredRooms(filtered);
    }
    setCurrentPage(1);
  }, [roomTypes, selectedRoomType]);

  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (roomTypeId) => {
    try {
      const result = await mockDeleteRoomType(roomTypeId);
      if (result.status === 0) {
        setSuccessMessage(`Room Type No ${roomTypeId} was deleted`);
        setRoomTypes(roomTypes.filter(roomType => roomType.id !== roomTypeId));
        setFilteredRooms(filteredRooms.filter(roomType => roomType.id !== roomTypeId));
      } else {
        setErrorMessage("Error deleting room type");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 3000);
  };

  const calculateTotalPages = () => {
    const totalRoomTypes = filteredRooms.length;
    return Math.ceil(totalRoomTypes / roomTypesPerPage);
  };

  const indexOfLastRoomType = currentPage * roomTypesPerPage;
  const indexOfFirstRoomType = indexOfLastRoomType - roomTypesPerPage;
  const currentRoomTypes = filteredRooms.slice(indexOfFirstRoomType, indexOfLastRoomType);

  return (
    <>
      <div className="container col-md-8 col-lg-6">
        {successMessage && (
          <p className="alert alert-success mt-5">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="alert alert-danger mt-5">{errorMessage}</p>
        )}
      </div>

      {isLoading ? (
        <p>Loading existing room types...</p>
      ) : (
        <>
          <section className="mt-5 mb-5 container">
            <div className="d-flex justify-content-between mb-3 mt-5">
              <h2>Existing Room Types</h2>
              <Col
                md={6}
                className="d-flex justify-content-md-end justify-content-center mb-3"
              >
                <Link
                  to={"/add-roomtype"}
                  className="btn btn-primary"
                  style={{
                    backgroundColor: "#007bff",
                    borderColor: "#007bff",
                    color: "#fff",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.25rem",
                  }}
                >
                  <FaPlus style={{ marginRight: "0.5rem" }} /> Add Room Type
                </Link>
              </Col>
            </div>

            <table className="table table-bordered table-hover">
              <thead>
                <tr className="text-center">
                  <th>ID</th>
                  <th>Name Room Type</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentRoomTypes.map((roomType) => (
                  <tr key={roomType.id} className="text-center">
                    <td>{roomType.id}</td>
                    <td>{roomType.nameRoomType}</td>
                    <td>{roomType.price}</td>
                    <td>{roomType.quantity}</td>
                    <td>
                      <img
                        src={roomType.image}
                        alt={roomType.nameRoomType}
                        style={{ maxWidth: "100px", maxHeight: "100px" }}
                      />
                    </td>
                    <td className="gap-2">
                      <Link to={`/edit-roomtype/${roomType.id}`} className="gap-2">
                        <span className="btn btn-info btn-sm">
                          <FaEye />
                        </span>
                        <span className="btn btn-warning btn-sm ml-5">
                          <FaEdit />
                        </span>
                      </Link>
                      <button
                        className="btn btn-danger btn-sm ml-5"
                        onClick={() => handleDelete(roomType.id)}
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <nav aria-label="Page navigation">
              <ul className="pagination justify-content-center">
                {[...Array(calculateTotalPages()).keys()].map((pageNumber) => (
                  <li
                    key={pageNumber + 1}
                    className={`page-item ${currentPage === pageNumber + 1 ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePaginationClick(pageNumber + 1)}
                    >
                      {pageNumber + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </section>
        </>
      )}
    </>
  );
};

export default ExistingRoomTypes;
