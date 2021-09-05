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

export default {
  getLoginApi,
  getMenuListApi
}
