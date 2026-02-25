import Swal from "sweetalert2";

const toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
});

export const alertSuccess = (title) => toast.fire({ icon: "success", title });

export const alertError = (title) => toast.fire({ icon: "error", title });

export const alertInfo = (title) => toast.fire({ icon: "info", title });
