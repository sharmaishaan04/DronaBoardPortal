import React from "react";

const NavigateComponent = () => {
  return (
    <div className=" absolute top-0 left-0 p-2 space-x-2">
      <button
        className="bg-white w-8 h-8 shadow-lg border-1 text-xl font-bold rounded-[50%]"
        onClick={() => {
          history.back();
        }}
      >
        {"<"}
      </button>
      <button
        className="bg-white w-8 h-8 shadow-lg border-1 text-xl font-bold rounded-[50%]"
        onClick={() => {
          history.forward();
        }}
      >
        {">"}
      </button>
    </div>
  );
};

export default NavigateComponent;
