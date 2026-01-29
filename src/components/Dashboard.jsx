import React, {useState, useRef, useEffect} from 'react'

export default function Dashboard({user, lessons: externalLessons = null, preloadedScheme = null, weeksCount = null}){
  const [lessons,setLessons] = useState(externalLessons || [])
  
  // Update lessons when externalLessons changes
  useEffect(()=>{
    if(externalLessons) {
      setLessons(externalLessons)
    }
  },[externalLessons])
  // additional activities (not part of recommended lessons)
  const additionalActivities = [
    {id:101,title:'Football'},
    {id:102,title:'Basketball'},
    {id:103,title:'Volleyball'},
    {id:104,title:'Handball'},
    {id:105,title:'Dodgeball'},
    {id:106,title:'Cricket'},
    {id:107,title:'Table Tennis'},
    {id:108,title:'Fitness'},
    {id:109,title:'Yoga'},
    {id:110,title:'Rock Climbing'},
    {id:111,title:'Pilates'},
    {id:112,title:'Gym'},
    {id:113,title:'Walking'}
  ]
  const [searchTerm,setSearchTerm] = useState('')
  const combinedCatalog = [...lessons, ...additionalActivities]
  const [selectedLesson,setSelectedLesson] = useState(null)
  const carouselRef = useRef(null)
  const WEEKS = weeksCount || 10
  const [currentWeek,setCurrentWeek] = useState(1)
  // assignments: key = `${week}-${day}-${slot}` -> lessonId
  const [assignments,setAssignments] = useState({})
  const [totalHours,setTotalHours] = useState(20)
  const [accreditedHours,setAccreditedHours] = useState(15)

  // When a scheme is preloaded, auto-generate a calendar using defaults
  useEffect(()=>{
    if(preloadedScheme && Object.keys(assignments).length===0){
      const gen = generateAssignmentsFromScheme(preloadedScheme, weeksCount || WEEKS, totalHours)
      setAssignments(gen)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preloadedScheme])

  const slots = [
    {label:'10:00 - 12:00',type:'normal'},
    {label:'12:00 - 13:00 (Break)',type:'break'},
    {label:'13:00 - 14:00 (Active)',type:'active'},
    {label:'14:00 - 15:00',type:'normal'}
  ]
  const slotDurations = [2,0,1,1] // hours per slot; break has 0 hours and cannot be assigned

  function toggleCell(e){
    const el = e.currentTarget
    if(el.dataset.type==='break') return
    el.classList.toggle('selected')
  }

  function scrollLessons(dir){
    const el = carouselRef.current
    if(!el) return
    const amount = el.clientWidth * 0.8
    el.scrollBy({left: dir==='left' ? -amount : amount, behavior:'smooth'})
  }

  function prevWeek(){ setCurrentWeek(w=> Math.max(1,w-1)) }
  function nextWeek(){ setCurrentWeek(w=> Math.min(WEEKS,w+1)) }

  function addToCalendar(week, day, slot, lessonId){
    if(slots[slot].type==='break'){
      alert('Cannot assign to Break slot')
      return
    }
    const key = `${week}-${day}-${slot}`
    setAssignments(a=> ({...a,[key]: lessonId}))
  }

  // generate assignments given a scheme meta and a target total hours per week
  function generateAssignmentsFromScheme(schemeMeta, weeks, targetHours){
    if(!schemeMeta) return {}
    const slotOrder = [0,2,3]
    const slotDurations = {0:2,2:1,3:1}

    // pick pool based on scheme
    let pool = lessons.slice()
    if(schemeMeta.scheme==='functional') pool = lessons.filter(l=>/Math|English/i.test(l.title))
    else if(schemeMeta.scheme==='jobclub') pool = lessons.filter(l=>/History|Art|Employ/i.test(l.title))
    if(pool.length===0) pool = lessons.slice()

    const out = {}
    let pickIndex = 0
    for(let w=1; w<= (weeks||WEEKS); w++){
      let weekHours = 0
      for(let day=0; day<5 && weekHours < targetHours; day++){
        for(let si=0; si<slotOrder.length && weekHours < targetHours; si++){
          const slot = slotOrder[si]
          const dur = slotDurations[slot]
          if(weekHours + dur > targetHours) continue
          const lesson = pool[pickIndex % pool.length]
          const key = `${w}-${day}-${slot}`
          out[key] = lesson.id
          pickIndex++
          weekHours += dur
        }
      }
    }
    return out
  }

  function onDragStart(e, lessonId){
    e.dataTransfer.setData('text/plain', String(lessonId))
  }

  function onSlotDrop(e, day, slot){
    e.preventDefault()
    const lessonId = e.dataTransfer.getData('text/plain')
    if(!lessonId) return
    if(slots[slot].type==='break'){
      alert('Cannot drop into Break slot')
      return
    }
    addToCalendar(currentWeek, day, slot, Number(lessonId))
  }

  function onSlotDragOver(e){ e.preventDefault() }

  return (
    <main className="container">
      <div className="card">
        <h3>Week view (Mon - Fri)</h3>
        <div className="calendar">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <button className="carousel-arrow" onClick={prevWeek}>◀</button>
              <button className="carousel-arrow" onClick={nextWeek}>▶</button>
            </div>
            <div style={{flex:1,textAlign:'center',fontWeight:700}}>Week {currentWeek}</div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div className="muted">Showing week {currentWeek} of {WEEKS}</div>
              <button className="btn" onClick={()=>{
                // build a printable view for current week
                const dayNames = ['Monday','Tuesday','Wednesday','Thursday','Friday']
                let html = `<html><head><title>Week ${currentWeek} - Schedule</title><style>body{font-family:Arial;padding:16px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccc;padding:8px;text-align:left}</style></head><body>`
                html += `<h2>Week ${currentWeek} Schedule</h2>`
                html += '<table><thead><tr><th>Time</th>' + dayNames.map(d=>`<th>${d}</th>`).join('') + '</tr></thead><tbody>'
                slots.forEach((s,ri)=>{
                  html += `<tr><td>${s.label}</td>`
                  for(let c=0;c<5;c++){
                    const key = `${currentWeek}-${c}-${ri}`
                    const id = assignments[key]
                    const title = id ? (combinedCatalog.find(x=> x.id === id)?.title || 'Assigned') : (s.type==='break' ? 'Break' : (s.type==='active'?'Active Hour':'Available'))
                    html += `<td>${title}</td>`
                  }
                  html += `</tr>`
                })
                html += '</tbody></table>'
                html += '</body></html>'
                const w = window.open('','_blank')
                if(!w){ alert('Popup blocked - allow popups to download PDF via print dialog') ; return }
                w.document.open()
                w.document.write(html)
                w.document.close()
                w.focus()
                // delay to allow rendering
                setTimeout(()=> w.print(), 500)
              }}>Download as PDF</button>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Monday</th>
                <th>Tuesday</th>
                <th>Wednesday</th>
                <th>Thursday</th>
                <th>Friday</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((s,ri)=> (
                <tr key={ri}>
                  <td className="time-col">{s.label}</td>
                  {Array.from({length:5}).map((_,c)=>(
                    <td key={c}>
                      <div
                        data-type={s.type}
                        className={`slot ${s.type}`}
                        onClick={toggleCell}
                        onDragOver={onSlotDragOver}
                        onDrop={(e)=>onSlotDrop(e,c,ri)}
                      >
                        {/* show assigned lesson for this week/day/slot if present */}
                        {assignments[`${currentWeek}-${c}-${ri}`] ? (
                          <div className="assigned" draggable onDragStart={(e)=>{
                            const id = assignments[`${currentWeek}-${c}-${ri}`]
                            e.dataTransfer.setData('text/plain', String(id))
                          }}>
                            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
                              <div style={{flex:1}}>{(function(){ const id = assignments[`${currentWeek}-${c}-${ri}`]; return combinedCatalog.find(x=> x.id === id)?.title || 'Assigned' })()}</div>
                              <button className="delete-assigned" onClick={(ev)=>{ ev.stopPropagation(); const key = `${currentWeek}-${c}-${ri}`; setAssignments(a=>{ const na = {...a}; delete na[key]; return na }) }}>✕</button>
                            </div>
                          </div>
                        ) : (
                          s.type==='break' ? 'Break' : (s.type==='active' ? 'Active Hour' : 'Available')
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* single Download as PDF button kept in calendar header (top-right) */}

            <div className="save-area">
              <button className="save-btn">Save as draft</button>
              <button className="send-btn" onClick={()=>{ alert('Sent for approval') }}>Send for approval</button>
            </div>
            <hr className="total-sep" />
            <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:6}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div className="muted">Total course hours this week:</div>
                <div style={{fontWeight:800}}>
                  {(() => {
                    // compute total hours for current week
                    let total = 0
                    Object.keys(assignments).forEach(k=>{
                      if(k.startsWith(`${currentWeek}-`)){
                        const parts = k.split('-')
                        const slotIndex = Number(parts[2])
                        if(!isNaN(slotIndex) && slotDurations[slotIndex]) total += slotDurations[slotIndex]
                      }
                    })
                    return total + ' h'
                  })()}
                </div>
              </div>

              <div style={{display:'flex',gap:12,alignItems:'center'}}>
                <label className="muted" style={{minWidth:220}}>Total hours in the week</label>
                <input type="number" value={totalHours} onChange={e=>setTotalHours(Number(e.target.value))} style={{padding:8,borderRadius:8,width:120}} />
                <button className="btn" onClick={()=>{
                  // regenerate assignments from preloadedScheme if present
                  if(preloadedScheme){
                    const gen = generateAssignmentsFromScheme(preloadedScheme, weeksCount || WEEKS, totalHours)
                    setAssignments(gen)
                  } else {
                    alert('No scheme selected. Use Create Scheme to choose a scheme first.')
                  }
                }}>Generate</button>
              </div>

              <div style={{display:'flex',gap:12,alignItems:'center'}}>
                <label className="muted" style={{minWidth:220}}>Total accredited hours for work</label>
                <input type="number" value={accreditedHours} onChange={e=>setAccreditedHours(Number(e.target.value))} style={{padding:8,borderRadius:8,width:120}} />
                <div className="muted small">Default accredited hours per week is 15</div>
              </div>
            </div>
        </div>
        {/* Additional learning: search + activities */}
        <div style={{marginTop:18}}>
          <h4 style={{marginBottom:8}}>Additional learning</h4>
          <div style={{display:'flex',gap:8,marginBottom:8}}>
            <input placeholder="Search additional activities" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} style={{flex:1,padding:8,borderRadius:8,border:'1px solid #dfe6ea'}} />
            <button className="btn" onClick={()=>setSearchTerm('')}>Clear</button>
          </div>

          <div className="lessons-carousel">
            {combinedCatalog.filter(x=> x.id >= 100 && x.title.toLowerCase().includes(searchTerm.toLowerCase())).map(a=> (
              <div key={a.id} className="lesson-card" draggable onDragStart={(e)=>onDragStart(e,a.id)} style={{minWidth:140}}>
                <div className="course-icon">{a.title.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
                <div className="lesson-title">{a.title}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{display:'flex',alignItems:'center',gap:8,marginTop:18}}>
          <button className="carousel-arrow" onClick={()=>scrollLessons('left')}>◀</button>
          <div className="lessons-carousel" ref={carouselRef}>
            {lessons.map(l=> (
              <div key={l.id} className="lesson-card" onClick={()=>setSelectedLesson(l)} draggable onDragStart={(e)=>onDragStart(e,l.id)}>
                <div className="course-icon">{l.title.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
                <div className="lesson-title">{l.title}</div>
                <div className="muted small">{[l.theme_name, l.theme_description].filter(Boolean).join(' - ')}</div>
              </div>
            ))}
          </div>
          <button className="carousel-arrow" onClick={()=>scrollLessons('right')}>▶</button>
        </div>
      </div>

      {selectedLesson && (
        <div className="modal-overlay" onClick={()=>setSelectedLesson(null)}>
          <div className="modal" onClick={(e)=>e.stopPropagation()}>
            <h3 style={{textAlign:'center',fontWeight:800}}>{selectedLesson.title}</h3>
            <p style={{lineHeight:1.6}}>{[selectedLesson.theme_name, selectedLesson.theme_description].filter(Boolean).join(' - ')}</p>
            <div style={{marginTop:12}}>
              <label className="muted">Week</label>
              <select id="weekSelect" defaultValue={currentWeek} style={{width:'100%',padding:8,borderRadius:8,marginTop:6}}>
                {Array.from({length:WEEKS}).map((_,i)=> <option key={i} value={i+1}>Week {i+1}</option>)}
              </select>
            </div>
            <div style={{display:'flex',gap:8,marginTop:8}}>
              <div style={{flex:1}}>
                <label className="muted">Day</label>
                <select id="daySelect" style={{width:'100%',padding:8,borderRadius:8,marginTop:6}}>
                  <option value={0}>Monday</option>
                  <option value={1}>Tuesday</option>
                  <option value={2}>Wednesday</option>
                  <option value={3}>Thursday</option>
                  <option value={4}>Friday</option>
                </select>
              </div>
              <div style={{flex:1}}>
                <label className="muted">Time slot</label>
                <select id="slotSelect" style={{width:'100%',padding:8,borderRadius:8,marginTop:6}}>
                  {slots.map((s,idx)=> <option key={idx} value={idx}>{s.label}</option>)}
                </select>
              </div>
            </div>
            <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:12}}>
              <button className="btn" onClick={()=>setSelectedLesson(null)}>Cancel</button>
              <button className="btn primary" onClick={()=>{
                const week = Number(document.getElementById('weekSelect').value)
                const day = Number(document.getElementById('daySelect').value)
                const slot = Number(document.getElementById('slotSelect').value)
                addToCalendar(week,day,slot,selectedLesson.id)
                setSelectedLesson(null)
              }}>Add to calendar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
