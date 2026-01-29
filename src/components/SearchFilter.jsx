import React, {useState} from 'react'

export default function SearchFilter({onApply}){
  const [open,setOpen] = useState(false)
  const [filters,setFilters] = useState({
    ageMin:'', ageMax:'', cohortSize:'', gender:'', barrier:'', location:'', qualification:'', status:''
  })
  const [fileMeta, setFileMeta] = useState({ file: null, meta: {} })

  function onFileChange(e){
    const f = e.target.files && e.target.files[0]
    if(!f) return setFileMeta({file:null, meta:{}})
    setFileMeta({file: f, meta: { age: '', size: '', gender:'', barrier:'', type:'' }})
  }

  function updateMeta(k,v){ setFileMeta(fm=> ({...fm, meta: {...fm.meta, [k]: v}})) }

  function apply(){
    const payload = { filters, uploaded: fileMeta }
    if(onApply) onApply(payload)
    setOpen(false)
  }

  return (
    <div>
      <div style={{display:'flex',gap:8,marginTop:8}}>
        <input placeholder="Search courses, keywords, or location" onChange={(e)=>{ const newFilters = {...filters, q:e.target.value}; setFilters(newFilters); if(onApply) onApply({filters: newFilters, uploaded: fileMeta}) }} style={{flex:1,padding:8,borderRadius:8,border:'1px solid #dfe6ea'}} />
        <button className="btn" onClick={()=>setOpen(true)}>Advanced Filters</button>
      </div>

      {open && (
        <div className="modal-overlay" onClick={()=>setOpen(false)}>
          <div className="modal" onClick={(e)=>e.stopPropagation()} style={{maxWidth:720}}>
            <h3 style={{textAlign:'center'}}>Search & Filter Courses</h3>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:12}}>
              <div>
                <label className="muted">Age Min</label>
                <input type="number" value={filters.ageMin} onChange={e=>setFilters(f=>({...f, ageMin:e.target.value}))} />
              </div>
              <div>
                <label className="muted">Age Max</label>
                <input type="number" value={filters.ageMax} onChange={e=>setFilters(f=>({...f, ageMax:e.target.value}))} />
              </div>
              <div>
                <label className="muted">Cohort Size</label>
                <input type="number" value={filters.cohortSize} onChange={e=>setFilters(f=>({...f, cohortSize:e.target.value}))} />
              </div>
              <div>
                <label className="muted">Gender</label>
                <select value={filters.gender} onChange={e=>setFilters(f=>({...f, gender:e.target.value}))}>
                  <option value="">Any</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>

              <div>
                <label className="muted">Barrier</label>
                <input placeholder="e.g., transport, language" value={filters.barrier} onChange={e=>setFilters(f=>({...f, barrier:e.target.value}))} />
              </div>
              <div>
                <label className="muted">Location</label>
                <input placeholder="Town, city or postcode" value={filters.location} onChange={e=>setFilters(f=>({...f, location:e.target.value}))} />
              </div>

              <div>
                <label className="muted">Accredited qualification type</label>
                <input value={filters.qualification} onChange={e=>setFilters(f=>({...f, qualification:e.target.value}))} />
              </div>
              <div>
                <label className="muted">Status</label>
                <select value={filters.status} onChange={e=>setFilters(f=>({...f, status:e.target.value}))}>
                  <option value="">Any</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <hr style={{margin:'12px 0'}} />

            <h4>Upload document & add metadata</h4>
            <div style={{display:'flex',gap:12,alignItems:'center',marginTop:8}}>
              <input type="file" onChange={onFileChange} />
              {fileMeta.file && <div style={{flex:1}}>
                <div className="muted small">Selected: {fileMeta.file.name}</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:8}}>
                  <input placeholder="Age range" value={fileMeta.meta.age || ''} onChange={e=>updateMeta('age',e.target.value)} />
                  <input placeholder="Cohort size" value={fileMeta.meta.size || ''} onChange={e=>updateMeta('size',e.target.value)} />
                  <input placeholder="Gender" value={fileMeta.meta.gender || ''} onChange={e=>updateMeta('gender',e.target.value)} />
                  <input placeholder="Barrier" value={fileMeta.meta.barrier || ''} onChange={e=>updateMeta('barrier',e.target.value)} />
                  <input placeholder="Type" value={fileMeta.meta.type || ''} onChange={e=>updateMeta('type',e.target.value)} />
                </div>
              </div>}
            </div>

            <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:12}}>
              <button className="btn" onClick={()=>setOpen(false)}>Cancel</button>
              <button className="btn primary" onClick={apply}>Apply filters</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
