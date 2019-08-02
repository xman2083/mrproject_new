import axios from "axios";
import store from "../store/index.js";
import { getAuthFromCookie } from "../utils/cookies.js";
import localforage from "localforage";

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

function signupUser(data) {
  try {
    return auth.post("signup", data);
  } catch (error) {
    console.log(error);
    return error;
  }
}

// // posts
// function createNewPost(data) {
//   try {
//     return posts.post('/', data);
//   } catch (error) {
//     console.log(error);
//     return error;
//   }
// }

// function fetchPosts() {
//   try {
//     return posts.get('/');
//   } catch (error) {
//     console.log(error);
//     return error;
//   }
// }

function getRsvData(data) {
  try {
    return rsv.post("getrsvdata", JSON.stringify(data));
  } catch (error) {
    console.log(error);
    return error;
  }
}

function delRsvData(data) {
  try {
    return rsv.delete("getrsvdata", JSON.stringify(data));
  } catch (error) {
    console.log(error);
    return error;
  }
}

function editRsvData(data) {
  try {
    return rsv.put("getrsvdata", JSON.stringify(data));
  } catch (error) {
    console.log(error);
    return error;
  }
}

//회의실 정보
function getRoomData(data) {
  try {
    return rsv.post("getroomdata", JSON.stringify(data));
  } catch (error) {
    console.log(error);
    return error;
  }
}


// function fetchPostById(id) {
//   try {
//     return posts.get(id);
//   } catch (error) {
//     console.log(error);
//     return error;
//   }
// }

// function editPostById(id, data) {
//   try {
//     return posts.put(id, data);
//   } catch (error) {
//     console.log(error);
//     return error;
//   }
// }

// function deletePostById(id) {
//   try {
//     return posts.delete(id);
//   } catch (error) {
//     console.log(error);
//     return error;
//   }
// }

const RSVDATA_NAMESPACE = "RSV-";

const fetchRsvDataApi = () => {
  return localforage.startsWith(RSVDATA_NAMESPACE).then(res => {
    return res;
  });
};

const saveRsvData = rsvdata => {
  return localforage
    .setItem(RSVDATA_NAMESPACE + rsvdata.id, rsvdata)
    .then(value => {
      return value;
    })
    .catch(err => {
      alert(
        "oops! the RsvData was too far gone, there was nothing we could do to save him ",
        err
      );
    });
};

const removeRsvData = rsvdata => {
  return localforage
    .removeItem(RSVDATA_NAMESPACE + rsvdata.id)
    .then(() => {
      return true;
    })
    .catch(err => {
      alert(err);
      return false;
    });
};

const clearAllData = () => {
  localforage
    .clear()
    .then(function() {})
    .catch(function(err) {
      alert(err); // This code runs if there were any errors
    });
};

export {
  loginUser,
  sendOtp,
  signupUser,
  // createNewPost,
  // fetchPosts,
  // fetchPostById,
  // editPostById,
  // deletePostById,
  fetchRsvDataApi,
  saveRsvData,
  removeRsvData,
  clearAllData,
  getRsvData,
  delRsvData,
  editRsvData,
  getRoomData,
  
};
