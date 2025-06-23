
import { apiSlice } from "../services/apiSlice";


// const siteApiSlice = apiSlice.injectEndpoints({
//     endpoints: builder => ({

  
//     customFetch: builder.mutation({
//       query: ({ url, method = 'GET', body = null, headers = {} }) => ({
//         url,
//         method,        
//         headers,
//       }),
//     }),
//     }),     

// })


// export const { useCustomFetchMutation } = siteApiSlice;





const siteApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
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
});

export const {
  useCustomFetchMutation,
} = siteApiSlice;
