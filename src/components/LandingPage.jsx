import React from 'react'

export default function LandingPage({user}){
  const isAdmin = user && user.role === 'admin'

  return (
    <main className="container">
      <div className="card" style={{maxWidth: 800, margin: '40px auto'}}>
        <h2 style={{textAlign: 'center', marginBottom: 8}}>Welcome, {user?.name || 'User'}</h2>
        <p style={{textAlign: 'center', color: '#999', marginBottom: 32}}>
          {isAdmin ? 'Admin Dashboard' : 'What would you like to do today?'}
        </p>

        {isAdmin ? (
          // Admin buttons
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16
          }}>
            <button 
              className="landing-btn"
              onClick={() => window.location.hash = '#users'}
            >
              <div className="landing-icon">👥</div>
              <div className="landing-title">Manage Users</div>
              <div className="landing-desc">Add, edit, and manage user accounts</div>
            </button>

            <button 
              className="landing-btn"
              onClick={() => window.location.hash = '#manage-groups'}
            >
              <div className="landing-icon">🏢</div>
              <div className="landing-title">Manage Groups</div>
              <div className="landing-desc">Organize users into groups</div>
            </button>

            <button 
              className="landing-btn"
              onClick={() => window.location.hash = '#user-admin'}
            >
              <div className="landing-icon">⚙️</div>
              <div className="landing-title">User Admin</div>
              <div className="landing-desc">Configure user permissions</div>
            </button>

            <button 
              className="landing-btn"
              onClick={() => window.location.hash = '#lesson-library'}
            >
              <div className="landing-icon">📚</div>
              <div className="landing-title">Lesson Library</div>
              <div className="landing-desc">Browse all lesson plans</div>
            </button>
          </div>
        ) : (
          // Regular user buttons
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16
          }}>
            <button 
              className="landing-btn"
              onClick={() => window.location.hash = '#create-scheme'}
            >
              <div className="landing-icon">📝</div>
              <div className="landing-title">Create Scheme</div>
              <div className="landing-desc">Build a new scheme of work</div>
            </button>

            <button 
              className="landing-btn"
              onClick={() => window.location.hash = '#lesson-library'}
            >
              <div className="landing-icon">📚</div>
              <div className="landing-title">Lesson Library</div>
              <div className="landing-desc">Browse lesson plans</div>
            </button>

            <button 
              className="landing-btn"
              onClick={() => window.location.hash = '#upload-lesson'}
            >
              <div className="landing-icon">⬆️</div>
              <div className="landing-title">Upload Lesson</div>
              <div className="landing-desc">Upload a lesson plan file</div>
            </button>

            <button 
              className="landing-btn"
              onClick={() => window.location.hash = '#create-lesson'}
            >
              <div className="landing-icon">✏️</div>
              <div className="landing-title">Create Lesson</div>
              <div className="landing-desc">Create a new lesson from scratch</div>
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
