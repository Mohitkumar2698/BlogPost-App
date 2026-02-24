import { createContext } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
import api from "../utils/api.js";

export const UserContext = createContext();

const UserState = (props) => {

  async function registerUser(data) {
    try {
      const apiData = await api.post(`/register`, data);
      return apiData.data;
    } catch (error) {
      return error.response.data;
    }
  }

  async function loginUser(data) {
    try {
      const apiData = await api.post(`/login`, data);
      return apiData.data;
    } catch (error) {
      return error.response.data;
    }
  }

  async function getUser(username) {
    try {
      const apiData = await api.get(`/profile/${username}`, {
        withCredentials: true,
      });
      return apiData.data.data;
    } catch (error) {
      return error.response.data.message;
    }
  }
  return (
    <UserContext.Provider
      value={{
        getUser,
        registerUser,
        loginUser,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;
