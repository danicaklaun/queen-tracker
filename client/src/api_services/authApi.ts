import axios from "axios";
import type { AuthResponse } from "../types/auth";

const API_URL = "http://localhost:4567/api/auth";
export async function login(username: string, password: string) {
  const response = await axios.post<AuthResponse>(`${API_URL}/login`, {
    username,
    password,
  });

  return response.data;
}

export async function register(data: {
  username: string;
  fullName: string;
  email: string;
  password: string;
}) {
  const response = await axios.post<AuthResponse>(`${API_URL}/register`, data);

  return response.data;
}

export async function logout(token: string) {
  const response = await axios.post(
    `${API_URL}/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}