import React, {useState} from 'react'

export default function Header({user,onSignout,notifications=[]}){
  const [open,setOpen] = useState(false)
  // use the workspace-root logo file (served by Vite at root)
  const projectLogo = '/Street%20League%20Rebrand%20Logo.jpg'
  const localPath = 'file:///' + encodeURI('C:/Users/SRoy/Desktop/Street League Rebrand Logo.jpg')
  const fallbackSvg = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="12" fill="#d6c093"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="40" font-family="Arial" fill="#6b4b1b">SL</text></svg>')
  const [logoSrc,setLogoSrc] = useState(projectLogo)
  return (
    <header className="toolbar">
      <div className="left">
        <div className="logo">
          <img className="street-logo-img" src={logoSrc} alt="Street League" onError={(e)=>{
              // try local file next, then embedded fallback
              if(logoSrc !== localPath){
                setLogoSrc(localPath)
              } else if(!logoSrc.startsWith('data:')){
                setLogoSrc(fallbackSvg)
              }
            }} />
          <div className="brand">Welcome to Shield</div>
        </div>
      </div>

      {/* show nav only when user is logged in */}
      {user ? (
        <>
          <nav className="right">
            <button className="nav-btn" onClick={()=>location.hash='#dashboard'}>Profile</button>
            <button className="nav-btn" onClick={()=>location.hash='#lesson-library'}>Lesson Library</button>
            <button className="nav-btn" onClick={()=>location.hash='#create-scheme'}>Create Scheme</button>
            {user && user.role==='admin' && <button className="nav-btn" onClick={()=>location.hash='#users'}>Users</button>}
            <button className="nav-btn" onClick={()=>location.hash='#notifications'} title="Notifications" aria-label="Notifications">
              <span className="notif-bell">🔔</span>
              {notifications && notifications.length>0 && (
                <span className="notif-badge">{notifications.length}</span>
              )}
            </button>
            <button className="nav-btn" onClick={onSignout}>Sign out</button>
          </nav>
          <button className="hamburger" onClick={()=>setOpen(!open)}>☰</button>
          {open && (
            <div className="nav-menu">
              <button className="nav-btn" onClick={()=>{location.hash='#dashboard'; setOpen(false)}}>Profile</button>
              <button className="nav-btn" onClick={()=>{location.hash='#lesson-library'; setOpen(false)}}>Lesson Library</button>
              <button className="nav-btn" onClick={()=>{location.hash='#create-scheme'; setOpen(false)}}>Create Scheme</button>
              {user && user.role==='admin' && <button className="nav-btn" onClick={()=>{location.hash='#users'; setOpen(false)}}>Users</button>}
              <button className="nav-btn" onClick={()=>{location.hash='#notifications'; setOpen(false)}}>Notifications {notifications && notifications.length>0 ? `(${notifications.length})` : ''}</button>
              <button className="nav-btn" onClick={()=>{onSignout(); setOpen(false)}}>Sign out</button>
            </div>
          )}
        </>
      ) : null}
    </header>
  )
}
