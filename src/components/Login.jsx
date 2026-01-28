import React, {useState} from 'react'

export default function Login({onLogin, notice, clearNotice}){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [err,setErr] = useState('')
  const [isLoading,setIsLoading] = useState(false)
  const projectLogo = '/Street%20League%20Rebrand%20Logo.jpg'
  const fallbackSvg = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="12" fill="#d6c093"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="40" font-family="Arial" fill="#6b4b1b">SL</text></svg>')
  const [loginLogo,setLoginLogo] = useState(projectLogo)

  async function submit(e){
    e.preventDefault()
    setIsLoading(true)
    setErr('')
    const res = await onLogin(email,password)
    setIsLoading(false)
    if(!res.ok) setErr(res.message)
  }

  // clear external notice when user interacts
  function onInteract(){ if(notice) clearNotice() }

  // Prevent going back to a previous protected page when mounted on login
  React.useEffect(()=>{
    // push a state so there's a history entry for login
    try{ history.pushState(null, '', location.href) }catch(e){}
    function onPop(){
      // whenever user tries to navigate back, re-push login
      try{ history.pushState(null, '', location.href) }catch(e){}
    }
    window.addEventListener('popstate', onPop)
    return ()=> window.removeEventListener('popstate', onPop)
  }, [])

  return (
    <main className="container login-wrap">
      <div className="login-card card">
        <img src={loginLogo} alt="Street League" className="login-logo" onError={(e)=>{ if(!loginLogo.startsWith('data:')) setLoginLogo(fallbackSvg) }} />
        <h2>Sign in</h2>
        <form onSubmit={submit} onClick={onInteract} onKeyDown={onInteract}>
          <label className="field">
            <span>Email</span>
            <input value={email} onChange={e=>setEmail(e.target.value)} type="email" disabled={isLoading} />
          </label>
          <label className="field">
            <span>Password</span>
            <input value={password} onChange={e=>setPassword(e.target.value)} type="password" disabled={isLoading} />
          </label>
          {err && <div className="error">{err}</div>}
          {notice && <div className="login-notice">{notice}</div>}
          <div style={{display:'flex',justifyContent:'center',marginTop:12}}>
            <button className="btn primary" type="submit" disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</button>
          </div>
        </form>
      </div>
    </main>
  )
}
