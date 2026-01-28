import React, {useEffect, useState} from 'react'
import Header from './components/Header'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Users from './components/Users'
import CourseDetail from './components/CourseDetail'
import CreateScheme from './components/CreateScheme'

const CREDENTIALS = [
  {email:'admin@example.com',password:'admin123',role:'admin',name:'Admin User'},
  {email:'user@example.com',password:'user123',role:'user',name:'Normal User'}
]

export default function App(){
  const [user,setUser] = useState(null)
  const [route,setRoute] = useState(()=>location.hash.replace('#','') || 'login')
  const [loginNotice,setLoginNotice] = useState('')
  // allow preloading a scheme (meta) into the Dashboard so it can generate the calendar
  const [preloadedScheme,setPreloadedScheme] = useState(null)
  const [preloadedWeeks,setPreloadedWeeks] = useState(null)

  // a small lessons catalog shared between create-scheme and dashboard
  const LESSONS = [
    {id:1,title:'Math Basics',courses:['Algebra','Numbers']},
    {id:2,title:'Science Intro',courses:['Biology','Chemistry']},
    {id:3,title:'History 101',courses:['Ancient','Modern']},
    {id:4,title:'English Lit',courses:['Poetry','Prose']},
    {id:5,title:'Art & Design',courses:['Drawing','Color Theory']}
  ]

  useEffect(()=>{
    const onHash = ()=>setRoute(location.hash.replace('#','') || (user? 'dashboard':'login'))
    window.addEventListener('hashchange', onHash)
    return ()=>window.removeEventListener('hashchange', onHash)
  },[user])

  useEffect(()=>{
    if(!location.hash) location.hash = '#login'
  },[])

  function login(email,password){
    const found = CREDENTIALS.find(c=>c.email===email && c.password===password)
    if(!found) return {ok:false, message:'Invalid credentials'}
    setUser({name:found.name,email:found.email,role:found.role})
    setLoginNotice('')
    // navigate to Create Scheme immediately after login
    location.hash = '#create-scheme'
    return {ok:true}
  }

  function signout(){
    setUser(null)
    // navigate to login and replace the current history entry so pressing Back won't return to protected page
    setLoginNotice('You need to add the credentials.')
    // update internal route immediately so Dashboard won't render
    setRoute('login')
    // replace URL so back doesn't go to protected page
    location.replace(location.pathname + location.search + '#login')
  }

  return (
    <div className="app-root">
      <Header user={user} onSignout={signout} />

      {route==='login' && <Login onLogin={login} notice={loginNotice} clearNotice={()=>setLoginNotice('')} />}
      {route==='create-scheme' && <CreateScheme lessons={LESSONS} onCreate={(schemeMeta,weeks)=>{ setPreloadedScheme(schemeMeta); setPreloadedWeeks(weeks); location.hash='#dashboard' }} />}
      {route==='dashboard' && <Dashboard user={user} lessons={LESSONS} preloadedScheme={preloadedScheme} weeksCount={preloadedWeeks} />}
      {route==='users' && <Users user={user} />}
      {route.startsWith('course-') && <CourseDetail />}
    </div>
  )
}
