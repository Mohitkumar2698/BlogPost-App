import { createContext } from "react";
import api from "../utils/api.js";
import { normalizeApiError } from "../utils/error.js";

export const UserContext = createContext();

const UserState = (props) => {
  const handleError = (error, fallbackMessage) =>
    normalizeApiError(error, fallbackMessage);

  async function registerUser(data) {
    try {
      const apiData = await api.post(`/register`, data);
      return apiData.data;
    } catch (error) {
      return handleError(error, "Unable to register right now.");
    }
  }

  async function loginUser(data) {
    try {
      const apiData = await api.post(`/login`, data);
      return apiData.data;
    } catch (error) {
      return handleError(error, "Unable to login right now.");
    }
  }

  async function getUser(username) {
    try {
      const apiData = await api.get(`/profile/${username}`);
      return apiData.data.data;
    } catch (error) {
      return handleError(error, "Failed to fetch user profile.").message;
    }
  }

  async function logoutUser() {
    try {
      const apiData = await api.post("/logout");
      return apiData.data;
    } catch (error) {
      return handleError(error, "Unable to logout right now.");
    }
  }

  async function getCurrentUser() {
    try {
      const apiData = await api.get("/me");
      return apiData.data;
    } catch (error) {
      return handleError(error, "Unable to verify session.");
    }
  }

  async function toggleFollowUser(username) {
    try {
      const apiData = await api.patch(`/users/${username}/follow`);
      return apiData.data;
    } catch (error) {
      return handleError(error, "Unable to follow user right now.");
    }
  }

  async function getNotifications() {
    try {
      const apiData = await api.get("/notifications");
      return apiData.data;
    } catch (error) {
      return handleError(error, "Unable to fetch notifications.");
    }
  }

  async function markNotificationRead(id) {
    try {
      const apiData = await api.patch(`/notifications/${id}/read`);
      return apiData.data;
    } catch (error) {
      return handleError(error, "Unable to update notification.");
    }
  }

  async function createReport(payload) {
    try {
      const apiData = await api.post("/reports", payload);
      return apiData.data;
    } catch (error) {
      return handleError(error, "Unable to submit report.");
    }
  }

  async function getReports() {
    try {
      const apiData = await api.get("/admin/reports");
      return apiData.data;
    } catch (error) {
      return handleError(error, "Unable to fetch reports.");
    }
  }

  async function updateReportStatus(id, payload) {
    try {
      const apiData = await api.patch(`/admin/reports/${id}`, payload);
      return apiData.data;
    } catch (error) {
      return handleError(error, "Unable to update report.");
    }
  }

  return (
    <UserContext.Provider
      value={{
        getUser,
        registerUser,
        loginUser,
        getCurrentUser,
        logoutUser,
        toggleFollowUser,
        getNotifications,
        markNotificationRead,
        createReport,
        getReports,
        updateReportStatus,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;
