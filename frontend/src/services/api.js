import axios from 'axios'

import { getAccessToken } from '../utils/storage'
import { normalizeApiError } from '../utils/apiError'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,

  headers: {
    'Content-Type': 'application/json',
  },

  timeout: 10000,
})

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },

  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => {
    return response
  },

  (error) => {
    const normalizedError = normalizeApiError(error)

    return Promise.reject(normalizedError)
  },
)

export default api