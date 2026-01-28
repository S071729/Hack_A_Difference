import React from 'react'

const ROLE_OPTIONS = [
  'Academy coach',
  'Senior coach',
  'Employability trainer',
  'Sports coach',
  'Youth worker',
  'Programme manager'
]

const sampleUsers = [
  {id:1,name:'Alice Johnson',role:'Academy coach'},
  {id:2,name:'Bob Smith',role:'Senior coach'},
  {id:3,name:'Carla Reyes',role:'Employability trainer'}
]

export default function Users({user}){
  if(!user || user.role!=='admin'){
    location.hash = '#dashboard'
    return null
  }
  return (
    <main className="container">
      <div className="card">
        <h3>Users</h3>
        <div className="users-list">
          {sampleUsers.map(u=> (
            <div className="user-row" key={u.id}>
              <div>{u.name}</div>
              <div>
                <select defaultValue={u.role} onChange={(e)=>{ alert(`${u.name} role set to ${e.target.value}`) }}>
                  {ROLE_OPTIONS.map(r=> <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
