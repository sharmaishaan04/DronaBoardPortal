import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const FILE_BASE_URL = import.meta.env.VITE_FILE_BASE_URL;
import { useNavigate } from "react-router-dom";

const FrontPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [divisions, setDivisions] = useState([]);
  useEffect(() => {
    const fetchOrders = async (page = 1) => {
      const date = new Date();
      const startDate = new Date(date.getFullYear(), 0)
        .toISOString()
        .slice(0, 7);
      const endDate = new Date(date.getFullYear(), 11)
        .toISOString()
        .slice(0, 7);
      try {
        const resData = await axiosInstance.get(
          `${API_BASE_URL}/order/bulk?&startDate=${startDate}&endDate=${endDate}&page=${page}`
        );

        const data = resData.data.data;
        if (!data || !Array.isArray(data)) {
          console.error("Invalid data received:", data);
          setOrders([]);
          return;
        }
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    const fetchDivisions = async () => {
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}/division`);
        setDivisions(response.data);
      } catch (error) {
        console.error("Error fetching divisions:", error);
      }
    };
    fetchDivisions();
    fetchOrders();
  }, []);

  return (
    <div className="bg-white">
      <button
        className="border p-1 m-2 rounded-md"
        onClick={() => {
          navigate("/");
        }}
      >
        View Details / Search
      </button>

      {orders.length > 0 ? (
        orders.map((item, index) => {
          console.log(item);
          console.log(divisions);
          return (
            <div className="flex space-x-1" key={index}>
              <div className="mx-2">{index + 1}. </div>
              <div>[{item.createdAt.slice(0, 10)}]</div>
              <div className="font-bold">{item.DocType}</div>
              <div className="font-bold">
                :
                {
                  divisions.filter((x) => {
                    return x.id == item.divisionId;
                  })[0].name
                }
                {`->`}
              </div>
              <div
                className=" cursor-pointer ml-2 text-blue-700"
                onClick={() => {
                  if (item.DocLink) {
                    window.open(
                      `${FILE_BASE_URL}/uploads/${item.DocLink.split("/")[2]}`,
                      "_blank"
                    );
                  }
                }}
              >
                {item.title}
              </div>

              {item.primaryAttachment && (
                <button
                  className="text-red-700  cursor-pointer ml-2"
                  onClick={() => {
                    window.open(
                      `${FILE_BASE_URL}/uploads/${
                        item.primaryAttachmentLink.split("/")[2]
                      }`,
                      "_blank"
                    );
                  }}
                >
                  Attach1
                </button>
              )}
              {item.secondaryAttachment && (
                <button
                  className="text-red-700 cursor-pointer ml-2"
                  onClick={() => {
                    window.open(
                      `${FILE_BASE_URL}/uploads/${
                        item.secondaryAttachmentLink.split("/")[2]
                      }`,
                      "_blank"
                    );
                  }}
                >
                  Attach2
                </button>
              )}
            </div>
          );
        })
      ) : (
        <div>...Loading</div>
      )}
    </div>
  );
};

export default FrontPage;
