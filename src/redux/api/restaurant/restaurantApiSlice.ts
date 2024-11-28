import { apiSlice } from "../apiSlice";
import { supabase } from "@/api/client";

const RestaurantApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRestaurantApi: builder.query({
      // Fetch data from the "Restaurant" table
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        const { data, error } = await supabase.from("restaurant").select("*");

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
    createRestaurantApi: builder.mutation({
      async queryFn(restaurantData, _api, _extraOptions, _baseQuery) {
        const { data, error } = await supabase.from("restaurant").insert([restaurantData]);
    
        if (error) {
          console.error("Error inserting restaurant into Supabase:", error);
          return {
            error: {
              status: 500,
              statusText: "Error while inserting restaurant data",
              data: error.message,
            },
          };
        }
    
        return { data }; // Returning the inserted data
      },
    }),
    
    
    
    

    updateRestaurantApi: builder.mutation({
      // Update existing data in the "Restaurant" table
      async queryFn(arg, _api, _extraOptions, _baseQuery) {
        const { id, ...updateData } = arg; // Extract ID and data to update
        const { data, error } = await supabase
          .from("restaurant")
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

    deleteRestaurantApi: builder.mutation({
      // Delete a row in the "Restaurant" table by ID
      async queryFn(id, _api, _extraOptions, _baseQuery) {
        const { data, error } = await supabase
          .from("restaurant")
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
  useGetRestaurantApiQuery,
  useCreateRestaurantApiMutation,
  useUpdateRestaurantApiMutation,
  useDeleteRestaurantApiMutation,
} = RestaurantApi;
export default RestaurantApi.reducer;
