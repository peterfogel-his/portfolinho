import { createContext, useContext } from 'react'

// Stub — ersätts med Better Auth när servern är uppsatt
export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'student' | 'teacher' | 'admin'
}

interface AuthContext {
  user: AuthUser | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const Ctx = createContext<AuthContext>({
  user: null,
  isLoading: false,
  signOut: async () => {},
})

export function useAuth() {
  return useContext(Ctx)
}
