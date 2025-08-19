"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"

export default function AdminTestPage() {
  const { user, loading, isAdmin } = useAuth()
  const [localStorageData, setLocalStorageData] = useState<any>(null)

  useEffect(() => {
    const adminSession = localStorage.getItem('admin_session')
    setLocalStorageData(adminSession ? JSON.parse(adminSession) : null)
  }, [])

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Authentication Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold">Auth Context State:</h2>
          <pre className="text-sm bg-gray-100 p-2 rounded mt-2">
            {JSON.stringify({ user, loading, isAdmin }, null, 2)}
          </pre>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">LocalStorage Admin Session:</h2>
          <pre className="text-sm bg-gray-100 p-2 rounded mt-2">
            {JSON.stringify(localStorageData, null, 2)}
          </pre>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Debug Info:</h2>
          <ul className="text-sm space-y-1">
            <li>Loading: {loading ? 'Yes' : 'No'}</li>
            <li>User exists: {user ? 'Yes' : 'No'}</li>
            <li>Is Admin: {isAdmin ? 'Yes' : 'No'}</li>
            <li>User role: {user?.role || 'None'}</li>
            <li>User isAdmin flag: {user?.isAdmin ? 'Yes' : 'No'}</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 