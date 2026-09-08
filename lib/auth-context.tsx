'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type UserRole = 'farmer' | 'admin'

export interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  farmerId?: string
  adminId?: string
  center?: string
  avatar: string
}

interface AuthContextType {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (identifier: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>
  register: (data: {
    name: string
    email: string
    phone: string
    password: string
    role: UserRole
  }) => Promise<{ success: boolean; error?: string }>
  adminLogin: (adminId: string, password: string, pin: string, center?: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const DEFAULT_FARMER: UserProfile = {
  id: 'usr-001',
  name: 'Ramesh Kumar',
  email: 'ramesh@kisanq.gov.in',
  phone: '9876543210',
  role: 'farmer',
  farmerId: 'KS-2491',
  avatar: 'RM',
}

const DEFAULT_ADMIN: UserProfile = {
  id: 'adm-001',
  name: 'Arjun Singh',
  email: 'admin@kisanq.gov.in',
  phone: '9812345678',
  role: 'admin',
  adminId: 'KQ-ADM-01',
  center: 'Dharampur Centre',
  avatar: 'AS',
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_FARMER)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize from localStorage if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem('kisanq_user')
      if (stored) {
        setUser(JSON.parse(stored))
      }
    } catch {
      // ignore
    }
  }, [])

  const saveUser = (u: UserProfile | null, remember = true) => {
    setUser(u)
    try {
      if (u) {
        if (remember) {
          localStorage.setItem('kisanq_user', JSON.stringify(u))
        } else {
          sessionStorage.setItem('kisanq_user', JSON.stringify(u))
        }
      } else {
        localStorage.removeItem('kisanq_user')
        sessionStorage.removeItem('kisanq_user')
      }
    } catch {
      // ignore
    }
  }

  const login = async (identifier: string, password: string, rememberMe = true) => {
    setIsLoading(true)
    await new Promise((res) => setTimeout(res, 650)) // realistic mock delay

    const trimmed = identifier.trim().toLowerCase()
    
    // Check demo credentials or registered credentials
    if (
      (trimmed === 'ramesh@kisanq.gov.in' || trimmed === '9876543210' || trimmed === 'farmer' || trimmed.includes('@')) &&
      (password.length >= 6)
    ) {
      const loggedUser: UserProfile = {
        ...DEFAULT_FARMER,
        email: trimmed.includes('@') ? trimmed : 'ramesh@kisanq.gov.in',
        phone: !trimmed.includes('@') ? trimmed : '9876543210',
      }
      saveUser(loggedUser, rememberMe)
      setIsLoading(false)
      return { success: true }
    }

    setIsLoading(false)
    return { success: false, error: 'Invalid credentials. Password must be at least 6 characters.' }
  }

  const register = async (data: {
    name: string
    email: string
    phone: string
    password: string
    role: UserRole
  }) => {
    setIsLoading(true)
    await new Promise((res) => setTimeout(res, 750))

    const initials = data.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'KQ'

    const randomId = Math.floor(1000 + Math.random() * 9000)
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      role: data.role,
      farmerId: data.role === 'farmer' ? `KS-${randomId}` : undefined,
      adminId: data.role === 'admin' ? `KQ-ADM-${randomId}` : undefined,
      avatar: initials,
    }

    saveUser(newUser, true)
    setIsLoading(false)
    return { success: true }
  }

  const adminLogin = async (adminId: string, password: string, pin: string, center = 'Dharampur Centre') => {
    setIsLoading(true)
    await new Promise((res) => setTimeout(res, 700))

    const cleanId = adminId.trim().toLowerCase()
    if (
      (cleanId === 'kq-adm-01' || cleanId === 'admin@kisanq.gov.in' || cleanId === 'admin' || cleanId.includes('adm')) &&
      password.length >= 6 &&
      pin.length === 4
    ) {
      const adminUser: UserProfile = {
        ...DEFAULT_ADMIN,
        adminId: cleanId.toUpperCase(),
        center,
      }
      saveUser(adminUser, true)
      setIsLoading(false)
      return { success: true }
    }

    setIsLoading(false)
    return { success: false, error: 'Invalid admin credentials or security PIN.' }
  }

  const logout = () => {
    saveUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        adminLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
