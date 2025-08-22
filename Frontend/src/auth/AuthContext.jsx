"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const user = localStorage.getItem("fraud_detection_user")
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Login failed")
      }

      const data = await response.json()
      localStorage.setItem("fraud_detection_user", JSON.stringify(data.user))
      localStorage.setItem("fraud_detection_token", data.token)
      setCurrentUser(data.user)
      return true
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const register = async (username, password, name) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, name }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Registration failed")
      }

      return true
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("fraud_detection_user")
    localStorage.removeItem("fraud_detection_token")
    setCurrentUser(null)
    navigate("/login")
  }

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
