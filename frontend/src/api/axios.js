import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
})

// Before every request, attach the token if we have one
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const refresh = localStorage.getItem('refresh')

    if (
      error.response?.status === 401 &&
      !original._retry &&
      refresh &&
      !original.url.includes('/auth/login/')
    ) {
      original._retry = true
      try {
        const res = await axios.post(
          'http://127.0.0.1:8000/api/auth/token/refresh/',
          { refresh }
        )
        localStorage.setItem('access', res.data.access)
        original.headers.Authorization = `Bearer ${res.data.access}`
        return api(original)
      } catch {
        localStorage.clear()
        window.location.href = '/'
      }
    }
    return Promise.reject(error)
  }
)

export default api