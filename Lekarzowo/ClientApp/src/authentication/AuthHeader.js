
export default function authHeader() {
  const userData = JSON.parse(localStorage.getItem("userData"));
  if(userData && userData.token) {
    return {Authorization: 'Bearer ' + userData.token};
  }
  return {};
}
