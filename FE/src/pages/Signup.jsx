const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { Heading } from "../components/HeadingComponent";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeadingComponent";
import axiosInstance from "../api/axiosInstance";
import { useState } from "react";
import ChoiceComponent from "../components/ChoiceComponent";

export const Signup = ({ style }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [designation, setDesignation] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password != confirmPassword) {
      alert("Passwords Do Not match");
      return;
    }
    if (!username || !firstName || !lastName || !password || !designation) {
      alert("Please fill in all fields");
      return;
    }

    const formData = {
      username,
      firstName,
      lastName,
      password,
      designation,
      isAdmin,
    };

    try {
      const response = await axiosInstance.post(
        `${API_BASE_URL}/user/signup`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.message === "User created successfully") {
        alert("User created successfully!");
        window.location.reload(true);
      } else {
        alert("Error creating user.");
      }
    } catch (error) {
      alert("Error creating user: " + error.message);
    }
  };

  return (
    <div className="bg-linear-to-b from-mycolor to-rose-200 font-myfont min-h-screen flex justify-center">
      {/* Conditional style to reduce gap betbeen Selecltion of Admin option and from inside admin panel */}
      <div className={style ? "" : "flex flex-col justify-center"}>
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4 shadow-lg">
          <form onSubmit={handleSubmit}>
            <Heading label={"Create User"} />
            <SubHeading label={"Enter your infromation to create a User"} />

            <InputBox
              placeholder="eg ishaan"
              label={"First Name"}
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
            <InputBox
              placeholder="eg sharma"
              label={"Last Name"}
              value={lastName}
              onChange={(e) => {
                return setLastName(e.target.value);
              }}
            />
            <InputBox
              placeholder="youremail@gmail.com"
              label={"Email"}
              value={username}
              onChange={(e) => {
                return setUsername(e.target.value);
              }}
            />
            <InputBox
              placeholder="your password"
              label={"Password"}
              type={"password"}
              value={password}
              onChange={(e) => {
                return setPassword(e.target.value);
              }}
            />

            <InputBox
              placeholder="confirm password"
              label={"Confirm Password"}
              type={"password"}
              value={confirmPassword}
              onChange={(e) => {
                return setConfirmPassword(e.target.value);
              }}
            />
            <InputBox
              placeholder="your designation"
              label={"Designation"}
              value={designation}
              onChange={(e) => {
                return setDesignation(e.target.value);
              }}
            />

            <ChoiceComponent
              label={"Admin Access"}
              stateFunction={setIsAdmin}
              state={isAdmin}
            />

            <div className="pt-4">
              <button
                type="submit"
                className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
