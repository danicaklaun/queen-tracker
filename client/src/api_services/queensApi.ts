import axios from "axios";

const API_URL = "http://localhost:4567/api/queens";

export async function getQueens(token: string) {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function createQueen(token: string, data: unknown) {
  const response = await axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}