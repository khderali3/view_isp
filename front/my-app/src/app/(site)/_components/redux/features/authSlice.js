import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated : false,
    isLoading: true,
    loginFirstName: '',
    profileImage: '',
    is_staff: false,
    is_superuser: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: state => {
            state.isAuthenticated = true
        },
        logout: state => {
            state.isAuthenticated = false

            state.loginFirstName = ''
            state.profileImage = ''
            
        },
        finishIntialLoad: state => {
            state.isLoading = false
        },
        setloginFirstName: (state, action) => {
            state.loginFirstName = action.payload
        },
        setprofileImage: (state, action) => {
            state.profileImage = action.payload
        },
        setIs_staff: (state, action) => {
            state.is_staff = action.payload
        },

        setIs_superuser: (state, action) => {
            state.is_superuser = action.payload
        },

 

    }
})

export const {setAuth, logout, finishIntialLoad, setloginFirstName, setprofileImage, setIs_staff, setIs_superuser}  = authSlice.actions;
export default authSlice.reducer;