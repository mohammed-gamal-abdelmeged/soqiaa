import api from './api'

export async function getMyProfile() {
  const response =
    await api.get('/users/me')

  return response.data.data.user
}

export async function updateMyProfile(
  data,
) {
  const response =
    await api.patch(
      '/users/me',
      data,
    )

  return response.data.data.user
}