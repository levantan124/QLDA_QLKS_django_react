import React, { useState } from "react";
import RoleSelector from "../employee/RoleSelector";
import { Link } from "react-router-dom";

const AddEmployee = () => {
  const [newEmployee, setNewEmployee] = useState({
    username: "",
    name: "",
    email: "",
    role: "", 
    avatar: null,
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const handleEmployeeInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleRoleChange = (role) => {
    setNewEmployee({ ...newEmployee, role: role }); 
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setNewEmployee({ ...newEmployee, avatar: selectedImage });
    setImagePreview(URL.createObjectURL(selectedImage));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newEmployee.username && newEmployee.name && newEmployee.email && newEmployee.role) {
      setSuccessMessage("A new employee was added successfully!");
      setErrorMessage("");
      setNewEmployee({ username: "", name: "", email: "", role: "", avatar: null });
      setImagePreview("");
    } else {
      setErrorMessage("Please fill in all required fields.");
      setSuccessMessage("");
    }

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
            <h2 className="mt-5 mb-2">Add a New Employee</h2>
            {successMessage && (
              <div className="alert alert-success fade show">{successMessage}</div>
            )}
            {errorMessage && <div className="alert alert-danger fade show">{errorMessage}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  required
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  value={newEmployee.username}
                  onChange={handleEmployeeInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  required
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={newEmployee.name}
                  onChange={handleEmployeeInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  required
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={newEmployee.email}
                  onChange={handleEmployeeInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="role" className="form-label">
                  Role
                </label>
                <RoleSelector
                  handleRoleChange={handleRoleChange}
                  selectedRole={newEmployee.role} // Truyền giá trị role hiện tại
                />
              </div>
              <div className="mb-3">
                <label htmlFor="avatar" className="form-label">
                  Avatar
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="avatar"
                  name="avatar"
                  onChange={handleImageChange}
                />
                {imagePreview && <img src={imagePreview} alt="Avatar Preview" className="mt-3" />}
              </div>
              <div className="d-grid gap-2 d-md-flex mt-2">
                <Link to={"/existing-employees"} className="btn btn-outline-info">
                  Existing employees
                </Link>
                <button type="submit" className="btn btn-outline-primary ml-5">
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddEmployee;