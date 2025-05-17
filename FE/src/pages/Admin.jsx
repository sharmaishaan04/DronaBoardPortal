import React, { useEffect, useState } from "react";
import { Signup } from "./Signup";
import UploadComponent from "./Upload";
import { useLocation } from "react-router-dom";
import ShowDivisionComponent from "../components/ShowDivisionComponent";
import axiosInstance from "../api/axiosInstance";
import ShowUserComponent from "../components/ShowUserComponent";
import { Heading } from "../components/HeadingComponent";
import EditDivisionComponent from "../components/EditDivisionComponent";
import RadioGrid from "../components/RadioGrid";
import NavigateComponent from "../components/NavigateComponent";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Admin = () => {
  const [showCreateDiv, setShowCreateDiv] = useState(false);
  const [divisions, setDivisions] = useState([]);
  const [users, setUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const location = useLocation();
  const isAdmin = location.state?.isAdmin || false;

  const [visibleType, setVisibleType] = useState("Publish");

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}/division`);
        setDivisions(response.data);
      } catch (error) {
        console.error("Error fetching divisions:", error);
      }
    };
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}/user`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching divisions:", error);
      }
    };
    fetchDivisions();
    fetchUsers();
  }, []);

  const createDivision = async (inputBoxVal) => {
    try {
      const res = await axiosInstance.post(`${API_BASE_URL}/division/create`, {
        name: inputBoxVal.target.value,
      });
      if (res.status === 201) {
        alert("Successfully created Division");
        setDivisions((e) => [...e, res.data.data]);
        return;
      }
      alert("Unable to Create Division");
    } catch (error) {
      alert(error.message);
    }
  };

  let visibleDivisions = divisions.slice(0, 8);
  let remainingDivisions = divisions.slice(8);
  let visibleUsers = users.slice(0, 8);
  let remainingUsers = users.slice(8);
  useEffect(() => {
    visibleDivisions = divisions.slice(0, 8);
    remainingDivisions = divisions.slice(8);
    // visibleUsers = users.slice(0, 8);
    // remainingUsers = users.slice(8);
  }, [divisions]);

  return (
    <div className="bg-mycolor font-myfont min-h-screen">
      {isAdmin && (
        <>
          <div className="text-center">
            <Heading label={"Admin Panel"} />
          </div>

          <div className="m-5 ">
            <div className="font-bold text-2xl text-center opacity-70">
              {"Select Option to Manage"}
            </div>
            <div className="flex justify-center">
              <div className="bg-white p-4 shadow-md rounded-lg mt-2">
                <RadioGrid
                  orderType={visibleType}
                  setOrderType={setVisibleType}
                  orderArray={[
                    "Publish",
                    "Add User",
                    "Manage Divisions",
                    "Manage Users",
                  ]}
                  style={"text-lg font-medium ml-1"}
                />
              </div>
            </div>
          </div>

          <div className="bg-linear-to-b from-mycolor to-rose-200 font-myfont min-h-screen flex justify-center">
            <div className="">
              {visibleType === "Publish" && (
                <UploadComponent isAdmin={isAdmin} style={true} />
              )}
              {visibleType === "Add User" && <Signup style={true} />}
              {visibleType === "Manage Users" && (
                <div className=" bg-linear-to-b from-mycolor to-rose-200 font-myfont min-h-screen flex justify-center mb-10">
                  <div className="">
                    <div className="rounded-lg bg-white text-center p-2 px-4 shadow-lg w-80 sm:w-fit">
                      <div className="text-center mb-4">
                        <Heading label={"Users"} />
                      </div>
                      {visibleUsers.map((item, index) => {
                        return (
                          <ShowUserComponent
                            stateFunction={setUsers}
                            key={index}
                            props={item}
                          />
                        );
                      })}

                      {remainingUsers.length > 0 && (
                        <div className="">
                          <button
                            onClick={() => setShowUserDropdown((e) => !e)}
                            className=" p-2 border rounded-md text-lg font-medium text-amber-900 bg-mycolor"
                          >
                            {showUserDropdown ? "Hide More" : "Show More"}
                          </button>

                          {showUserDropdown && (
                            <div className=" bg-white ">
                              {remainingUsers.map((item, index) => (
                                <ShowUserComponent
                                  key={index + 8}
                                  props={item}
                                  index={index + 8}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {visibleType === "Manage Divisions" && (
                <div className=" bg-linear-to-b from-mycolor to-rose-200 font-myfont min-h-screen flex justify-center mb-10">
                  <div className="">
                    <div className="rounded-lg bg-white text-center p-2 px-4 shadow-lg w-80">
                      <div>
                        <div className="text-center mb-2.5">
                          <Heading label={"Divisions"} />
                        </div>
                        {showCreateDiv && (
                          <EditDivisionComponent
                            label={"Enter Division Name"}
                            buttonLabel={"Create"}
                            headingLabel={"Create Division"}
                            setShow={setShowCreateDiv}
                            onClick={createDivision}
                          />
                        )}
                        {visibleDivisions.map((item, index) => (
                          <ShowDivisionComponent
                            key={index}
                            props={item}
                            index={index}
                            stateFunction={setDivisions}
                          />
                        ))}
                        <button
                          onClick={() => {
                            if (
                              confirm("Do you want to create new Division ? ")
                            ) {
                              setShowCreateDiv((e) => !e);
                            }
                          }}
                          className=" p-2 border rounded-md text-lg font-medium text-amber-900 bg-mycolor"
                        >
                          Create New Division
                        </button>

                        {remainingDivisions.length > 0 && (
                          <div className="">
                            <button
                              onClick={() => setShowDropdown((e) => !e)}
                              className=" p-2 mt-1 border rounded-md text-lg font-medium text-amber-900 bg-mycolor"
                            >
                              {showDropdown ? "Hide" : "Show More"}
                            </button>

                            {showDropdown && (
                              <div className=" bg-white ">
                                {remainingDivisions.map((item, index) => (
                                  <ShowDivisionComponent
                                    key={index + 8}
                                    props={item}
                                    index={index + 8}
                                    stateFunction={setDivisions}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Admin;
