
export default function authHeader(headers) {
  const userData = JSON.parse(localStorage.getItem("userData"));
  if(userData && userData.token) {
    var headerObject = {Authorization: 'Bearer ' + userData.token};
    if(headers){
      headerObject = {...headerObject, ...headers};
    }
    return headerObject;
  }
  return {};
}
