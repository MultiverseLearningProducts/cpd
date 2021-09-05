import { configureStore, createSlice } from '@reduxjs/toolkit'

export const state = {
    controlPanel: null
}
export const actions = {
    openControlPanel: (state, action) => {
        const user = action.payload
        state.controlPanel = user
    },
    closeControlPanel: (state, action) => {
        state.controlPanel = null
    }
}

export const initialState = createSlice({
    name: 'multiverse-cpd',
    initialState: state,
    reducers: actions
})


export const store = configureStore(initialState)