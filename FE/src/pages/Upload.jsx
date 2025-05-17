import { useState, useEffect } from "react";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeadingComponent";
import { Heading } from "../components/HeadingComponent";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import RadioGrid from "../components/RadioGrid";
import DepartmentDropdown from "../components/DepartmentDropdown";
import ChoiceComponent from "../components/ChoiceComponent";
import UploadFileComponent from "../components/UploadFileComponent";
import NavigateComponent from "../components/NavigateComponent";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UploadComponent = ({ isAdmin, style }) => {
  const navigate = useNavigate();
  const [divisions, setDivisions] = useState([]);
  const [activeDivision, setActiveDivision] = useState(0);
  const [files, setFiles] = useState([]);
  const [showFile, setShowFile] = useState(true);
  const [primaryAttachment, setPrimaryAttachment] = useState(false);
  const [secondaryAttachment, setSecondaryAttachment] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [DocType, setDocType] = useState("");
  const [createdAt, setCreatedAt] = useState(new Date().toISOString());
  const [date, setDate] = useState(new Date().toISOString().slice(0, 7));
  const orderArray = ["ION", "DO", "CIRCULAR"];
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}/division`);
        setDivisions(response.data);
      } catch (error) {
        console.error("Error fetching divisions:", error);
      }
    };
    fetchDivisions();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !DocType || activeDivision == 0) {
      alert("Please fill in all fields");
      return;
    }

    // Create FormData to send file and other data
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`orderFiles`, file);
    });
    formData.append("title", title);
    formData.append("description", description);
    formData.append("DocType", DocType);
    formData.append("primaryAttachment", primaryAttachment);
    formData.append("secondaryAttachment", secondaryAttachment);
    formData.append("divisionId", activeDivision);
    formData.append("createdAt", createdAt);
    formData.append("createdDate", date);

    try {
      const response = await axiosInstance.post(
        `${API_BASE_URL}/order/upload`,
        formData
      );

      if (response.data.message === "Order uploaded successfully!") {
        alert("Order uploaded successfully!");
        navigate("/");
      } else {
        alert("Error uploading order.");
      }
    } catch (error) {
      alert("Error uploading order: " + error.message);
    }
  };

  return (
    <div className=" bg-linear-to-b from-mycolor to-rose-200 font-myfont min-h-screen flex justify-center ">
      <div className={style ? "" : "flex flex-col justify-center"}>
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4 shadow-lg ">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Heading label="Publish Doc" />
            <SubHeading label="Add the information to publish the Doc" />
            <InputBox
              placeholder="Title"
              label="Add Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <InputBox
              placeholder="Description"
              label="Add Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="text-sm font-medium text-left py-2">
              Select Division
            </div>

            <div className="flex">
              <DepartmentDropdown
                departmentNames={divisions}
                active={activeDivision}
                setActive={setActiveDivision}
                label={"Select Division"}
                onChange={() => {}}
              />
            </div>

            <div className="text-sm font-medium text-left py-2">Doc Type</div>

            <div className="">
              <div className="bg-white p-4 shadow-md rounded-lg mt-2 ">
                <RadioGrid
                  orderType={DocType}
                  orderArray={orderArray}
                  setOrderType={(val) => {
                    setDocType(val);
                  }}
                />
              </div>
            </div>

            {isAdmin && (
              <div className="flex flex-col mt-2">
                <div className="text-sm font-medium text-left">Select Date</div>
                <input
                  type="date"
                  // value={newDate.toISOString().slice(0,10)}
                  className="placeholder-black border w-3xs text-orange-900 p-2 rounded-md bg-white mt-2"
                  onChange={(e) => {
                    const selectedDate = new Date(e.target.value); // Creates a date in local time
                    const formattedDate = selectedDate.toISOString(); // Extract YYYY-MM-DD
                    console.log(formattedDate);
                    setCreatedAt(formattedDate);
                    setDate(formattedDate.slice(0, 7));
                  }}
                />
              </div>
            )}

            <div>
              <ChoiceComponent
                label={"Any File to Publish?"}
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
              {files[0] && (
                <div>
                  <ChoiceComponent
                    label={"Any Primary Attachment ?"}
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
              )}
            </div>

            <div>
              {files[1] && (
                <div>
                  <ChoiceComponent
                    label={"Any Secondary Attachment?"}
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
              )}
            </div>

            <button
              type="submit"
              className="mt-3 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
            >
              Publish
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadComponent;
