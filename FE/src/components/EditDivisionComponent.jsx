import React, { useState } from "react";
import { InputBox } from "./InputBox";
import { Button } from "./ButtonComponent";
const EditDivisionComponent = ({
  label,
  headingLabel,
  buttonLabel,
  divisionId,
  setShow,
  onClick,
}) => {
  const [inputBoxVal, setInputBoxVal] = useState("");
  return (
    <div className='z-10 shadow-lg absolute bg-white p-2  rounded-md'>
      <div className='text-lg text-center font-bold'>{headingLabel}</div>
      <div>
        <InputBox label={label} onChange={setInputBoxVal} />
        <div className='mt-2'>
          <Button
            label={buttonLabel}
            onClick={() => {
              onClick(inputBoxVal);
              setShow((e) => !e);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EditDivisionComponent;
