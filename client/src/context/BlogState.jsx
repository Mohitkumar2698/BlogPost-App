import { createContext } from "react";
import api from "../utils/api";
import { normalizeApiError } from "../utils/error";

export const BlogContext = createContext();

const BlogState = (props) => {
  const handleError = (error, fallbackMessage) =>
    normalizeApiError(error, fallbackMessage);

  async function getRequest(route) {
    try {
      const apiData = await api.get(`/${route}`);
      return apiData.data;
    } catch (error) {
      return handleError(error, "Unable to fetch data right now.");
    }
  }

  async function postBlog(data) {
    try {
      const apiData = await api.post(`/post`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return apiData.data;
    } catch (error) {
      return handleError(error, "Unable to post blog right now.");
    }
  }

  async function editBlog(id, data) {
    try {
      const apiData = await api.patch(`/edit/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return apiData.data;
    } catch (error) {
      return handleError(error, "Unable to edit blog right now.");
    }
  }

  async function deleteBlog(id) {
    try {
      const apiData = await api.delete(`/${id}`);
      return apiData.data;
    } catch (error) {
      return handleError(error, "Unable to delete blog right now.");
    }
  }

  async function getFeed(type = "for-you") {
    try {
      const apiData = await api.get(`/feed/${type}`);
      return apiData.data;
    } catch (error) {
      return handleError(error, "Unable to fetch feed right now.");
    }
  }

  async function toggleLikeBlog(id) {
    try {
      const apiData = await api.patch(`/blogs/${id}/like`);
      return apiData.data;
    } catch (error) {
      return handleError(error, "Unable to toggle like right now.");
    }
  }

  async function toggleBookmarkBlog(id) {
    try {
      const apiData = await api.patch(`/blogs/${id}/bookmark`);
      return apiData.data;
    } catch (error) {
      return handleError(error, "Unable to toggle bookmark right now.");
    }
  }

  async function getBookmarkedBlogs() {
    try {
      const apiData = await api.get(`/bookmarks`);
      return apiData.data;
    } catch (error) {
      return handleError(error, "Unable to fetch bookmarks right now.");
    }
  }

  async function getComments(blogId) {
    try {
      const apiData = await api.get(`/blogs/${blogId}/comments`);
      return apiData.data;
    } catch (error) {
      return handleError(error, "Unable to fetch comments right now.");
    }
  }

  async function addComment(blogId, payload) {
    try {
      const apiData = await api.post(`/blogs/${blogId}/comments`, payload);
      return apiData.data;
    } catch (error) {
      return handleError(error, "Unable to add comment right now.");
    }
  }

  async function toggleLikeComment(commentId) {
    try {
      const apiData = await api.patch(`/comments/${commentId}/like`);
      return apiData.data;
    } catch (error) {
      return handleError(error, "Unable to toggle comment like right now.");
    }
  }

  async function deleteComment(commentId) {
    try {
      const apiData = await api.delete(`/comments/${commentId}`);
      return apiData.data;
    } catch (error) {
      return handleError(error, "Unable to delete comment right now.");
    }
  }

  return (
    <BlogContext.Provider
      value={{
        getRequest,
        getFeed,
        postBlog,
        editBlog,
        deleteBlog,
        toggleLikeBlog,
        toggleBookmarkBlog,
        getBookmarkedBlogs,
        getComments,
        addComment,
        toggleLikeComment,
        deleteComment,
      }}
    >
      {props.children}
    </BlogContext.Provider>
  );
};

export default BlogState;
