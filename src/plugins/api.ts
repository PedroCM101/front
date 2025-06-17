const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

class ApiError extends Error {
  public errors: Record<string, string[]>

  constructor(message: string, errors: Record<string, string[]> = {}) {
    super(message)
    this.name = 'ApiError'
    this.errors = errors
  }
}

const fetchApi = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const token = localStorage.getItem('token')

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    let errors: Record<string, string[]> = {}

    if (data.errors && typeof data.errors === 'object') {
      errors = data.errors as Record<string, string[]>
    } else {
      errors = { generic: ['Error desconocido'] }
    }

    throw new ApiError('Error en la respuesta API', errors)
  }

  return data
}

export { ApiError }

export default {
  get: (endpoint: string) => fetchApi(endpoint),
  post: (endpoint: string, data: unknown) =>
    fetchApi(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  delete: (endpoint: string) =>
    fetchApi(endpoint, {
      method: 'DELETE',
    }),
}
