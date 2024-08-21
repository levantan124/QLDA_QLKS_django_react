import React, { useEffect, useState } from "react";
import { deleteRoomType, getRoomTypes } from "../../configs/APIs";
import { Col, Row } from "react-bootstrap";
import RoomFilter from "../common/RoomFilter";
import RoomPaginator from "../common/RoomPaginator";
import { FaEdit, FaEye, FaPlus, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const ExistingRoomTypes = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomTypesPerPage] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState([
    // { id: "", roomType: "", status: ""},
  ]);
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    setIsLoading(true);
    try {
      const result = await getRoomTypes();
      setRoomTypes(result);
      setIsLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRoomType === "") {
      setFilteredRooms(roomTypes);
    } else {
      const filteredRooms = rooms.filter(
        (roomTypes) => roomTypes.nameRoomType === selectedRoomType
      );
      setFilteredRooms(filteredRooms);
    }
    setCurrentPage(1);
  }, [roomTypes, selectedRoomType]);

  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (roomTypeId) => {
    try {
      const result = await deleteRoomType(roomTypeId);
      console.log(result.status)
      if (result === "") {
        setSuccessMessage(`RoomType No ${roomTypeId} was delete`);
        fetchRoomTypes();
      } else {
        console.error(`Error deleting room : ${result.message}`);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 3000);
  };

  const calculateTotalPages = (filteredRoomTypes, roomTypesPerPage, roomTypes) => {
    const totalRoomTypes =
      filteredRoomTypes.length > 0 ? filteredRoomTypes.length : roomTypes.length;
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
        <p>Loading existing roomTypes</p>
      ) : (
        <>
          <section className="mt-5 mb-5 container">
            <div className="d-flex justify-content-between mb-3 mt-5">
              <h2>Existing RoomTypes</h2>
            </div>

            <Row>
              {/* <Col md={6} className="mb-2 md-mb-0">
                <RoomFilter data={rooms} setFilteredData={setFilteredRooms} />
              </Col> */}

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
                  <FaPlus style={{ marginRight: "0.5rem" }} /> Add RoomType
                </Link>
              </Col>
            </Row>

            <table className="table table-bordered table-hover">
              <thead>
                <tr className="text-center">
                  <th>ID</th>
                  <th>Name RoomType</th>
                  <th> Price</th>
                  <th> Quantity</th>
                  <th>Image</th>
                </tr>
              </thead>

              <tbody>
                {currentRoomTypes.map((roomType) => (
                  <tr key={roomType.id} className="text-center">
                    <td>{roomType.id}</td>
                    <td>{roomType.nameRoomType}</td>
                    <td>{roomType.price}</td>
                    <td>{roomType.quantity}</td>
                    <td>{roomType.image}</td>
                    <td className="gap-2">
                      <Link to={`/edit-roomtype/${roomType.id}`} className="gap-2">
                        <span className="btn btn-info btn-sm">
                          <FaEye />
                        </span>
                        <span className="btn btn-warning btn-sm ml-5">
                          <FaEdit />
                        </span>
                      </Link >
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
            {/* <RoomPaginator
              currentPage={currentPage}
              totalPages={calculateTotalPages(
                filteredRoomTypes,
                roomTypesPerPage,
                roomTypes
              )}
              onPageChange={handlePaginationClick}
            /> */}
          </section>
        </>
      )}
    </>
  );
};

export default ExistingRoomTypes;
