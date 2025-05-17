import { useState, useEffect } from "react";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeadingComponent";
import { Heading } from "../components/HeadingComponent";
import axiosInstance from "../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import RadioGrid from "../components/RadioGrid";
import DepartmentDropdown from "../components/DepartmentDropdown";
import ChoiceComponent from "../components/ChoiceComponent";
import UploadFileComponent from "../components/UploadFileComponent";
import NavigateComponent from "../components/NavigateComponent";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditOrder = () => {
  const navigate = useNavigate();
  const { orderId } = useParams(); // Get order ID from URL params
  const [order, setOrder] = useState(null);
  const [divisions, setDivisions] = useState([]);
  const [files, setFiles] = useState([]);
  const [showFile, setShowFile] = useState(false);
  const [primaryAttachment, setPrimaryAttachment] = useState(false);
  const [secondaryAttachment, setSecondaryAttachment] = useState(false);
  const [docType, setDocType] = useState("");

  const orderArray = ["ION", "DO", "CIRCULAR"];
  useEffect(() => {
    // Fetch existing order details
    const fetchOrderDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `${API_BASE_URL}/order/${orderId}`
        );
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    // Fetch division list
    const fetchDivisions = async () => {
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}/division`);
        setDivisions(response.data);
      } catch (error) {
        console.error("Error fetching divisions:", error);
      }
    };

    fetchOrderDetails();
    fetchDivisions();
  }, [orderId]);

  if (!order) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (files.length > 0) {
      files.forEach((file, index) => {
        formData.append(`orderFiles`, file);
      });
    }

    formData.append("title", order.title);
    formData.append("description", order.description);
    formData.append("DocType", order.DocType);
    formData.append("primaryAttachment", primaryAttachment);
    formData.append("secondaryAttachment", secondaryAttachment);
    formData.append("divisionId", order.divisionId);
    // formData.append("createdAt", createdAt);
    // formData.append("createdDate", date);

    if (!confirm("Do u want to Update Doc")) {
      return;
    }

    try {
      const response = await axiosInstance.put(
        `${API_BASE_URL}/order/update/${orderId}`,
        formData
      );

      if (response.data.message === "Order updated successfully!") {
        alert("Order updated successfully!");
        navigate("/");
      } else {
        alert("Error updating order.");
      }
    } catch (error) {
      alert("Error updating order: " + error.message);
    }
  };

  return (
    <div className="bg-linear-to-b from-mycolor to-rose-200 font-myfont min-h-screen flex justify-center ">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Heading label="Edit Order" />
            <SubHeading label="Modify the details of the order" />

            <InputBox
              placeholder="Title"
              label="Title"
              value={order.title}
              onChange={(e) => setOrder({ ...order, title: e.target.value })}
            />

            <InputBox
              placeholder="Description"
              label="Description"
              value={order.description}
              onChange={(e) =>
                setOrder({ ...order, description: e.target.value })
              }
            />

            <div className="text-sm font-medium text-left py-2">
              Select Division
            </div>

            <DepartmentDropdown
              departmentNames={divisions}
              active={order.divisionId}
              setActive={(val) => setOrder({ ...order, divisionId: val })}
              label={"Select Division"}
              onChange={() => {}}
            />

            <div className="text-sm font-medium text-left py-2">Doc Type</div>
            <RadioGrid
              orderType={docType}
              orderArray={orderArray}
              setOrderType={(val) => {
                setDocType(val);
              }}
            />

            <div>
              <ChoiceComponent
                label={"Update File?"}
                stateFunction={setShowFile}
                state={showFile}
              />
              {showFile && (
                <UploadFileComponent
                  label={"Upload File"}
                  setFile={setFiles}
                  index={0}
                />
              )}
            </div>

            <div>
              {
                <div>
                  <ChoiceComponent
                    label={"Update Primary Attachment ?"}
                    stateFunction={setPrimaryAttachment}
                    state={primaryAttachment}
                  />
                  {primaryAttachment && (
                    <UploadFileComponent
                      label={"Upload Primary Attachment"}
                      setFile={setFiles}
                      index={1}
                    />
                  )}
                </div>
              }
            </div>

            <div>
              {
                <div>
                  <ChoiceComponent
                    label={"Update Secondary Attachment ?"}
                    stateFunction={setSecondaryAttachment}
                    state={secondaryAttachment}
                  />
                  {secondaryAttachment && (
                    <UploadFileComponent
                      label={"Upload Secondary Attachment"}
                      setFile={setFiles}
                      index={2}
                    />
                  )}
                </div>
              }
            </div>

            <button
              type="submit"
              className="mt-3 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
            >
              Update Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditOrder;
