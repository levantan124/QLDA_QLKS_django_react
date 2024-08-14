import React from "react";

const RoleSelector = ({ handleRoleChange, selectedRole }) => {
  const roles = [
    { value: 1, label: "Admin" },
    { value: 2, label: "Lễ tân" },
  ];

  return (
    <select
      className="form-select"
      name="role"
      value={selectedRole}
      onChange={(e) => handleRoleChange(parseInt(e.target.value, 10))} // Chuyển đổi giá trị thành số nguyên
    >
      <option value="">Select a role...</option>
      {roles.map((role) => (
        <option key={role.value} value={role.value}>
          {role.label}
        </option>
      ))}
    </select>
  );
};

export default RoleSelector;
