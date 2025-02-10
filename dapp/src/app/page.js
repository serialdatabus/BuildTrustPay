"use client";

import { useState } from "react";
import prisma, { signupUser } from "./helpers";
import { signIn } from "next-auth/react";


export default function Login() {
  const [signupFields, setSignupFields] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const [signinFields, setSigninFields] = useState({
    email: "",
    password: "",
  });

  const [errors,setErrors] = useState([]);
  const [isFormOnLoginMode,setisFormOnLoginMode] = useState(false);
  const [processing,setProcessing] = useState(false);

  return (
    <div className="flex flex-col p-4 w-full bg-slate-600 h-screen">
      <div>
        <div id="logo" className="flex items-center">
          <img className="w-[2em] rounded-full" src="/logo.png" alt="logo" />
          <span className="ml-2 text-white text-xl">BuildTrust Pay</span>
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2 flex justify-center items-center p-2 text-white text-4xl">
          A secure tool for managing construction payments using Blockchain
        </div>
        <div className="w-1/2 h-[30em]">
          <div className={"flex-col bg-white p-4 rounded-lg "+(processing ? "opacity-90 pointer-events-none" : "")}>
            <div className="text-center">
              <span className="text-slate-500">
                Authentication | Account Creation
              </span>
            </div>
            {!isFormOnLoginMode && <div className="flex">
              <div className="flex items-center w-1/3">
                <div className="h-[1px] bg-slate-400 w-full opacity-40"></div>
              </div>
              <div className="flex w-1/3 txt-center h-[4em] items-center justify-center text-slate-600">
                Quick Signup
              </div>

              <div className="flex items-center w-1/3">
                <div className="h-[1px] bg-slate-400 w-full opacity-40"></div>
              </div>
            </div>}

            <div>
              <button className="flex w-full justify-center bg-blue-400 text-white items-center px-6 py-3 border rounded-lg shadow-md hover:shadow-lg hover:bg-gray-50 transition">
                <img
                  src="https://www.svgrepo.com/show/355037/google.svg"
                  alt="Google"
                  className="w-6 h-6 mr-3"
                />
                <span className="text-white font-medium">
                  {isFormOnLoginMode ? "Sign in with Google" : "Sign up with Google"}
                </span>
              </button>
            </div>

            <div className="text-center text-slate-400 my-[2em]">
              {isFormOnLoginMode ? "Or use your credentials" : "Or use your email address"}
            </div>

            {!isFormOnLoginMode && <><div className="flex justify-between">
              <input
                type="text"
                onChange={(e) => {
                  setSignupFields({
                    ...signupFields,
                    name: e.target.value,
                  });
                }}
                value={signupFields.name}
                placeholder="Your first name"
                className="w-[45%] px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition duration-300"
              />

              <input
              onChange={(e) => {
                setSignupFields({
                  ...signupFields,
                  lastname: e.target.value,
                });
              }}
              value={signupFields.lastname}
                type="text"
                placeholder="Yourlast name"
                className="w-[45%] px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition duration-300"
              />
            </div>

            <div className="mt-4">
              <input
              onChange={(e) => {
                setSignupFields({
                  ...signupFields,
                  email: e.target.value,
                });
              }}
              value={signupFields.email}
                type="text"
                placeholder="Your email address"
                className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition duration-300"
              />
            </div>

            <div className="flex justify-between mt-4">
              <input
              onChange={(e) => {
                setSignupFields({
                  ...signupFields,
                  password: e.target.value,
                });
              }}
              value={signupFields.password}
                type="password"
                placeholder="Password"
                className="w-[45%] px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition duration-300"
              />

              <input
              onChange={(e) => {
                setSignupFields({
                  ...signupFields,
                  confirmpassword: e.target.value,
                });
              }}
              value={signupFields.confirmpassword}
                type="password"
                placeholder="Confirm Password"
                className="w-[45%] px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition duration-300"
              />
            </div></>}


            {isFormOnLoginMode && <><div><input
                type="text"
                onChange={(e) => {
                  setSigninFields({
                    ...signinFields,
                    email: e.target.value,
                  });
                }}
                value={signinFields.email}
                placeholder="Your email"
                className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition duration-300"
              /></div>
              <div><input
                type="password"
                onChange={(e) => {
                  setSigninFields({
                    ...signinFields,
                    password: e.target.value,
                  });
                }}
                value={signinFields.password}
                placeholder="Your pasword"
                className="mt-4 w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition duration-300"
              /></div>
              </>}

            <div>
              <button
                onClick={async () => {
                  setProcessing(true);
                  setErrors([]);

                  if(isFormOnLoginMode) {
                    const result = await signIn("credentials", {
                      redirect: false,
                      email: signinFields.email,
                      password: signinFields.password,
                    });
                      if (result.error) {
                        setErrors(["Invalid Credentials!"]);
                      } else {
                        window.location.href = "/dashboard/projects";
                      }
                      setProcessing(false);
              

                    console.log({result});
                
                    return;
                  }
                  // signupUser(signupFields).then((response) => {
                  //   if (response.success) {
                  //     // redirect to dashboard
                  //   } else {
                  //     setErrors(response.errors);
                  //   }

                  //   setProcessing(false);
                  // });
                  signupUser(signupFields).then((response) => {
                    if (response.success) {
                      // redirect to dashboard
                      console.log(response);
                    } else {
                      setErrors(response.errors);
                    }

                    setProcessing(false);
                  });

                }}
                className="w-full px-6 py-3 mt-4 text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
              >
                {isFormOnLoginMode ? "Sign In" : "Sign Up"}
              </button>

              <div className="flex justify-center my-4">
                <a
                onClick={() => {
                  setErrors([]);
                  setisFormOnLoginMode(!isFormOnLoginMode);
                }}
                className="flex underline mt-2 text-slate-500 text-center cursor-pointer">
                  {isFormOnLoginMode ? "I don't have an account" : "I already have an account"}
                </a>
              </div>

              <div>
                {errors.map((error,index) => (<p key={index} className="bg-red-500 text-center rounded-md p-1 text-white">{error}</p>))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
