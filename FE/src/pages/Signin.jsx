import { useState } from "react";
import { Button } from "../components/ButtonComponent";
import { Heading } from "../components/HeadingComponent";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeadingComponent";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import NavigateComponent from "../components/NavigateComponent";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const Signin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="bg-linear-to-b from-mycolor to-rose-200 font-myfont h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />
          <InputBox
            placeholder="youremail@gmail.com"
            label={"Email"}
            onChange={(e) => {
              return setUsername(e.target.value);
            }}
          />
          <InputBox
            placeholder="your password"
            label={"Password"}
            type={"password"}
            onChange={(e) => {
              return setPassword(e.target.value);
            }}
          />
          <div className="pt-4">
            <Button
              label={"Signin"}
              onClick={async () => {
                var response;
                try {
                  response = await axiosInstance.post(
                    `${API_BASE_URL}/user/signin`,
                    {
                      username,
                      password,
                    }
                  );

                  if ((response.status = 200)) {
                    localStorage.setItem("token", response.data.token);
                    alert("login successful");
                    navigate("/");
                    return;
                  }
                } catch (err) {
                  if (err.response) {
                    alert(err.response.data.message);
                  } else {
                    alert("Please Try Again Later");
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
