import axios from "axios";

const API_URL = "http://localhost:4567/api/dashboard";

export async function getDashboard(token: string) {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}