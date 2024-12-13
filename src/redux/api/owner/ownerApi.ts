import { apiSlice } from "../apiSlice";
import { supabase } from "@/api/client";

const ownerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOwnerApi: builder.query({
      // Fetch data from the "owner" table
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        const { data, error } = await supabase
        .from("owner")
        .select("*")
        .order("created_at", { ascending: false });

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
      // Insert new data into the "owner" table
      async queryFn(arg, _api, _extraOptions, _baseQuery) {
        try {
          const { data, error } = await supabase
          .from("owner")
          .update({
            name: arg.name,
            email: arg.email,
            country: arg.country,
            address: arg.address,
            contact_no: arg.contact_no,
            restaurants: arg.restaurant_details, 
            active: true,
            password: arg.password,
            plan : arg.plan
          })
          .eq("id", arg.id)
          .select();
    
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
        } catch (err) {
          return {
            error: {
              status: 500,
              statusText: "Unexpected error occurred",
              data: (err as Error).message,
            },
          };
        }
      },
    }),

    updateOwnerProfileApi: builder.mutation({
      async queryFn(arg, _api, _extraOptions, _baseQuery) {
        const [firstName] = arg.name.split(" ");
        const uniqueIdentifier = Date.now(); // Use a timestamp for uniqueness
        const username = `${firstName.toLowerCase()}_${uniqueIdentifier}`;
    
        try {
          const { data, error } = await supabase
            .from("profiles")
            .update({
              username: username, 
              full_name: arg.name, 
              email: arg.email, 
              role: "owner", 
              new_account_flag:true, // Set to true to indicate that this is a new account
            })
            .eq("id", arg.id)
            .select();
    
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
        } catch (err) {
          return {
            error: {
              status: 500,
              statusText: "Unexpected error occurred",
              data: (err as Error).message,
            },
          };
        }
      },
    }),
    

    updateprofilesApi: builder.mutation({
      async queryFn(arg, _api, _extraOptions, _baseQuery) {
        const { id, ...updateData } = arg; // Extract ID and data to update
        const { data, error } = await supabase
          .from("profiles")
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
      }
    }),

    fetchOwnerDataById: builder.mutation({
      async queryFn(arg, _api, _extraOptions, _baseQuery) {
         // Extract ID and data to update
        const { data, error } = await supabase
          .from("owner")
          .select("*")
          .eq("id", arg.id);

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
      }
    }),

    fetchRestaurantDataById: builder.mutation({
      async queryFn(arg, _api, _extraOptions, _baseQuery) {
         // Extract ID and data to update
        const { data, error } = await supabase
          .from("restaurant")
          .select("*")
          .eq("id", arg.id);

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
      }
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
  useUpdateOwnerProfileApiMutation,
  useDeleteOwnerApiMutation,
  useUpdateOwnerApiMutation,
  useFetchOwnerDataByIdMutation,
  useFetchRestaurantDataByIdMutation,
} = ownerApi;
export default ownerApi.reducer;
