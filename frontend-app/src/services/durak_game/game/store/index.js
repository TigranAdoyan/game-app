import {
    configureStore,
} from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import game_state from './game_state.rc';
import profile from './profile.rc';

let sagaMiddleware = createSagaMiddleware();
const middleware = (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware);

const store = configureStore({
    reducer: {
        game_state: game_state.reducer,
        profile: profile.reducer
    },
    middleware
});

export default store;
