import React, { useEffect, useState } from "react";
import { getEmployeeById, updateEmployee } from "../utils/ApiFunctions"; 
import { Link, useParams } from "react-router-dom";
import RoleSelector from "../employee/RoleSelector"; // Giả sử bạn có component chọn vai trò

const EditEmployee = () => {
    const [employee, setEmployee] = useState({
        name: "",
        role: "",
        email: "",
        phone: "",
        address: "",
        DOB: "",
        sex: "",
    });

    const [imagePreview, setImagePreview] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { employeeId } = useParams();

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setEmployee({ ...employee, avatar: selectedImage });
        setImagePreview(URL.createObjectURL(selectedImage));
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEmployee({ ...employee, [name]: value });
    };

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const employeeData = await getEmployeeById(employeeId);
                setEmployee(employeeData);
                setImagePreview(employeeData.avatar);
            } catch (error) {
                console.error(error);
            }
        };

        fetchEmployee();
    }, [employeeId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await updateEmployee(employeeId, employee);
            if (response.status === 200) { // Assuming the success status is 200
                setSuccessMessage("Employee updated successfully!");
                const updatedEmployeeData = await getEmployeeById(employeeId);
                setEmployee(updatedEmployeeData);
                setImagePreview(updatedEmployeeData.avatar);
                setErrorMessage("");
            } else {
                setErrorMessage("Error updating employee");
            }
        } catch (error) {
            console.error(error);
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <h3 className="text-center mb-5 mt-5">Edit Employee</h3>
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
                            <label htmlFor="name" className="form-label">
                                Name
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                value={employee.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="role" className="form-label">
                                Role
                            </label>
                            <RoleSelector
                                handleRoleChange={handleInputChange}
                                selectedRole={employee.role}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={employee.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">
                                Phone
                            </label>
                            <input
                                type="tel"
                                className="form-control"
                                id="phone"
                                name="phone"
                                value={employee.phone}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">
                                Address
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="address"
                                name="address"
                                value={employee.address}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="DOB" className="form-label">
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                className="form-control"
                                id="DOB"
                                name="DOB"
                                value={employee.DOB}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="sex" className="form-label">
                                Gender
                            </label>
                            <select
                                className="form-select"
                                id="sex"
                                name="sex"
                                value={employee.sex}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Gender</option>
                                <option value="1">Nam</option>
                                <option value="2">Nữ</option>
                            </select>
                        </div>

                        <div className="mb-3">
							<label htmlFor="image" className="form-label">
								Eloyee Image
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
                            <Link to={"/admin/existing-employees"} className="btn btn-outline-info ml-5">
                                Back
                            </Link>
                            <button type="submit" className="btn btn-outline-warning">
                                Edit Employee
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditEmployee;
