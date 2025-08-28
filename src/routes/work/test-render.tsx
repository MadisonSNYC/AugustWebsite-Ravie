import React from 'react'

export default function TestWorkRender() {
  console.log('🚨 TEST RENDER MOUNTED')
  console.log('🔍 ENV VAR:', import.meta.env.VITE_WORK_GRID_VIEWPORT)
  
  return (
    <div style={{
      background: 'red',
      color: 'white',
      padding: '50px',
      fontSize: '30px',
      textAlign: 'center'
    }}>
      <h1>TEST WORK PAGE IS RENDERING</h1>
      <p>ENV: {import.meta.env.VITE_WORK_GRID_VIEWPORT || 'NOT SET'}</p>
      <p>Should show GridViewport: {import.meta.env.VITE_WORK_GRID_VIEWPORT === 'true' ? 'YES' : 'NO'}</p>
    </div>
  )
}