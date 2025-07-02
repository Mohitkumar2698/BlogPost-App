import React from "react";
import { FaSuperpowers } from "react-icons/fa";

const Error = () => {
  return (
    <div className="min-h-130 bg-gray-100 flex justify-center items-center px-4">
      <div className="flex flex-col md:flex-row items-center gap-6 bg-white shadow-lg p-8 rounded-lg">
        <FaSuperpowers className="text-6xl text-slate-800 animate-spin" />
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold text-red-600 mb-2">Error 404</h1>
          <p className="text-lg text-gray-700">Oh no! This page cannot be found.</p>
          <p className="text-gray-600">Please check the URL and try again.</p>
        </div>
      </div>
    </div>
  );
};

export default Error;
