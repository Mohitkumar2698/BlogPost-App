import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserState";
import { FaSpinner } from "react-icons/fa";
import { alertError, alertSuccess } from "../../utils/alerts";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import Input from "../../components/ui/input";
import Alert from "../../components/ui/alert";
import Badge from "../../components/ui/badge";
import api from "../../utils/api";

const Profile = () => {
  const { getUser } = useContext(UserContext);
  const [error, setError] = useState(null);
  const username = localStorage.getItem("username");
  const [user, setUser] = useState(null);

  const handlePic = async (e) => {
    const profilePic = e.target.files[0];
    if (!profilePic) return;
    if (profilePic.size > 200000) {
      alertError("File is too big");
    } else {
      try {
        const formData = new FormData();
        formData.append("profilePic", profilePic);
        const apiResponse = await api.patch(`/profile/edit/${username}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alertSuccess(apiResponse.data.message);
        const refreshed = await getUser(username);
        if (typeof refreshed === "string") {
          alertError(refreshed);
          return;
        }
        if (refreshed?.profilePic) {
          localStorage.setItem("profilePic", refreshed.profilePic);
        }
        setUser(refreshed);
      } catch {
        alertError("Unable to update profile picture.");
      }
    }
  };

  useEffect(() => {
    if (!username) {
      setError("Please login to view your profile.");
      return;
    }

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
    <div className="bg-gradient-to-b from-slate-50 via-white to-cyan-50 min-h-[80vh] py-10 px-4">
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
        <Card className="w-full max-w-4xl mx-auto border-slate-200 shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-black tracking-tight">Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center items-center gap-8">
            <div className="h-28 w-28 md:h-32 md:w-32 text-white rounded-full flex items-center justify-center text-5xl font-bold bg-teal-700 overflow-hidden">
            {user.profilePic ? (
              <img
                src={user.profilePic}
                alt={user.username}
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
            <Badge variant="secondary">Signed in as @{user.username}</Badge>
          </CardContent>
        </Card>
      )}    </div>
  );
};

export default Profile;

