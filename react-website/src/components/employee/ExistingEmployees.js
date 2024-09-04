import React, { useEffect, useState } from "react";
import { deleteEmployee, getAllEmployees } from "../utils/ApiFunctions"; //
import { Col, Row } from "react-bootstrap";
import EmployeeFilter from "../employee/EmployeeFilter";
// import EmployeePaginator from "../common/EmployeePaginator";
import { FaEdit, FaEye, FaPlus, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const ExistingEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const result = await getAllEmployees();
      const filteredResult = result.filter(
        (employee) => employee.role === 1 || employee.role === 2
      );
      setEmployees(filteredResult);
      setFilteredEmployees(filteredResult);
      setIsLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRole === "") {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(
        (employee) => employee.role === parseInt(selectedRole)
      );
      setFilteredEmployees(filtered);
    }
    setCurrentPage(1);
  }, [employees, selectedRole]);

  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (employeeId) => {
    try {
      const result = await deleteEmployee(employeeId);
      if (result === "") {
        setSuccessMessage(`Employee No ${employeeId} was deleted`);
        fetchEmployees();
      } else {
        console.error(`Error deleting employee: ${result.message}`);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 3000);
  };

  const calculateTotalPages = (filteredEmployees, employeesPerPage) => {
    const totalEmployees = filteredEmployees.length > 0 ? filteredEmployees.length : employees.length;
    return Math.ceil(totalEmployees / employeesPerPage);
  };

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

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
        <p>Loading existing employees</p>
      ) : (
        <>
          <section className="mt-5 mb-5 container">
            <div className="d-flex justify-content-between mb-3 mt-5">
              <h2>Existing Employees</h2>
            </div>

            <Row>
              <Col md={6} className="mb-2 md-mb-0">
                <EmployeeFilter data={employees} setFilteredData={setFilteredEmployees} />
              </Col>

              <Col
                md={6}
                className="d-flex justify-content-md-end justify-content-center mb-3"
              >
                <Link
                  to={"/add-employee"}
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
                  <FaPlus style={{ marginRight: "0.5rem" }} /> Add Employee
                </Link>
              </Col>
            </Row>

            <table className="table table-bordered table-hover">
              <thead>
                <tr className="text-center">
                  <th>ID</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentEmployees.map((employee) => (
                  <tr key={employee.id} className="text-center">
                    <td>{employee.id}</td>
                    <td>{employee.name}</td>
                    <td>{employee.role === 1 ? "Admin" : "Lễ tân"}</td>
                    <td className="gap-2">
                      <Link to={`/edit-employee/${employee.id}`} className="gap-2">
                        <span className="btn btn-info btn-sm">
                          <FaEye />
                        </span>
                        <span className="btn btn-warning btn-sm ml-5">
                          <FaEdit />
                        </span>
                      </Link>
                      <button
                        className="btn btn-danger btn-sm ml-5"
                        onClick={() => handleDelete(employee.id)}
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* <EmployeePaginator
              currentPage={currentPage}
              totalPages={calculateTotalPages(filteredEmployees, employeesPerPage)}
              onPageChange={handlePaginationClick}
            /> */}
          </section>
        </>
      )}
    </>
  );
};

export default ExistingEmployees;
