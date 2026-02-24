import { createContext } from "react";
import axios from "axios";
import api from "../utils/api";
axios.defaults.withCredentials = true;

export const BlogContext = createContext();

const BlogState = (props) => {
  async function getRequest(route) {
    try {
      const apiData = await api.get(`/${route}`);
      return apiData.data;
    } catch (error) {
      return error.response.data;
    }
  }

  async function postBlog(data) {
    try {
      const apiData = await api.post(`/post`, data);
      return apiData.data;
    } catch (error) {
      return error.response.data;
    }
  }

  async function editBlog(id, data) {
    try {
      const apiData = await api.patch(`/edit/${id}`, data);
      return apiData.data;
    } catch (error) {
      return error.response.data;
    }
  }
  return (
    <BlogContext.Provider
      value={{
        getRequest,
        postBlog,
        editBlog,
      }}
    >
      {props.children}
    </BlogContext.Provider>
  );
};

export default BlogState;
