import axios from "axios";

const API_URL = "http://localhost:4567/api/admin";

function authHeaders(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function getUsers(token: string) {
  const response = await axios.get(`${API_URL}/users`, authHeaders(token));
  return response.data;
}

export async function getAuditLogs(token: string) {
  const response = await axios.get(`${API_URL}/audit-logs`, authHeaders(token));
  return response.data;
}

export async function createHiveType(
  token: string,
  data: {
    name: string;
    description: string;
  }
) {
  const response = await axios.post(
    `${API_URL}/hive-types`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function deactivateHiveType(
  token: string,
  id: number
) {
  const response = await axios.patch(
    `${API_URL}/hive-types/${id}/deactivate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}
export async function createQueenBreed(
  token: string,
  data: {
    name: string;
    description: string;
  }
) {
  const response = await axios.post(
    `${API_URL}/queen-breeds`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}
export async function deactivateQueenBreed(
  token: string,
  id: number
) {
  const response = await axios.patch(
    `${API_URL}/queen-breeds/${id}/deactivate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function updateUserRole(
  token: string,
  id: number,
  role: string
) {
  const response = await axios.patch(
    `${API_URL}/users/${id}/role`,
    { role },
    authHeaders(token)
  );

  return response.data;
}
export async function deactivateUser(
  token: string,
  id: number
) {
  const response = await axios.patch(
    `${API_URL}/users/${id}/deactivate`,
    {},
    authHeaders(token)
  );

  return response.data;
}