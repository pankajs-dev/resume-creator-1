import Swal from "sweetalert2";

export const confirmDelete = (onConfirm) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You want to delete Resume",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#01536e",
    cancelButtonColor: "red",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Record deleted successfully",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  });
};

export const downloadSWAL = (value) => {
  Swal.fire({
    title: "Download",
    text: `Your ${value} document is getting downloaded.`,
    icon: "success",
    showCancelButton: false,
    confirmButtonColor: "#01536e",
    timer: 3000,
    confirmButtonText: "OK!",
  });
};
