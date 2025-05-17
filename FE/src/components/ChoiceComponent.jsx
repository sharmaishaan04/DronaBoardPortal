import React, { useState } from "react";

const ChoiceComponent = ({ label, stateFunction, state }) => {
  const [classNameA, setClassNameA] = useState("bg-gray-400");
  const [classNameB, setClassNameB] = useState("bg-gray-900");
  return (
    <div className="mt-1">
      <div className="text-sm font-medium text-left">{label}</div>
      <div className="flex mt-2">
        <button
          onClick={() => {
            stateFunction(true);

            // setClassNameA("bg-gray-900");
            // // setClassNameB("bg-gray-400");
          }}
          type="button"
          className={`text-center w-full text-white ${
            state ? classNameB : classNameA
          } hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 `}
        >
          Yes
        </button>

        <button
          onClick={() => {
            stateFunction(false);

            // setClassNameB("bg-gray-900");
            // setClassNameA("bg-gray-400");
          }}
          type="button"
          className={`text-center w-full text-white ${
            state ? classNameA : classNameB
          } hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 `}
        >
          No
        </button>
      </div>
    </div>
  );
};

export default ChoiceComponent;
