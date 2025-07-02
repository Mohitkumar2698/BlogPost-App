import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserState";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { getUser } = useContext(UserContext);
  const [error, setError] = useState(null);
  const username = localStorage.getItem("username");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handlePic = async (e) => {
    const profilePic = e.target.files[0];
    if (e.target.files[0].size > 200000) {
      toast.error("File is too big");
    } else {
      console.log(profilePic);

      try {
        const apiResponse = await axios.patch(
          `http://localhost:4000/api/v1/profile/edit/${username}`,
          { profilePic },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success(apiResponse.data.message);
        navigate(0);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const apiData = await getUser(username);
      if (typeof apiData == "string") {
        setError(apiData);
      }
      if (apiData.profilePic) {
        localStorage.setItem("profilePic", apiData.profilePic);
      }
      setUser(apiData);
    };
    fetchUser();
  }, []);
  return (
    <div className="bg-gray-100 min-h-125 flex justify-center items-center py-10 px-4">
      {error ? (
        <div className="text-2xl text-red-500">
          <p>{error}</p>
        </div>
      ) : !user ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-5xl text-teal-700" />
        </div>
      ) : (
        <div className="bg-white black rounded-lg shadow-xl p-8 flex flex-col justify-center items-center gap-10 w-full max-w-3xl">
          {/* Avatar */}
          <div className="h-28 w-28 md:h-32 md:w-32 text-white rounded-full flex items-center justify-center text-5xl font-bold bg-teal-700 overflow-hodden">
            {user.profilePic ? (
              <img
                src={user.profilePic}
                className="h-full w-full rounded-full"
              />
            ) : (
              user.username.charAt(0).toUpperCase()
            )}
            <input
              type="file"
              name="profilePic"
              className="fixed text-[0.8rem] text-black right-128 top-90 cursor-pointer"
              onChange={handlePic}
            />
          </div>
          {/* Info */}
          <div className="text-xl mt-4 md:text-2xl grid grid-cols-2 gap-y-2 gap-x-30">
            <p className="font-semibold flex text-teal-700">
              Username:
              <input
                readOnly
                value={user.username}
                className="text-black ml-2 pl-4 bg-gray-300 rounded text-[0.9rem] p-1 placeholder:black/50"
              ></input>{" "}
            </p>
            <p className="font-semibold flex text-teal-700">
              Email:
              <input
                readOnly
                value={user.email}
                className="text-black ml-2 pl-4 bg-gray-300 rounded text-[0.9rem] p-1 placeholder:black/50"
              ></input>{" "}
            </p>
          </div>
        </div>
      )}
      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default Profile;
