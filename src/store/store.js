import { configureStore } from "@reduxjs/toolkit";
import goalsReducer from "./goalsSlice";
import uiReducer from "./uiSlice";
import configReducer from "./configSlice";
import authReducer from "./authSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        goals: goalsReducer,
        ui: uiReducer,
        config: configReducer,
    }
});

export default store;
