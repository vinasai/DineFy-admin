import { apiSlice } from "../apiSlice";
import { supabase } from "@/api/client";

const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserApi: builder.query({
      // Fetch data from the "owner" table
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        const { data, error } = await supabase.from("profiles").select("*");

        if (error) {
          return {
            error: {
              status: 500,
              statusText: "Error while fetching data",
              data: error.message,
            },
          };
        }

        return { data };
      },
    }),

    createUserApi: builder.mutation({
      // Insert new data into the "owner" table
      async queryFn(arg, _api, _extraOptions, _baseQuery) {
        const { data, error } = await supabase.from("owner").insert(arg);

        if (error) {
          return {
            error: {
              status: 500,
              statusText: "Error while creating entry",
              data: error.message,
            },
          };
        }

        return { data };
      },
    }),

    updateUserApi: builder.mutation({
      // Update existing data in the "owner" table
      async queryFn(arg, _api, _extraOptions, _baseQuery) {
        const { id, ...updateData } = arg; // Extract ID and data to update
        const { data, error } = await supabase
          .from("owner")
          .update(updateData)
          .eq("id", id);

        if (error) {
          return {
            error: {
              status: 500,
              statusText: "Error while updating entry",
              data: error.message,
            },
          };
        }

        return { data };
      },
    }),

    deleteUserApi: builder.mutation({
      // Delete a row in the "owner" table by ID
      async queryFn(id, _api, _extraOptions, _baseQuery) {
        const { data, error } = await supabase
          .from("profiles")
          .delete()
          .eq("id", id);

        if (error) {
          return {
            error: {
              status: 500,
              statusText: "Error while deleting entry",
              data: error.message,
            },
          };
        }

        return { data };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUserApiQuery,
  useCreateUserApiMutation,
  useUpdateUserApiMutation,
  useDeleteUserApiMutation,
} = userApi;

export default userApi.reducer;
