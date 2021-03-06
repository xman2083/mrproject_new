import axios from "axios";
import store from "../store/index.js";
import { getAuthFromCookie } from "../utils/cookies.js";

// basic config for axios
const APP_URL =
  "https://bjey314qaa.execute-api.ap-northeast-2.amazonaws.com/inner_seat/";

// instance & interceptor
function create(url, options) {
  const instance = axios.create(
    Object.assign(
      {
        baseURL: url,
      },
      options
    )
  );
  return instance;
}

function createWithAuth(url, options) {
  const instance = axios.create(
    Object.assign(
      {
        baseURL: url,
      },
      options
    )
  );
  instance.interceptors.request.use(
    config => {
      config.headers.Authorization =
        store.getters["userToken"] || getAuthFromCookie();
      return config;
    },
    error => {
      return Promise.reject(error.response);
    }
  );
  instance.interceptors.response.use(
    config => {
      return config;
    },
    error => {
      return Promise.reject(error.response);
    }
  );
  return instance;
}

const auth = create(APP_URL);
const rsv = createWithAuth(APP_URL);

function sendOtp(data) {
  try {
    return auth.post("sendotp", JSON.stringify(data));
  } catch (error) {
    console.log(error);
    return error;
  }
}
// users
function loginUser(data) {
  try {
    return auth.post("login", JSON.stringify(data));
  } catch (error) {
    console.log(error);
    return error;
  }
}
// 식단표 API
function getMenuData(data) {
  try {
    return rsv.post("getmenu", JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
}
function getHolidayData(data) {
  try {
    return rsv.post("gethldy", JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
}

//회원 가입 API
function signupUser(data) {
  try {
    return auth.post("signup", data);
  } catch (error) {
    console.log(error);
    return error;
  }
}
//예약 정보 API
function RsvDataApi(data) {
  try {
    // console.log("rsv input in API", data);
    if (data.httpMethod == "SELECT") {
      console.log("managersvdata");
      return rsv.post("managersvdata", JSON.stringify(data));
    } else if (data.rsvdata.rsv_type == "0" || data.rsvdata.rsv_type == "1") {
      console.log("managersvrptdata");
      return rsv.post("managersvrptdata", JSON.stringify(data));
    } else {
      console.log("managersvdata");
      return rsv.post("managersvdata", JSON.stringify(data));
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}
//회의실 정보 API
function getRoomData(data) {
  try {
    return rsv.post("getroomdata", JSON.stringify(data));
  } catch (error) {
    console.log(error);
    return error;
  }
}

function getUserData(data) {
  try {
    return rsv.post("getuserdata", JSON.stringify(data));
  } catch (error) {
    console.log(error);
    return error;
  }
}

function getMyRsvData(data) {
  try {
    return rsv.post("getmyrsvdata", JSON.stringify(data));
  } catch (error) {
    console.log(error);
    return error;
  }
}

function getInfo(data) {
  try {
    return rsv.post("getempinfo", JSON.stringify(data));
  } catch (error) {
    console.log(error);
    return error;
  }
}


export {
  loginUser,
  sendOtp,
  signupUser,
  RsvDataApi,
  getRoomData,
  getMenuData,
  getHolidayData,
  getUserData,
  getMyRsvData,
  getInfo
};
