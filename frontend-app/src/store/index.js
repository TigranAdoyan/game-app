import {
   configureStore,
} from "@reduxjs/toolkit";
import { all } from 'redux-saga/effects'
import createSagaMiddleware from "redux-saga";
import authReducer from './reducers/auth/reducer';

let sagaMiddleware = createSagaMiddleware();
const middleware = (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware);

const store = configureStore({
   reducer: {
      auth: authReducer.reducer
   },
   middleware
});

function* rootSaga() {
   yield all([
     // authSaga(),
   ])
}

sagaMiddleware.run(rootSaga);
export default store;
