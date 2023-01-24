// import { call, put, takeLatest } from 'redux-saga/effects'
// import http from '../../../server_clients/http';
// import {actions} from './reducer';
//
// function* login(action) {
//    try {
//       const response = yield call(() => {
//          return http.post('/auth/login', action.payload);
//       });
//
//       localStorage.setItem('token', response.data.token);
//       delete response.data.token;
//
//       yield put(actions.isLoginSuccess(response.data));
//    } catch (e) {
//       console.log(e.request.response);
//       debugger;
//
//       yield put({type: "USER_FETCH_FAILED", message: e.message});
//    }
// }
//
// function* mySaga() {
//    yield takeLatest(actions.loginRequest, login);
// }
//
// export default mySaga;