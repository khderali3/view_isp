
import { apiSlice } from "../services/apiSlice";


const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

     verify: builder.mutation({
        query: () => ({
            url: '/auth/verify/',
            method: 'POST',
        })
     }),
     logout: builder.mutation({
        query: () => ({
            url: '/auth/logout/',
            method: 'POST',
        })
     }),


     customFetch: builder.mutation({
        query: ({ url, method = 'GET', body = null, headers = {} }) => {
          // Conditionally include the body only if it's not null
          const requestConfig = {
            url,
            method,
            headers,
          };
  
          // If `body` is not null, include it in the request
          if (body !== null) {
            requestConfig.body = body;
          }

          return requestConfig;
        },
      }),


    }),     

})

export const {

    useVerifyMutation,
    useLogoutMutation,
    useCustomFetchMutation

} = authApiSlice