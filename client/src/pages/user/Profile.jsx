import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserState";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import Input from "../../components/ui/input";
import Alert from "../../components/ui/alert";
import Badge from "../../components/ui/badge";

const Profile = () => {
  const { getUser } = useContext(UserContext);
  const [error, setError] = useState(null);
  const username = localStorage.getItem("username");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handlePic = async (e) => {
    const profilePic = e.target.files[0];
    if (!profilePic) return;
    if (profilePic.size > 200000) {
      toast.error("File is too big");
    } else {
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
      } catch {
        toast.error("Unable to update profile picture.");
      }
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const apiData = await getUser(username);
      if (typeof apiData === "string") {
        setError(apiData);
        return;
      }
      if (apiData.profilePic) {
        localStorage.setItem("profilePic", apiData.profilePic);
      }
      setUser(apiData);
    };
    fetchUser();
  }, [getUser, username]);
  return (
    <div className="bg-gray-100 min-h-125 flex justify-center items-center py-10 px-4">
      {error ? (
        <div className="w-full max-w-xl">
          <Alert variant="error" title="Profile unavailable">
            {error}
          </Alert>
        </div>
      ) : !user ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-5xl text-teal-700" />
        </div>
      ) : (
        <Card className="w-full max-w-3xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center items-center gap-8">
            <div className="h-28 w-28 md:h-32 md:w-32 text-white rounded-full flex items-center justify-center text-5xl font-bold bg-teal-700 overflow-hidden">
            {user.profilePic ? (
              <img
                src={user.profilePic}
                className="h-full w-full rounded-full"
              />
            ) : (
              user.username.charAt(0).toUpperCase()
            )}
            </div>
            <div className="w-full max-w-xs">
              <label className="text-sm text-slate-600 block mb-1">Update profile picture</label>
              <Input
              type="file"
              name="profilePic"
              className="h-auto py-2"
              onChange={handlePic}
            />
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              <p className="font-semibold text-teal-700">
                Username:
                <Input
                readOnly
                value={user.username}
                className="mt-1 bg-slate-100"
                />
              </p>
              <p className="font-semibold text-teal-700">
                Email:
                <Input
                readOnly
                value={user.email}
                className="mt-1 bg-slate-100"
                />
              </p>
              <p className="font-semibold text-teal-700">
                Blogs:
                <Input
                readOnly
                value={user.blogs}
                className="mt-1 bg-slate-100"
                />
              </p>
              <p className="font-semibold text-teal-700">
                Role:
                <Input
                readOnly
                value={user.role}
                className="mt-1 bg-slate-100"
                />
              </p>
            </div>
            <Badge variant="secondary">Signed in as {user.username}</Badge>
          </CardContent>
        </Card>
      )}
      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default Profile;
