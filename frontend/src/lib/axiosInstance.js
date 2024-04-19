// Import the Axios library, which is used for making HTTP requests.
import axios from "axios";
import { cookies } from "next/headers";
import { refreshToken } from "./api";

// Define the base URL for the Axios instance. This uses an environment variable for flexibility,
// defaulting to "http://localhost:1337" if the environment variable is not set.
// This is useful for differentiating between development and production environments.
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

// Create a customized instance of Axios with the defined base URL.
// This instance will inherit all the default settings of Axios, but will use the specified baseURL
// for all the requests, making it unnecessary to repeatedly specify the baseURL in every request.
const axiosInstance = axios.create({
  baseURL,
});

// Define an interceptor to handle responses.
axiosInstance.interceptors.response.use(
  // Success handler: Return the response data.
  (result) => result.data,
  // Error handler: Handle errors in the response.
  async (error) => {
    const { response } = error;

    // Check if user is Unauthorized.
    if (response && response.status === 401) {
      const refresh_token = cookies().get("refresh_token")?.value;
      if (refresh_token) {
        try {
          // Attempt to refresh the access token using the refresh token.
          const loginResponse = await refreshToken(refresh_token);
          const originalRequest = error.config;

          // Set the new access token in the request headers.
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${loginResponse.access_token}`;

          // Retry the original request with the new access token
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("Error refreshing access token:");
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(response);
    } else if (error.request) {
      return Promise.reject(error.request);
    } else {
      return Promise.reject(error.message);
    }
  }
);

// Export the customized Axios instance for use throughout the application.
// This allows for a consistent configuration and simplifies making API requests by
// pre-configuring the base part of the request URLs.
export default axiosInstance;
