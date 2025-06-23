
import { apiSlice } from "../services/apiSlice";


const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
    retrieveUser : builder.query({
        query:  () => '/users/me/'
    }),
    
    google : builder.mutation({
        query:  ({state, code}) => ({
            url: `/o/google-oauth2/?state=${encodeURIComponent(state)}&code=${encodeURIComponent(code)}`,
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
     }),
     login: builder.mutation({
        query: ({email, password, recaptcha_value}) => ({
            url: '/jwt/create/',
            method: 'POST',
            body: {email, password, recaptcha_value}
        })
     }),
     register: builder.mutation({
        query: ({first_name, last_name, email, password, re_password, recaptcha_value}) => ({
            url: '/users/',
            method: 'POST',
            body: {first_name, last_name, email, password, re_password, recaptcha_value}
        })
     }),
     verify: builder.mutation({
        query: () => ({
            url: '/jwt/verify/',
            method: 'POST',
        })
     }),
     logout: builder.mutation({
        query: () => ({
            url: '/logout/',
            method: 'POST',
        })
     }),
     activation: builder.mutation({
        query: ({uid, token}) => ({
            url: '/users/activation/',
            method: 'POST',
            body: { uid, token }
        })
     }),   
     resetPassword: builder.mutation({
        query: ({email, recaptcha_value}) => ({
            url: '/users/reset_password/',
            method: 'POST',
            body: { email, recaptcha_value }
        })
     }),     
     resetPasswordConfirm: builder.mutation({
        query: ({uid, token, new_password, re_new_password}) => ({
            url: '/users/reset_password_confirm/',
            method: 'POST',
            body: { uid, token, new_password, re_new_password },
        }),
    }),

    changePassword: builder.mutation({
        query: ({new_password, re_new_password, current_password}) => ({
            url: '/users/set_password/',
            method: 'POST',
            body: { new_password, re_new_password, current_password},
        }),
    }),



    }),     

})

export const {
    useRetrieveUserQuery,
    useGoogleMutation,
    useLoginMutation,
    useRegisterMutation,
    useVerifyMutation,
    useLogoutMutation,
    useActivationMutation,
    useResetPasswordMutation,
    useResetPasswordConfirmMutation,
    useChangePasswordMutation,
} = authApiSlice