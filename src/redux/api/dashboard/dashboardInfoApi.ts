import { apiSlice } from "../apiSlice";
import { supabase } from "@/api/client";


const dashboardInfoApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      getOfferApi: builder.query({
          async queryFn(_arg, _api, _extraOptions, _baseQuery) {
          const { data, error } = await supabase
            .from("offer")
            .select(`
              title,
              created_at,
              valid_until,
              restaurant:restaurant_id (name)
            `)
            .order("created_at", { ascending: false }).
            limit(7);
        
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
        }
      }),
  
      getNotificationApi: builder.query({
        // Insert new data into the "owner" table
        async queryFn(_arg, _api, _extraOptions, _baseQuery) {
          const { data, error } = await supabase.from("notification").select(`message, created_at, restaurant:restaurant_id (name)`)
          .order("created_at", { ascending: false })
          .limit(5);
  
          if (error) {
            return {
              error: {
                status: 500,
                statusText: "Error while fetching",
                data: error.message,
              },
            };
          }
  
          return { data };
        },
      }),

    getStatisticsApi: builder.query({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        try {
            const [restaurantCount, ownerCount, profileCount, offerCount, notificationCount] = await Promise.all([
                await supabase.from("restaurant").select('*', { count: "exact" }),
                await supabase.from("owner").select('*',  { count: "exact" }),
                await supabase.from("profiles").select('*', { count: "exact" }),
                await supabase.from("offer").select('*', { count: "exact" }),
                await supabase.from("notification").select('*', { count: "exact" }),
              ]);

              console.log(restaurantCount, ownerCount, profileCount, offerCount, notificationCount);
         
          if (restaurantCount.error || ownerCount.error || profileCount.error || offerCount.error || notificationCount.error) {
            return {
              error: {
                status: 500,
                statusText: "Error while fetching counts",
                data: restaurantCount.error?.message || ownerCount.error?.message || profileCount.error?.message || offerCount.error?.message || notificationCount.error?.message,
              },
            };
          }
    
          const data = {
            restaurantCount: restaurantCount.count,
            ownerCount: ownerCount.count,
            profileCount: profileCount.count,
            offerCount: offerCount.count,
            notificationCount: notificationCount.count,
          };
    
          return { data };
        } catch (error) {
          return {
            error: {
              status: 500,
              statusText: "Error while fetching counts",
              data: error instanceof Error ? error.message : 'An unknown error occurred',
            },
          };
        }
      },
    }),
  
    }),
    overrideExisting: false,
  });
  
  export const {
    useGetOfferApiQuery,
    useGetNotificationApiQuery,
    useGetStatisticsApiQuery,
    
  } = dashboardInfoApi;
  export default dashboardInfoApi.reducer;
  