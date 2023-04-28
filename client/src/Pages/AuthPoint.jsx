import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  useLoginMutation,
  useRegisterMutation,
} from "../Features/auth/authApiSlice";

import usePersist from "../hooks/usePersist";
import { setCredentials, setEmailCredential } from "../Features/auth/authSlice";
import { useDispatch } from "react-redux";
import { SocketContext } from "../context/socketContext";
import useAuth from "../hooks/useAuth";

const AuthPoint = () => {
  const navigate = useNavigate();
  const [registered, setRegistered] = useState(false);
  const [register] = useRegisterMutation();
  const [persist, setPersist] = usePersist();
  const [err, setErr] = useState(null);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  // ? Input placeholders
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [incorrectPassword, setIncorrectPassword] = useState(false);
  const { socket } = useContext(SocketContext);
  const { id } = useAuth();
  // toggle remember me button

  const togglePersist = () => setPersist((prev) => !prev);

  // Responsible for User login or signup

  async function handleSubmit(e) {
    e.preventDefault();
    if (!registered) {
      try {
        const { error, data } = await login({ email, password });
        if (error) {
          setErr(error);
          setPersist(false);
        } else if (data) {
          dispatch(setCredentials({ accessToken: data?.accessToken }));

          navigate("/home");
        }
      } catch (err) {}
    } else {
      setIncorrectPassword(false);
      try {
        const { error, data } = await register({ email, password, username });

        if (error) {
          setErr(error);
        } else if (data) {
          setRegistered((prev) => !prev);
        }
      } catch (err) {}
    }
  }
  if (id) {
    socket?.emit("register", { id: id });
  }

  useEffect(() => {
    if (
      err?.data?.message === "UnAuthorized" ||
      err?.data?.message === "Invalid credentials"
    ) {
      setIncorrectPassword(true);
    }
  }, [err?.data?.message]);

  setTimeout(() => {
    setErr(null);
  }, 5000);

  const inputClass = `border-b bg-transparent border-gray-600 p-2 outline-none`;

  return (
    <div className="h-[100vh]">
      <div className="glass p-4 transform w-[65%] md:w-[40%] lg:w-[20%]  mx-auto   translate-y-[30%] items-center">
        <div className="flex flex-col gap-10">
          <div className="mx-auto">
            <img src="./Logo.svg" alt="" />
          </div>
          <form className="flex flex-col gap-8 w-full" onSubmit={handleSubmit}>
            {registered && (
              <input
                type="text"
                className={inputClass}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="John Doe *"
              />
            )}
            <input
              type="email"
              className={inputClass}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="johndoe@example.com *"
            />
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="Password *"
            />
            {!registered && (
              <label className="flex gap-2">
                <input
                  type="checkbox"
                  id="persist"
                  checked={persist}
                  onChange={togglePersist}
                />
                Remember me
              </label>
            )}
            <button
              disabled={isLoading}
              type="submit"
              className="primary w-full"
            >
              {" "}
              {registered ? "register" : "Login"}
            </button>
          </form>
          <div className="flex flex-col gap-4">
            <p className="text-center text-sm text-red-500">
              {err?.data?.message}
            </p>
            {!registered && incorrectPassword ? (
              <p className="text-sm text-center font-bold text-gray-400">
                Forgot Password ?{" "}
                <Link
                  to="/recovery"
                  onClick={() => dispatch(setEmailCredential({ email }))}
                  className="text-blue-500 cursor-pointer"
                >
                  Recover now !
                </Link>
              </p>
            ) : (
              <p className="text-sm text-center font-bold text-gray-400">
                {" "}
                {!registered ? "Don't have an account? " : "Have an account? "}
                <span
                  className="text-blue-700 font-bold text-[16px] cursor-pointer"
                  onClick={() => setRegistered((prev) => !prev)}
                >
                  {" "}
                  {!registered ? "register" : "Login"}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPoint;
