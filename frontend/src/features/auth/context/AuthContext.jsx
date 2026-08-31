import { createContext, useState } from 'react'

import {
  getAccessToken,
  saveAccessToken,
  clearAuthStorage,
} from '../../../utils/storage'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const [accessToken, setAccessToken] = useState(() => {
    return getAccessToken()
  })

  const isAuthenticated = Boolean(accessToken)

  const setAuthData = ({ user, accessToken }) => {
    setUser(user)
    setAccessToken(accessToken)

    saveAccessToken(accessToken)
  }
  const updateUser = (updatedData) => {
  setUser((currentUser) => ({
    ...currentUser,
    ...updatedData,
  }))}

  const logout = () => {
    setUser(null)
    setAccessToken(null)

    clearAuthStorage()
  }



  const value = {
    user,
    accessToken,
    isAuthenticated,
    setAuthData,
    updateUser,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}