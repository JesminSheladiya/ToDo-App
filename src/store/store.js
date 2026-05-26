import { configureStore } from "@reduxjs/toolkit";
import goalsReducer from "./goalsSlice";
import uiReducer from "./uiSlice";

const store = configureStore({
    reducer: {
        goals: goalsReducer,
        ui: uiReducer
    }
});

export default store;
