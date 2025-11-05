import apiAxios from "./apiConnector";

// REGISTER a new user
export const registerUser = async (name, email, password) => {
  return await apiAxios.post("api/auth/register", { name, email, password });
};

// LOGIN an existing user
export const loginUser = async (email, password) => {
  return await apiAxios.post("api/auth/login", { email, password });
};
