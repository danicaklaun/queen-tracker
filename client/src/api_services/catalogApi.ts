import axios from "axios";

const API_URL = "http://localhost:4567/api/catalogs";

export async function getHiveTypes(token: string) {
  const response = await axios.get(`${API_URL}/hive-types`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function getQueenBreeds(token: string) {
  const response = await axios.get(`${API_URL}/queen-breeds`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}