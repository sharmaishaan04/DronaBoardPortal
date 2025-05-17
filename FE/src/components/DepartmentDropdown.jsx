import React, { useEffect } from "react";

const DepartmentDropdown = ({
  departmentNames,
  active,
  setActive,
  label,
  onChange,
}) => {
  const handleChange = (e) => {
    let selectedValue = e.target.value;
    console.log("Selected value:", selectedValue, typeof selectedValue);
    if (selectedValue === label) {
      selectedValue = 0;
      console.log(
        "inside Selected value:",
        selectedValue,
        typeof selectedValue
      );
      setActive(0);
    } else {
      setActive(selectedValue);
    }
    // Set the active department directly
    console.log("Selected Division:", selectedValue, typeof selectedValue);
  };

  useEffect(() => {
    onChange();
  }, [active]);

  return (
    <div className="">
      <select
        className="text-center p-2 rounded-md shadow-md w-full border-amber-900 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
        value={active}
        onChange={handleChange}
      >
        <option value={label}>{label}</option>
        {departmentNames.map((item, index) => (
          <option
            key={index}
            value={typeof item === "object" ? item.id : item}
            className="bg-red-100 text-gray-800"
          >
            {typeof item === "object" ? item.name : item}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DepartmentDropdown;
