// API utility functions for making requests to the backend

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(endpoint, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ApiError(response.status, errorData.message || `HTTP ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

// Auth API functions
export const authApi = {
  login: (credentials: { username: string; password: string }) =>
    apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  register: (userData: {
    username: string
    email: string
    password: string
    full_name: string
  }) =>
    apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  logout: () =>
    apiRequest("/api/auth/logout", {
      method: "POST",
    }),
}

// Friends API functions
export const friendsApi = {
  getFriends: () => apiRequest("/api/friends"),

  addFriend: (friendData: {
    username: string
    fullName: string
    email?: string
  }) =>
    apiRequest("/api/friends", {
      method: "POST",
      body: JSON.stringify(friendData),
    }),
}

// Groups API functions
export const groupsApi = {
  getGroups: () => apiRequest("/api/groups"),

  createGroup: (groupData: { name: string; members: number[] }) =>
    apiRequest("/api/groups", {
      method: "POST",
      body: JSON.stringify(groupData),
    }),
}

// Chats API functions
export const chatsApi = {
  getChats: () => apiRequest("/api/chats"),

  getMessages: (chatId: string) => apiRequest(`/api/chats/${chatId}/messages`),

  sendMessage: (messageData: { chatId: string; content: string }) =>
    apiRequest("/api/messages", {
      method: "POST",
      body: JSON.stringify(messageData),
    }),
}
