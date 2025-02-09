"use client";
export default function Login() {
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
          <div className="flex-col bg-white p-4 rounded-lg">
            <div className="text-center">
              <span className="text-slate-500">
                Authentication | Account Creation
              </span>
            </div>
            <div className="flex">
              <div className="flex items-center w-1/3">
                <div className="h-[1px] bg-slate-400 w-full opacity-40"></div>
              </div>
              <div className="flex w-1/3 txt-center h-[4em] items-center justify-center text-slate-600">
                Quick Signup
              </div>

              <div className="flex items-center w-1/3">
                <div className="h-[1px] bg-slate-400 w-full opacity-40"></div>
              </div>
            </div>

            <div>
              <button className="flex w-full justify-center bg-blue-400 text-white items-center px-6 py-3 border rounded-lg shadow-md hover:shadow-lg hover:bg-gray-50 transition">
                <img
                  src="https://www.svgrepo.com/show/355037/google.svg"
                  alt="Google"
                  className="w-6 h-6 mr-3"
                />
                <span className="text-white font-medium">
                  Sigup in with Google
                </span>
              </button>
            </div>

            <div className="text-center text-slate-400 my-[2em]">
              Or use your email address
            </div>

            <div className="flex justify-between">
              <input
                type="text"
                placeholder="Your first name"
                className="w-[45%] px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition duration-300"
              />

              <input
                type="text"
                placeholder="Your first name"
                className="w-[45%] px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition duration-300"
              />
            </div>

            <div className="mt-4">
              <input
                type="text"
                placeholder="Your email address"
                className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition duration-300"
              />
            </div>

            <div className="mt-4">
              <input
                type="password"
                placeholder="Your last name"
                className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition duration-300"
              />
            </div>

            <div>
              <button className="w-full px-6 py-3 mt-4 text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300">
                Sign Up
              </button>

              <div className="flex justify-center my-4">
                <a className="flex underline mt-2 text-slate-500 text-center">
                  I already have an account
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
