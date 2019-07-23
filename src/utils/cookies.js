function saveAuthToCookie(value) {
  document.cookie = `til_auth=${value}`;
}

function saveUserTelNumToCookie(value) {
  document.cookie = `til_tel_num=${value}`;
}

function saveUserIdToCookie(value) {
  document.cookie = `til_user_id=${value}`;
}

function saveUserNameToCookie(value) {
  document.cookie = `til_user_name=${value}`;
}

function getAuthFromCookie() {
  return document.cookie.replace(/(?:(?:^|.*;\s*)til_auth\s*=\s*([^;]*).*$)|^.*$/, '$1');
}

function getUserFromCookie() {
  return document.cookie.replace(/(?:(?:^|.*;\s*)til_user\s*=\s*([^;]*).*$)|^.*$/, '$1');
}

function deleteCookie(value) {
  document.cookie = `${value}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

export { saveAuthToCookie, saveUserTelNumToCookie, saveUserIdToCookie,saveUserNameToCookie,
  getAuthFromCookie, getUserFromCookie, deleteCookie };