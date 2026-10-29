import axios from "axios";

const API_URL = "http://localhost:4567/api/queen-hive-assignments";

export async function getAssignments(token: string) {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function createAssignment(token: string, data: unknown) {
  const response = await axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function endAssignment(token: string, id: number) {
  const response = await axios.patch(
    `${API_URL}/${id}/end`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}