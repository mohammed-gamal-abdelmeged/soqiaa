const ACCESS_TOKEN_KEY = 'accessToken'

export const saveAccessToken = (token) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export const removeAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export const clearAuthStorage = () => {
  removeAccessToken()
}