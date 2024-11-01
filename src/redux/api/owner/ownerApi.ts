import { apiSlice } from "../apiSlice";
import { supabase } from "@/api/client";

const ownerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOwnerApi: builder.query({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        const { data, error } = await supabase.from("owner").select("*");

        if (error) {
          return {
            error: {
              status: 500,
              statusText: "Error while get Table data",
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

export const { useGetOwnerApiQuery } = ownerApi;
export default ownerApi.reducer;
