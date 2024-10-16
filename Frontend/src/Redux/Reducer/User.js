import axios from "axios";
export const updateUserInfo = async (userData) => {
  const response = await axios.put(
    "http://localhost:5001/api/user/update-info",
    userData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
  return response.data;
};
