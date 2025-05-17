import React from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ShowUserComponent = ({ props, stateFunction }) => {
  const navigate = useNavigate();
  return (
    <div className=" p-2 my-1 border rounded-lg bg-white w-full sm:w-full">
      <div className="flex justify-between ">
        <div className="text-left w-[50%]  overflow-auto">
          <div className="text-md font-medium text-amber-900">
            {`${props.firstName} ${props.lastName}`}
          </div>
          <div className="text-sm">{props.username}</div>
          <div className="flex">
            {props.designation}
            <div className="ml-2 font-medium text-amber-900">
              {props.isAdmin ? " Admin" : " User"}
            </div>
          </div>
          <div></div>
        </div>
        <div className="flex text-lg font-medium text-amber-900 items-center ">
          <button
            className="border p-2 rounded-md mx-1 text-lg font-medium text-amber-900  bg-mycolor"
            onClick={() => {
              if (confirm("Do u want to Update User ?")) {
                navigate(`/editUser/${props.id}`);
              }
            }}
          >
            Edit
          </button>
          <button
            className="border p-2 rounded-md mx-1 text-lg font-medium text-amber-900  bg-mycolor"
            onClick={async () => {
              if (confirm("Do u want to Delete User ?")) {
                try {
                  const res = await axiosInstance.delete(
                    `${API_BASE_URL}/user/delete/?id=${props.id}`
                  );

                  if (res.status === 200) {
                    stateFunction((e) =>
                      e.filter((i) => {
                        return i.id != props.id;
                      })
                    );
                  }

                  alert(res.data.message);
                } catch (error) {
                  alert("error deleting user", error);
                }
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowUserComponent;
