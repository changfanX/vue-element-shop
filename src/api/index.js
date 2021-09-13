import axios from 'axios'

axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token')
  config.headers.Authorization = token
  return config
})

function getLoginApi(payload = {}) {
  return axios.post('/login', payload)
}

function getMenuListApi() {
  return axios.get('/menus')
}

function getUserListApi(params) {
  return axios.get('/users', { params })
}
function addUserApi(payload = {}) {
  return axios.post('/users', payload)
}
function userStateChangeApi(payload) {
  return axios.put(`/users/${payload.id}/state/${payload.mg_state}`)
}
function editUserInfoApi(payload) {
  const { id, email, mobile } = payload
  return axios.put('/users/' + id, {
    email,
    mobile
  })
}
function removeUserByIdApi(id) {
  return axios.delete('/users/' + id)
}
function setRolesApi() {
  return axios.get('/roles')
}
function saveRolesInfoApi(id, payload) {
  return axios.put(`/users/${id}/role`, {
    rid: payload
  })
}

export default {
  getLoginApi,
  getMenuListApi,
  getUserListApi,
  addUserApi,
  userStateChangeApi,
  editUserInfoApi,
  removeUserByIdApi,
  setRolesApi,
  saveRolesInfoApi,
  axios
}
