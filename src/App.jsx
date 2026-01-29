import React, {useEffect, useState} from 'react'
import Header from './components/Header'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Users from './components/Users'
import CourseDetail from './components/CourseDetail'
import CreateScheme from './components/CreateScheme'
import Notifications from './components/Notifications'

const API_LOGIN_URL = '/api/login'
const API_LESSONS_URL = '/api/lessons'

export default function App(){
  const [user,setUser] = useState(null)
  const [route,setRoute] = useState(()=>location.hash.replace('#','') || 'login')
  const [loginNotice,setLoginNotice] = useState('')
  // allow preloading a scheme (meta) into the Dashboard so it can generate the calendar
  const [preloadedScheme,setPreloadedScheme] = useState(null)
  const [preloadedWeeks,setPreloadedWeeks] = useState(null)
  const [apiLessons,setApiLessons] = useState(null)
  const [apiLessonsLoading,setApiLessonsLoading] = useState(false)
  const [notifications,setNotifications] = useState([
    {id:1, title:'Approval requested', from:'Alice Johnson', date:'2026-01-27', comments:'Please review the scheme for cohort A', academyType:'Beginner'},
    {id:2, title:'New system alert', from:'System', date:'2026-01-28', comments:'Scheduled maintenance at 03:00 UTC', academyType:'N/A'}
  ])

  // a small lessons catalog shared between create-scheme and dashboard
  const LESSONS = [
    {id:1,title:'Math Basics',courses:['Algebra','Numbers']},
    {id:2,title:'Science Intro',courses:['Biology','Chemistry']},
    {id:3,title:'History 101',courses:['Ancient','Modern']},
    {id:4,title:'English Lit',courses:['Poetry','Prose']},
    {id:5,title:'Art & Design',courses:['Drawing','Color Theory']}
  ]

  // Fetch API lessons on mount
  useEffect(()=>{
    fetchApiLessons()
  },[])

  async function fetchApiLessons(){
    setApiLessonsLoading(true)
    try {
      const response = await fetch(API_LESSONS_URL)
      const text = await response.text()
      console.log('Lessons API response status:', response.status)
      console.log('Lessons API response:', text)
      
      if(!response.ok) {
        throw new Error(`API Error ${response.status}: ${text}`)
      }
      
      const data = JSON.parse(text)
      
      // Transform API response to match component expectations
      const transformedLessons = Array.isArray(data) ? data : [data]
      transformedLessons.forEach((lesson, idx) => {
        lesson.id = lesson.lesson_plan_id || idx + 1
        lesson.title = lesson.lesson_title
        lesson.theme_name = lesson.theme_name || ''
        lesson.theme_description = lesson.theme_description || ''
      })
      
      setApiLessons(transformedLessons)
    } catch (error) {
      console.error('Failed to fetch API lessons:', error)
      setApiLessons(null)
    } finally {
      setApiLessonsLoading(false)
    }
  }

  useEffect(()=>{
    const onHash = ()=>setRoute(location.hash.replace('#','') || (user? 'dashboard':'login'))
    window.addEventListener('hashchange', onHash)
    return ()=>window.removeEventListener('hashchange', onHash)
  },[user])

  useEffect(()=>{
    if(!location.hash) location.hash = '#login'
  },[])

  async function login(email,password){
    try {
      const response = await fetch(API_LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
      })
      const data = await response.json()
      console.log('Login response:', data, 'Status:', response.status)
      if(!response.ok || !data.success) {
        return {ok:false, message:data.message || 'Invalid credentials'}
      }
      setUser({name:data.name,email:email,role:data.role})
      setLoginNotice('')
      // navigate to Create Scheme immediately after login
      location.hash = '#create-scheme'
      return {ok:true}
    } catch (error) {
      console.error('Login error:', error)
      return {ok:false, message:'Login failed: ' + error.message}
    }
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
      <Header user={user} onSignout={signout} notifications={notifications} />

      {route==='login' && <Login onLogin={login} notice={loginNotice} clearNotice={()=>setLoginNotice('')} />}
      {route==='create-scheme' && <CreateScheme lessons={apiLessons} onCreate={(schemeMeta,weeks)=>{ setPreloadedScheme(schemeMeta); setPreloadedWeeks(weeks); location.hash='#dashboard' }} />}
      {route==='dashboard' && <Dashboard user={user} lessons={apiLessons} preloadedScheme={preloadedScheme} weeksCount={preloadedWeeks} />}
      {route==='users' && <Users user={user} />}
      {route==='notifications' && <Notifications notifications={notifications} />}
      {route.startsWith('course-') && <CourseDetail />}
    </div>
  )
}
