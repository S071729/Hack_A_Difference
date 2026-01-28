import React from 'react'

const courseData = {
  1: {title:'Math Basics',text:'An introductory course covering fundamental arithmetic, numbers and algebraic thinking.',related:[2,3]},
  2: {title:'Science Intro',text:'Overview of basic scientific principles, experimentation and observation.',related:[1,5]},
  3: {title:'History 101',text:'A survey of key historical events from ancient to modern times.',related:[4]},
  4: {title:'English Lit',text:'Study of classic and modern literature, focusing on reading and analysis.',related:[3]},
  5: {title:'Art & Design',text:'Basics of drawing, color theory and creative design methods.',related:[2,4]}
}

export default function CourseDetail(){
  const hash = location.hash || ''
  const m = hash.match(/^#course-(\d+)/)
  const id = m ? m[1] : null
  const data = id ? courseData[id] : null
  if(!data){
    return <div className="container"><div className="card"><h3>Course not found</h3></div></div>
  }
  return (
    <main className="container">
      <div className="card">
        <h2 style={{textAlign:'center',fontWeight:800}}>{data.title}</h2>
        <p style={{lineHeight:1.6,marginTop:12}}>{data.text}</p>
        <div style={{marginTop:16}}>
          <h4>Related courses</h4>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {data.related.map(r=> (
              <button key={r} className="btn" onClick={()=>location.hash = `#course-${r}`}>{courseData[r].title}</button>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
