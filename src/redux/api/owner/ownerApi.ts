import { apiSlice } from "../apiSlice";
import { supabase } from "@/api/client";

const ownerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOwnerApi: builder.query({
      // Fetch data from the "owner" table
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        const { data, error } = await supabase.from("owner").select("*");

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

    createOwnerApi: builder.mutation({
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

    updateOwnerApi: builder.mutation({
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

    deleteOwnerApi: builder.mutation({
      // Delete a row in the "owner" table by ID
      async queryFn(id, _api, _extraOptions, _baseQuery) {
        const { data, error } = await supabase
          .from("owner")
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
  useGetOwnerApiQuery,
  useCreateOwnerApiMutation,
  useUpdateOwnerApiMutation,
  useDeleteOwnerApiMutation,
} = ownerApi;
export default ownerApi.reducer;
