"use client"

import { useState } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = (email: string, password: string) => {
    if (email === "user@example.com" && password === "password") {
      setIsLoggedIn(true)
    } else {
      alert("Invalid credentials. Use email: user@example.com and password: password")
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-24 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden">
        <header className="bg-indigo-600 text-white py-6 px-8">
          <h1 className="text-3xl sm:text-4xl font-bold">WebEsign</h1>
          <p className="mt-2 text-indigo-200">Digital Signature Platform</p>
        </header>
        <div className="p-8">
          {isLoggedIn ? (
            <Dashboard onLogout={handleLogout} />
          ) : (
            <Login onLogin={handleLogin} />
          )}
        </div>
      </div>
    </main>
  )
}

