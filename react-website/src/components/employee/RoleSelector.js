import React from "react";

const RoleSelector = ({ handleRoleChange, selectedRole }) => {
  const roles = [
    { value: 1, label: "Admin" },
    { value: 2, label: "Lễ tân" },
  ];
  const currentRole = selectedRole || "";

  return (
    <select
      className="form-select"
      name="role"
      value={currentRole}
      onChange={handleRoleChange}
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
