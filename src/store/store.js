import { configureStore } from "@reduxjs/toolkit";
import goalsReducer from "./goalsSlice";
import uiReducer from "./uiSlice";
import configReducer from "./configSlice";

const store = configureStore({
    reducer: {
        goals: goalsReducer,
        ui: uiReducer,
        config: configReducer
    }
});

export default store;
