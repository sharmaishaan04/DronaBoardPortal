import React, { use, useEffect, useState } from "react";
import DepartmentDropdown from "../components/DepartmentDropdown";
import OrderComponent from "../components/OrderComponent";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Home = () => {
  const docType = ["ION", "DO", "CIRCULAR"];
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);
  const [divisions, setDivisions] = useState([]);
  const [inputFilterText, setInputFilterText] = useState("");
  const [activeDivision, setActiveDivision] = useState(0);
  const [activeType, setActiveType] = useState(0);
  const [orders, setOrders] = useState([]);
  const [limit, setLimit] = useState(10);
  const date = new Date().toISOString().slice(0, 7);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [chooseStartDate, setChooseStartDate] = useState(false);
  const [chooseEndDate, setChooseEndDate] = useState(false);
  const [userData, setUserData] = useState(null);

  //fetching divisions and isAdmin and isSignedIn
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}/division`);
        setDivisions(response.data);
      } catch (error) {
        console.error("Error fetching divisions:", error);
      }
    };
    async function fetchIsAdmin() {
      try {
        const data = await axiosInstance.get(`${API_BASE_URL}/user/isAdmin`);
        setIsAdmin(data.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    async function fetchIsSignedIn() {
      try {
        const data = await axiosInstance.get(`${API_BASE_URL}/user/isSignIn`);
        if (data.status === 401) {
          setIsSignedIn(false);
        } else if (data.status === 200) {
          setIsSignedIn(true);
          const userId = data.data.userId;
          fetchUserData(userId);
        }
      } catch (error) {
        console.log(error);
      }
    }
    async function fetchUserData(userId) {
      try {
        const data = await axiosInstance.get(`${API_BASE_URL}/user/${userId}`);
        setUserData(data.data);
      } catch (err) {
        console.log(err);
      }
    }

    fetchIsAdmin();
    fetchDivisions();
    fetchIsSignedIn();
  }, []);

  //fetching orders and total orders to display
  useEffect(() => {
    fetchOrders();
  }, [inputFilterText, limit, startDate, endDate]);

  const fetchOrders = async (page = 1) => {
    const filterType = activeType === 0 ? "" : encodeURIComponent(activeType);
    const formattedStartDate = startDate ? encodeURIComponent(startDate) : "";
    const formattedEndDate = endDate ? encodeURIComponent(endDate) : "";
    const filter = encodeURIComponent(activeDivision);
    const inputFilterTextEnc = encodeURIComponent(inputFilterText);
    try {
      const resData = await axiosInstance.get(
        `${API_BASE_URL}/order/bulk?filter=${filter}&filterType=${filterType}&filterText=${inputFilterTextEnc}&startDate=${formattedStartDate}&endDate=${formattedEndDate}&page=${page}&limit=${limit}`
      );

      const data = resData.data.data;
      const totalOrders = resData.data.totalOrders;
      if (!data || !Array.isArray(data)) {
        console.error("Invalid data received:", data);
        setOrders([]);
        return;
      }
      setOrders(data);
      setTotalOrders(totalOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  return (
    <div className=" bg-linear-to-b from-mycolor to-rose-200 font-myfont min-h-screen flex justify-center">
      <div className="rounded-lg text-center p-2 px-4 flex">
        <div className="flex flex-col justify-between">
          {/* Content */}
          <div className="flex justify-center ">
            <div className="w-fit p-2">
              {/* Displaying Dashboard */}
              <div className="flex justify-between items-center space-x-1">
                <div className="font-bold text-3xl text-slate-800 bg-white shadow-xl rounded-md p-2 sm:text-4xl">
                  NOTICE BOARD
                </div>
                <div className="">
                  {isSignedIn === true ? (
                    <div>
                      <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden bg-white p-1 rounded-md"
                      >
                        ☰
                      </button>
                      <nav
                        className={`z-12 absolute right-1 h-fit 
                        ${menuOpen ? "flex flex-col space-y-2" : "hidden"} 
                        md:flex md:flex-row md:items-center md:static md:space-y-0 space-x-2`}
                      >
                        <div className="shadow-xl p-2 rounded-md bg-white text-orange-900 w-full">
                          {userData ? `${userData.username}` : ""}
                        </div>
                        <button
                          className="shadow-xl p-2 rounded-md bg-white text-orange-900 cursor-pointer w-full"
                          onClick={async () => {
                            const res = confirm("Do you want to Logout ?");
                            if (!res) {
                              return;
                            }
                            try {
                              const res = await axiosInstance.post(
                                `${API_BASE_URL}/user/logout`
                              );
                              if (res.status === 200) {
                                localStorage.removeItem("token");
                                alert(res.data.message);
                                navigate("/signin");
                              } else {
                                throw new Error(res.data.message);
                              }
                            } catch (error) {
                              console.log(error);
                            }
                          }}
                        >
                          Logout
                        </button>
                        {!isAdmin && (
                          <button
                            className="shadow-xl  p-2 ml-2 rounded-md bg-white text-orange-900 cursor-pointer w-full"
                            onClick={() => {
                              navigate("/upload");
                            }}
                          >
                            Upload
                          </button>
                        )}
                        {isAdmin && (
                          <button
                            className="shadow-xl  p-2 rounded-md  bg-white text-orange-900 cursor-pointer w-full"
                            onClick={() => {
                              navigate("/admin", { state: { isAdmin } });
                            }}
                          >
                            Admin
                          </button>
                        )}
                      </nav>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <button
                        className="shadow-xl p-2 rounded-md bg-white text-orange-900 cursor-pointer"
                        onClick={() => {
                          navigate("/signin");
                        }}
                      >
                        Login
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Filter Container */}
              <div className="flex space-x-2">
                <div className="flex h-fit items-center font-bold text-2xl mt-2 text-slate-700 opacity-70 w-fit bg-white p-1 shadow-xl rounded-md ">
                  <div className="">FILTERS</div>
                </div>
                <div className="mt-2 flex items-center text-left">
                  <div>
                    <button
                      onClick={() => setFilterOpen(!filterOpen)}
                      className="xl:hidden p-1 bg-white rounded-md "
                    >
                      ☰
                    </button>
                    <nav
                      className={`z-10 absolute left-[20%] h-fit  bg-mycolor rounded-md shadow-lg p-2
                        ${filterOpen ? "flex flex-col space-y-2" : "hidden"} 
                        xl:flex xl:flex-row xl:items-center xl:static xl:space-y-0 space-x-2 `}
                    >
                      {/* Displaying DateRange */}

                      {!chooseStartDate && (
                        <button
                          className="placeholder-black shadow-md p-2 rounded-md bg-white cursor cursor-pointer"
                          onClick={() => {
                            setChooseStartDate(true);
                          }}
                        >
                          Choose Start Date
                        </button>
                      )}

                      {chooseStartDate && (
                        <input
                          // type="text"
                          type="month"
                          className="placeholder-black shadow-md p-2 rounded-md bg-white cursor cursor-pointer"
                          value={startDate}
                          placeholder="Choose StartDate"
                          onChange={(e) => {
                            if (!e.target.value) {
                              setStartDate("");
                              return;
                            }
                            setStartDate(e.target.value);
                          }}
                          // onFocus={(e) => (e.target.type = "month")}
                          // onBlur={(e) => (e.target.type = "text")}
                        />
                      )}

                      {!chooseEndDate && (
                        <button
                          className="placeholder-black shadow-md p-2 rounded-md bg-white cursor cursor-pointer"
                          onClick={() => {
                            setChooseEndDate(true);
                          }}
                        >
                          Choose End Date
                        </button>
                      )}

                      {chooseEndDate && (
                        <input
                          // type="text"
                          type="month"
                          className="placeholder-black shadow-md  min-w-4xs p-2 ml-2 rounded-md bg-white cursor-pointer"
                          value={endDate}
                          placeholder="Choose EndDate"
                          onChange={(e) => {
                            if (!e.target.value) {
                              setEndDate("");
                              return;
                            }

                            setEndDate(e.target.value);
                          }}
                          // onFocus={(e) => (e.target.type = "month")}
                          // onBlur={(e) => (e.target.type = "text")}
                        />
                      )}

                      {/* Displaying Filter By Title Search */}

                      <input
                        placeholder="Search by Title"
                        type="text"
                        className="placeholder-black shadow-md  p-2 rounded-md bg-white text-center"
                        onChange={(e) => {
                          setInputFilterText(e.target.value);
                        }}
                      />

                      {/* Displaying Dropdowns */}

                      {/* Division DropDown */}
                      <DepartmentDropdown
                        departmentNames={divisions}
                        active={activeDivision}
                        setActive={setActiveDivision}
                        onChange={fetchOrders}
                        label={"Select Division"}
                      />

                      {/* DocType DropDown */}
                      <DepartmentDropdown
                        departmentNames={docType}
                        active={activeType}
                        setActive={setActiveType}
                        onChange={fetchOrders}
                        label={"Select Doc Type"}
                      />
                    </nav>
                  </div>
                </div>
              </div>

              {/* Displaying Orders  */}
              <div className="">
                {orders.length > 0 ? (
                  orders.map((i, index) => (
                    <OrderComponent
                      props={i}
                      key={index}
                      isAdmin={isAdmin}
                      orders={orders}
                      setOrders={setOrders}
                      divisions={divisions}
                    />
                  ))
                ) : (
                  <div className="text-gray-500 text-center">
                    No orders found
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pagination Controls */}
          <Pagination
            fetchOrders={fetchOrders}
            totalOrders={totalOrders}
            limit={limit}
            setLimit={setLimit}
            length={orders.length}
          />
        </div>
      </div>
    </div>
    // </div>
  );
};

const Pagination = ({ fetchOrders, totalOrders, limit, setLimit, length }) => {
  const [page, setPage] = useState(1);
  return (
    <div className=" m-4">
      <div className="flex justify-center">
        <div className="flex justify-center bg-rose-50 p-1 shadow-xl rounded-lg">
          <div className="px-2 py-1 shadow-xl rounded-md bg-white text-orange-900 font-semibold flex items-center">
            <div>Max record : </div>
            <input
              className=" border py-1 text-center ml-2 border-amber-900 rounded-md bg-mycolor text-orange-900 font-semibold"
              type="number"
              defaultValue={limit}
              min={1}
              max={totalOrders}
              onChange={(e) => {
                setLimit(e.target.value);
              }}
            />
          </div>
          <div className="ml-2 pagination-controls shadow-xl bg-white rounded-md text-orange-900 flex items-center space-x-3 py-1">
            <button
              className={`px-2 py-1 ml-1 rounded-md font-semibold transition duration-200 ${
                page === 1
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-amber-900 text-white hover:bg-orange-600"
              }`}
              onClick={() => {
                if (page > 1) {
                  setPage(page - 1);
                  fetchOrders(page - 1);
                }
              }}
              disabled={page === 1}
            >
              {"<"}
            </button>

            <span className="px-2  border border-amber-900 rounded-md bg-white text-orange-900 font-semibold">
              {page}
            </span>

            <button
              className={`px-2 py-1 mr-1 rounded-md font-semibold transition duration-200 ${
                page * limit >= totalOrders
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-amber-900 text-white hover:bg-orange-600"
              }`}
              onClick={() => {
                if (page * limit < totalOrders) {
                  setPage(page + 1);
                  fetchOrders(page + 1);
                }
              }}
              disabled={page * limit >= totalOrders}
            >
              {">"}
            </button>
          </div>
          <div className="ml-2 px-2 py-2 bg-white shadow-xl rounded-md text-orange-900 font-semibold flex items-center">{`Showing  ${
            (page - 1) * limit + length
          } of ${totalOrders} `}</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
