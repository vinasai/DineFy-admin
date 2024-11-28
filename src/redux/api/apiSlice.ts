// src/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "" }), // baseUrl is unused but required
  endpoints: () => ({}), // No endpoints defined here; they’ll be injected
});

// Export the entire apiSlice to allow for dynamic endpoint injection
export default apiSlice;
