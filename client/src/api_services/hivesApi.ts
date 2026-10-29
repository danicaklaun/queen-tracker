import axios from "axios";

const API_URL = "http://localhost:4567/api/hives";

export async function getHives(token: string) {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function createHive(token: string, data: unknown) {
  const response = await axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function archiveHive(token: string, id: number) {
  const response = await axios.patch(
    `${API_URL}/${id}/archive`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}