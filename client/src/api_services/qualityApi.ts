import axios from "axios";

const API_URL = "http://localhost:4567/api/queen-quality-checks";

function authHeaders(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function getQualityChecks(token: string) {
  const response = await axios.get(
    API_URL,
    authHeaders(token)
  );

  return response.data;
}

export async function createQualityCheck(
  token: string,
  data: {
    assignmentId: number;
    broodPattern: number;
    temperament: number;
    productivity: number;
    health: number;
  }
) {
  const response = await axios.post(
    API_URL,
    data,
    authHeaders(token)
  );

  return response.data;
}