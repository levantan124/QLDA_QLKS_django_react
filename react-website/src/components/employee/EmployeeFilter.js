import React, { useState, useEffect } from "react";

const EmployeeFilter = ({ data, setFilteredData }) => {
  const [filter, setFilter] = useState("");

  const handleSelectChange = (e) => {
    const selectedRole = e.target.value;
    setFilter(selectedRole);

    const filteredEmployees = data.filter((employee) =>
      employee.role.toString() === selectedRole
    );
    setFilteredData(filteredEmployees);
  };

  const clearFilter = () => {
    setFilter("");
    setFilteredData(data);
  };

  const roles = [
    ...new Set(
      data.map((employee) => {
        switch (employee.role) {
          case 1:
            return "Admin";
          case 2:
            return "Lễ tân";
          case 3:
            return "Khách hàng";
          default:
            return "Unknown";
        }
      })
    ),
  ];

  return (
    <div className="input-group mb-3">
      <span className="input-group-text" id="employee-role-filter">
        Filter employees by role
      </span>
      <select
        className="form-select"
        aria-label="employee role filter"
        value={filter}
        onChange={handleSelectChange}
      >
        <option value="">Select a role to filter...</option>
        {roles.map((role, index) => (
          <option key={index} value={index + 1}>
            {role}
          </option>
        ))}
      </select>
      <button className="btn btn-hotel" type="button" onClick={clearFilter}>
        Clear Filter
      </button>
    </div>
  );
};

export default EmployeeFilter;
