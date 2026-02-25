export const normalizeApiError = (error, fallbackMessage = "Something went wrong") => {
  if (!error) {
    return { success: false, message: fallbackMessage };
  }

  const data = error.response?.data;
  if (data && typeof data === "object") {
    return {
      ...data,
      success: false,
      message: data.message || data.error || fallbackMessage,
    };
  }

  if (error.request) {
    return {
      success: false,
      message: "Unable to reach server. Please check your internet connection.",
    };
  }

  return {
    success: false,
    message: error.message || fallbackMessage,
  };
};
