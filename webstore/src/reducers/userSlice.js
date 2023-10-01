import {createSlice} from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: 'user',
    initialState: {
        first_name: null, last_name: null, address: null
    },
    reducers: {
        setUserInfo: (state, action) => {
            const { first_name, last_name, address } = action.payload
            state.first_name = first_name
            state.last_name = last_name
            state.address = address
        },
        logOut: (state, action) => {
            state.first_name = null
            state.last_name = null
            state.address = null
        }
    }
})

export const { setUserInfo, logOut } = userSlice.actions

export default userSlice.reducer