import { apiSlice } from "../apiSlice";
import { supabase } from "@/api/client";

const RestaurantApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createSignUpApi: builder.mutation({
      async queryFn(arg, _api, _extraOptions, _baseQuery) {
        try {
          // Perform Supabase signup
          const { data, error } = await supabase.auth.signUp({
            email: arg.email,
            password: arg.password,
          });

          if (error) {
            // Transform Supabase error to RTK Query-compatible error
            return {
              error: {
                status: error.status || 400, // Default status if not provided
                statusText: error.message,
                data: error,
              },
            };
          }

          // Return data in RTK Query format
          return { data };
        } catch (err: any) {
          // Handle unexpected runtime errors
          return {
            error: {
              status: 500,
              statusText: "Internal Server Error",
              data: { message: err.message || "An unknown error occurred" },
            },
          };
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useCreateSignUpApiMutation } = RestaurantApi;
export default RestaurantApi.reducer;
