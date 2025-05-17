import React, { useState } from "react";
import EditDivisionComponent from "./EditDivisionComponent";
import axiosInstance from "../api/axiosInstance";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const DivisionComponent = ({ props, index, stateFunction }) => {
  const [showEdit, setShowEdit] = useState(false);
  const updateDivision = async (inputBoxVal) => {
    try {
      const res = await axiosInstance.put(
        `${API_BASE_URL}/division/edit/?id=${props.id}`,
        { name: inputBoxVal.target.value }
      );
      if (res.status === 200) {
        alert("Successfully Edited Division");
        return;
      }
      // alert("Unable to Edit Division");
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <div>
      <div className="flex h-fit p-2 my-1 border rounded-lg bg-white">
        {showEdit && (
          <EditDivisionComponent
            headingLabel={"Edit Division"}
            label={"Enter Division Name"}
            buttonLabel={"Edit"}
            onClick={updateDivision}
            setShow={setShowEdit}
          />
        )}
        <div className="flex justify-between items-center w-full">
          <div className="flex">
            <div className="text-md font-medium text-amber-900">
              {index + 1}.
            </div>
            <div className="text-md font-medium text-amber-900 ml-1 w-12">
              {props.name.slice()}
            </div>
          </div>
          <div className="text-md font-medium text-amber-900 ml-2">
            <button
              className="border p-2 rounded-md mx-1 text-lg font-medium text-amber-900  bg-mycolor"
              onClick={() => {
                if (confirm("Do you want to Edit Division")) {
                  setShowEdit((v) => !v);
                }
              }}
            >
              Edit
            </button>
            <button
              className="border p-2 rounded-md mx-1 text-lg font-medium text-amber-900  bg-mycolor"
              onClick={async () => {
                if (confirm("Do you want to Delete Division")) {
                  try {
                    const res = await axiosInstance.delete(
                      `${API_BASE_URL}/division/delete/?id=${props.id}`
                    );
                    if (res.status === 200) {
                      stateFunction((i) =>
                        i.filter((x) => {
                          return x.id != props.id;
                        })
                      );
                    }
                    alert("Division Deleted Successfully");
                  } catch (err) {
                    alert(err);
                  }
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DivisionComponent;
