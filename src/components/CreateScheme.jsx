import React, {useState} from 'react'

export default function CreateScheme({lessons = [], onCreate}){
  const [scheme,setScheme] = useState('generic')
  const [age,setAge] = useState('16-18')
  const [gender,setGender] = useState('any')
  const [barrier,setBarrier] = useState('')
  const [location,setLocation] = useState('')

  const schemeOptions = [
    {value:'generic',label:'Generic Academy (10 weeks)',weeks:10},
    {value:'functional',label:'Functional Skills (12 weeks)',weeks:12},
    {value:'jobclub',label:'Job Club (6 weeks)',weeks:6}
  ]

  function handleSubmit(e){
    e.preventDefault()
    const sel = schemeOptions.find(s=>s.value===scheme) || schemeOptions[0]
    const WEEKS = sel.weeks

    // collect the scheme metadata and hand off to App so Dashboard can generate
    const schemeMeta = { scheme, age, gender, barrier, location }
    if(typeof onCreate === 'function') onCreate(schemeMeta, WEEKS)
  }

  return (
    <main className="container">
      <div className="card scheme-card" style={{maxWidth:600,margin:'24px auto'}}>
        <h2 style={{textAlign:'center',marginBottom:6}}>Create Scheme of Work</h2>
        <form onSubmit={handleSubmit}>
          <label className="field">
            <span>Academic Type</span>
            <select value={scheme} onChange={e=>setScheme(e.target.value)} style={{padding:10,borderRadius:8}}>
              {schemeOptions.map(s=> <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </label>

          <div style={{display:'flex',gap:12}}>
            <label className="field" style={{flex:1}}>
              <span>Age</span>
              <input value={age} onChange={e=>setAge(e.target.value)} />
            </label>
            <label className="field" style={{flex:1}}>
              <span>Gender</span>
              <select value={gender} onChange={e=>setGender(e.target.value)} style={{padding:10,borderRadius:8}}>
                <option value="any">Any</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>

          <label className="field">
            <span>Barrier</span>
            <input value={barrier} onChange={e=>setBarrier(e.target.value)} placeholder="e.g. travel, SEN" />
          </label>

          <label className="field">
            <span>Location</span>
            <input value={location} onChange={e=>setLocation(e.target.value)} placeholder="e.g. Main Hall" />
          </label>

          {/* Total hours and accredited hours are configured below the calendar in the Dashboard */}

          <div style={{display:'flex',justifyContent:'space-between',marginTop:20,gap:12}}>
            <button className="btn" type="button" onClick={()=>window.location.hash='#lesson-library'}>
              Lesson Library
            </button>
            <button className="btn primary" type="submit">Create</button>
          </div>
        </form>
      </div>
    </main>
  )
}
