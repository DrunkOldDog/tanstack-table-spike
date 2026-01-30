import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { useState } from 'react'

const testAuthHeader = createServerFn({ method: 'GET' }).handler(async () => {
  const headers = getRequestHeaders()
  const authHeader = headers.get('authorization')

  console.log('=== SERVER SIDE AUTH HEADER TEST ===')
  console.log('Authorization header:', authHeader)
  console.log('All headers:', Object.fromEntries(headers.entries()))
  console.log('====================================')

  return {
    success: !!authHeader,
  }
})

export const Route = createFileRoute('/test/auth-header')({
  component: RouteComponent,
})

function RouteComponent() {
  const [result, setResult] = useState<{
    success: boolean
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleTest = async () => {
    setLoading(true)
    try {
      const response = await testAuthHeader()
      setResult(response)
    } catch (error) {
      console.error('Error testing auth header:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Auth Header Middleware Test</h1>

      <button
        onClick={handleTest}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Auth Header'}
      </button>

      {result && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <h2 className="font-semibold mb-2">Result:</h2>
          <p>
            <strong>Header received:</strong>{' '}
            {result.success ? '✅ Yes' : '❌ No'}
          </p>
        </div>
      )}
    </div>
  )
}
