import React, { useState } from 'react'

function App() {
  const [message, setMessage] = useState('')

  const testApi = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL || '/')
      const text = await res.text()
      setMessage(text)
    } catch (err) {
      setMessage('Error fetching API')
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>React + Vite + Amplify</h1>
      <button onClick={testApi}>Test API</button>
      {message && <p>Response: {message}</p>}
    </div>
  )
}

export default App
