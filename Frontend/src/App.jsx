"use client"

import { BrowserRouter as Router, Route, Routes, Navigate, Link, useLocation } from "react-router-dom"
import { useState } from "react"
import { BarChart2, CreditCard, AlertTriangle, Users, FileBarChart, Menu, X, ChevronRight, LogOut } from "lucide-react"
import "./App.css"
import "./auth/Auth.css"

// Components
import Dashboard from "./components/Dashboard"
import TransactionsList from "./components/TransactionsList"
import AlertsList from "./components/AlertsList"
import UserBehaviorAnalysis from "./components/UserBehaviorAnalysis"
import ReportsAnalytics from "./components/ReportsAnalytics"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider, useAuth } from "./auth/AuthContext"

function SidebarLink({ to, icon: Icon, label, isActive, isSidebarOpen }) {
  return (
    <Link to={to} className={`sidebar-link ${isActive ? "active" : ""}`}>
      <Icon size={23} />
      {isSidebarOpen && <span>{label}</span>}
      {isActive && <ChevronRight className="active-indicator" size={16} />}
    </Link>
  )
}

function AppSidebar({ isSidebarOpen, toggleSidebar }) {
  const location = useLocation()
  const { currentUser, logout } = useAuth()

  const isActive = (path) => location.pathname === path

  return (
    <aside className={`app-sidebar ${isSidebarOpen ? "open" : "collapsed"}`}>
      <div className="sidebar-header">
        <h1 className="sidebar-logo">{isSidebarOpen ? "Fraud Detection" : "FD"}</h1>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <SidebarLink to="/" icon={BarChart2} label="Dashboard" isActive={isActive("/")} isSidebarOpen={isSidebarOpen} />
        <SidebarLink
          to="/transactions"
          icon={CreditCard}
          label="Transactions"
          isActive={isActive("/transactions")}
          isSidebarOpen={isSidebarOpen}
        />
        <SidebarLink
          to="/alerts"
          icon={AlertTriangle}
          label="Alerts"
          isActive={isActive("/alerts")}
          isSidebarOpen={isSidebarOpen}
        />
        <SidebarLink
          to="/userAnalysis"
          icon={Users}
          label="User Analysis"
          isActive={isActive("/userAnalysis")}
          isSidebarOpen={isSidebarOpen}
        />
        <SidebarLink
          to="/reportsAnalysis"
          icon={FileBarChart}
          label="Reports"
          isActive={isActive("/reportsAnalysis")}
          isSidebarOpen={isSidebarOpen}
        />
      </nav>

      <div className="sidebar-footer">
        {isSidebarOpen && (
          <div className="user-info">
            <div className="user-avatar">{currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "A"}</div>
            <div className="user-details">
              <p className="user-name">{currentUser?.name || "Admin User"}</p>
              <p className="user-role">Fraud Analyst</p>
            </div>
          </div>
        )}
        <button className="logout-button" onClick={logout}>
          <LogOut size={20} />
          {isSidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const getCurrentPageTitle = (pathname) => {
    switch (pathname) {
      case "/":
        return "Dashboard"
      case "/transactions":
        return "Transactions"
      case "/alerts":
        return "Alerts"
      case "/userAnalysis":
        return "User Analysis"
      case "/reportsAnalysis":
        return "Reports & Analytics"
      default:
        return "Dashboard"
    }
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    )
  }

  return (
    <div className={`app ${isSidebarOpen ? "" : "sidebar-collapsed"}`}>
      <AppSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="app-main">
        <header className="app-header">
          <button className="mobile-menu-toggle" onClick={toggleSidebar}>
            <Menu size={25} />
          </button>
          <h1>{getCurrentPageTitle(location.pathname)}</h1>
        </header>

        <main className="app-content">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <TransactionsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alerts"
              element={
                <ProtectedRoute>
                  <AlertsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/userAnalysis"
              element={
                <ProtectedRoute>
                  <UserBehaviorAnalysis />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reportsAnalysis"
              element={
                <ProtectedRoute>
                  <ReportsAnalytics />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>&copy; 2025 Fraud Detection System</p>
        </footer>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App
