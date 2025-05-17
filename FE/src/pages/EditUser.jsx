const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { Heading } from "../components/HeadingComponent";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeadingComponent";
import axiosInstance from "../api/axiosInstance";
import { useState, useEffect } from "react";
import ChoiceComponent from "../components/ChoiceComponent";
import { useNavigate, useParams } from "react-router-dom";
import NavigateComponent from "../components/NavigateComponent";

const EditUser = ({ style }) => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [isPassword, setIsPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [designation, setDesignation] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `${API_BASE_URL}/user/${userId}`
        );
        const userData = response.data;
        setUser(userData);
        setFirstName(userData.firstName || "");
        setLastName(userData.lastName || "");
        setUsername(userData.username || "");
        setDesignation(userData.designation || "");
        setIsAdmin(userData.isAdmin || false);
      } catch (error) {
        console.error("Error fetching user", error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !firstName || !lastName || !designation) {
      alert("Please fill in all fields");
      return;
    }

    const formData = { username, firstName, lastName, designation, isAdmin };
    if (isPassword) {
      formData.password = password;
    }

    if (!confirm("Do you want to update the user?")) {
      return;
    }

    try {
      const response = await axiosInstance.put(
        `${API_BASE_URL}/user/update/${userId}`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        alert(response.data.message);
        navigate("/");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert("Error updating user: " + error.message);
    }
  };

  return (
    <div className="bg-linear-to-b from-mycolor to-rose-200 font-myfont min-h-screen flex justify-center">
      <div className={style ? "" : "flex flex-col justify-center"}>
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <form onSubmit={handleSubmit}>
            <Heading label="Edit User" />
            <SubHeading label="Enter information to update a user" />

            <InputBox
              placeholder="e.g., Ishaan"
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <InputBox
              placeholder="e.g., Sharma"
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <InputBox
              placeholder="youremail@gmail.com"
              label="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <ChoiceComponent
              label="Update Password?"
              stateFunction={setIsPassword}
              state={isPassword}
            />
            {isPassword && (
              <InputBox
                placeholder="Your password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}

            <ChoiceComponent
              label="Admin Access"
              stateFunction={setIsAdmin}
              state={isAdmin}
            />

            <InputBox
              placeholder="Your designation"
              label="Designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            />

            <div className="pt-4">
              <button
                type="submit"
                className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
