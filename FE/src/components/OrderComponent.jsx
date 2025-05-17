import axiosInstance from "../api/axiosInstance";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const FILE_BASE_URL = import.meta.env.VITE_FILE_BASE_URL;
import AttachmentLogo from "../assets/attachment-tool-svgrepo-com.svg";
import FileLogo from "../assets/icons8-file.svg";
// import { ReactComponent as AttachmentSvg } from "../assets/attachment-tool-svgrepo-com.svg";
// import { ReactComponent as FileSvg } from "../assets/icons8-file.svg";
const OrderComponent = ({ props, isAdmin, orders, setOrders, divisions }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // const [userData , setUserData] = useState(null)

  // useEffect(()=>{
  //   async function fetchUserData(userId){
  //     try{
  //       const data = await axiosInstance.get(`${API_BASE_URL}/user/${props.userId}`);
  //       setUserData(data.data)
  //     } catch(err){
  //       console.log(err)
  //     }
  //   }

  //   fetchUserData()

  // },[])

  const navigate = useNavigate();
  const createdDate = props.createdAt;
  if (!divisions || divisions.length === 0) {
    return <div>Loading divisions...</div>;
  }
  const year = createdDate.slice(0, 4);
  const month = createdDate.slice(5, 7);
  const date = createdDate.slice(8, 10);

  const division = divisions.filter((i) => {
    return i.id == props.divisionId;
  })[0].name;

  const view = props.DocLink !== "";
  const months = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div className="h-fit p-2 my-3 shadow-2xl rounded-lg bg-white w-full text-left ">
      <div className="flex justify-between">
        <div className="detail-container flex ">
          <div className=" w-15 h-fit flex-col display-date">
            <div className="text-md ">{months[Number(month) - 1]}</div>
            <div className="text-lg font-medium text-amber-900">{date}</div>
            <div className="text-sm">{year}</div>
          </div>

          <div className="ml-2 displaying-details">
            <div className="flex items-center">
              <div
                className="text-lg font-medium text-amber-900 cursor-pointer"
                onClick={() => {
                  props.DocLink &&
                    window.open(
                      `${FILE_BASE_URL}/uploads/${props.DocLink.split("/")[2]}`,
                      "_blank"
                    );
                }}
              >
                {props.title}
              </div>
              {/* {userData && <div className="text-sm ml-2"><i>Created by {userData.username} </i> </div>} */}
            </div>

            <div className="flex">
              <div>{division}</div>
              <div className="font-medium">-{props.DocType}</div>
            </div>
            <div className="text-sm ">{props.description} </div>
          </div>
        </div>

        <div className="sm:flex sm:flex-row sm:items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="self-baseline md:hidden "
            onBlur={() => setMenuOpen(false)}
          >
            ☰
          </button>
          <nav
            className={`z-12 absolute right-1 h-fit 
                        ${menuOpen ? "flex flex-col space-y-2" : "hidden"} 
                        md:flex md:flex-row md:items-center md:static md:space-y-0 space-x-2`}
          >
            {isAdmin && (
              <div>
                <button
                  className="shadow-md p-2 rounded-lg mx-1 text-lg font-medium text-amber-900  bg-mycolor cursor-pointer"
                  onClick={() => {
                    if (confirm("Do u want to Update Doc")) {
                      navigate(`/editDoc/${props.id}`);
                    }
                  }}
                >
                  Edit
                </button>
                <button
                  className=" shadow-md p-2 rounded-lg mx-1 text-lg font-medium text-amber-900 bg-mycolor cursor-pointer"
                  onClick={async () => {
                    const res = confirm(`Do you want to delete Document?`);
                    if (!res) {
                      return;
                    }
                    try {
                      const response = await axiosInstance.delete(
                        `${API_BASE_URL}/order/delete`,
                        {
                          data: {
                            orderID: props.id,
                          },
                        }
                      );

                      if ((response.status = 200)) {
                        setOrders(
                          orders.filter((item) => {
                            return item !== props;
                          })
                        );

                        alert("Document Deleted Successfully");
                      }
                    } catch (err) {
                      alert(err);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            )}

            <div className="flex space-x-2">
              {view && (
                <button
                  className="shadow-md p-2 rounded-lg  bg-mycolor cursor-pointer w-fit"
                  onClick={() => {
                    window.open(
                      `${FILE_BASE_URL}/uploads/${props.DocLink.split("/")[2]}`,
                      "_blank"
                    );
                  }}
                >
                  <img src={FileLogo} width={20} alt="File" />
                </button>
              )}

              {props.primaryAttachment && (
                <button
                  className="shadow-md p-2 rounded-lg  w-fit bg-mycolor cursor-pointer"
                  onClick={() => {
                    window.open(
                      `${FILE_BASE_URL}/uploads/${
                        props.primaryAttachmentLink.split("/")[2]
                      }`,
                      "_blank"
                    );
                  }}
                >
                  <img src={AttachmentLogo} width={20} alt="Attachment 1" />
                </button>
              )}
              {props.secondaryAttachment && (
                <button
                  className="shadow-md p-2 rounded-lg w-fit bg-mycolor cursor-pointer"
                  onClick={() => {
                    window.open(
                      `${FILE_BASE_URL}/uploads/${
                        props.secondaryAttachmentLink.split("/")[2]
                      }`,
                      "_blank"
                    );
                  }}
                >
                  <img src={AttachmentLogo} width={20} alt="Attachment 1" />
                </button>
              )}
            </div>
          </nav>
        </div>

        {/* <div className="button-container flex text-lg font-medium text-amber-900 items-center">
          {isAdmin && (
            <div>
              <button
                className="shadow-md p-2 rounded-lg mx-1 text-lg font-medium text-amber-900  bg-mycolor cursor-pointer"
                onClick={() => {
                  if (confirm("Do u want to Update Doc")) {
                    navigate(`/editDoc/${props.id}`);
                  }
                }}
              >
                Edit
              </button>
              <button
                className=" shadow-md p-2 rounded-lg mx-1 text-lg font-medium text-amber-900 bg-mycolor cursor-pointer"
                onClick={async () => {
                  const res = confirm(`Do you want to delete Document?`);
                  if (!res) {
                    return;
                  }
                  try {
                    const response = await axiosInstance.delete(
                      `${API_BASE_URL}/order/delete`,
                      {
                        data: {
                          orderID: props.id,
                        },
                      }
                    );

                    if ((response.status = 200)) {
                      setOrders(
                        orders.filter((item) => {
                          return item !== props;
                        })
                      );

                      alert("Document Deleted Successfully");
                    }
                  } catch (err) {
                    alert(err);
                  }
                }}
              >
                Delete
              </button>
            </div>
          )}

          {view && (
            <button
              className="shadow-md p-2 mx-1 rounded-lg  bg-mycolor cursor-pointer"
              onClick={() => {
                window.open(
                  `${FILE_BASE_URL}/uploads/${props.DocLink.split("/")[2]}`,
                  "_blank"
                );
              }}
            >
              File
            </button>
          )}

          {props.primaryAttachment && (
            <button
              className="shadow-md p-2 rounded-lg mx-1  bg-mycolor cursor-pointer"
              onClick={() => {
                window.open(
                  `${FILE_BASE_URL}/uploads/${
                    props.primaryAttachmentLink.split("/")[2]
                  }`,
                  "_blank"
                );
              }}
            >
              Attach.1
            </button>
          )}
          {props.secondaryAttachment && (
            <button
              className="shadow-md p-2 rounded-lg mx-1  bg-mycolor cursor-pointer"
              onClick={() => {
                window.open(
                  `${FILE_BASE_URL}/uploads/${
                    props.secondaryAttachmentLink.split("/")[2]
                  }`,
                  "_blank"
                );
              }}
            >
              Attach.2
            </button>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default OrderComponent;
