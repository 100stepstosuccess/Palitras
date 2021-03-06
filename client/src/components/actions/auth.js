import axios from "axios";
import jwt from "jsonwebtoken";
import {
  SIGN_UP_SUCCESS,
  SIGN_UP_FAIL,
  SET_AUTHORIZATION,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOG_OUT_BEGIN,
  LOG_OUT_END
} from "./actionTypes";

export function signUpSuccess(data) {
  return {
    type: SIGN_UP_SUCCESS,
    data
  };
}

export function signUpFail(err) {
  return {
    type: SIGN_UP_FAIL,
    err
  };
}

export function loginSuccess(data) {
  return {
    type: LOGIN_SUCCESS,
    data
  };
}

export function loginFail(err) {
  return {
    type: LOGIN_FAIL,
    err
  };
}

export function setAuthorization(value) {
  return {
    type: SET_AUTHORIZATION,
    value
  };
}

export function logOutBegin() {
  return {
    type: LOG_OUT_BEGIN,
    status: true
  };
}

export function logOutEnd() {
  return {
    type: LOG_OUT_END,
    status: false
  };
}

export function checkAuthorization() {
  const AUTH_TOKEN = localStorage.getItem("token");
  const hasToken = Boolean(AUTH_TOKEN);

  const decoded = jwt.decode(AUTH_TOKEN);
  const timeNow = Math.floor(Date.now() / 1000);

  const isExpired = timeNow > (decoded ? decoded.exp : 0);

  const isValidToken = hasToken && !isExpired;

  if (isExpired) {
    localStorage.removeItem("token");
  }

  if (isValidToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${AUTH_TOKEN}`;
  }

  return setAuthorization(isValidToken);
}

export function selectDataFetcher(type, data) {
  switch (type) {
    case "signup":
      return signUp(data);
    case "login":
      return login(data);

    default:
      throw new Error("that type is not found");
  }
}

export function signUp(data) {
  const url = "/api/auth/register";

  return dispatch => {
    axios
      .post(url, data)
      .then(res => {
        localStorage.setItem("token", res.data.jwtoken);

        dispatch(signUpSuccess(res.data));
      })
      .catch(err => {
        dispatch(signUpFail(err.response.data));
      });
  };
}

export function login(data) {
  const url = "/api/auth/login";

  return dispatch => {
    axios
      .post(url, data)
      .then(res => {
        localStorage.setItem("token", res.data.jwtoken);

        dispatch(loginSuccess(res.data));
      })
      .catch(err => {
        dispatch(loginFail(err.response.data));
      });
  };
}

export function removeToken(dispatch) {
  dispatch(logOutBegin());
  localStorage.removeItem("token");
}
