import React, {useState} from 'react'

export default function Notifications({notifications=[]}){
  const [selectedApproval,setSelectedApproval] = useState(null)

  const blocks = [
    {key:'all', title:'All Schemes of Work'},
    {key:'approvals', title:'My Approvals'},
    {key:'reporting', title:'Reporting'},
    {key:'userAdmin', title:'User Admin'},
    {key:'systemAdmin', title:'System Admin'}
  ]

  const approvals = notifications.filter(n => n.title && n.title.toLowerCase().includes('approval'))

  return (
    <div className="notifications-page">
      <h2>Notifications</h2>

      <section className="notif-list">
        {notifications.length===0 && <div className="muted">No notifications</div>}
        {notifications.map(n=> (
          <div key={n.id} className="notif-item">
            <div className="notif-title">{n.title}</div>
            <div className="notif-meta">From: {n.from} — {n.date}</div>
            <div className="notif-body">{n.comments}</div>
          </div>
        ))}
      </section>

      <section className="blocks-grid">
        {blocks.map(b=> (
          <button
            key={b.key}
            className="nav-btn block"
            onClick={()=>{ if(b.key==='approvals'){ setSelectedApproval(approvals[0]||{placeholder:true}) } else { /* other blocks could navigate or open pages */ } }}
          >
            <div className="block-title">{b.title}</div>
          </button>
        ))}
      </section>

      {selectedApproval && (
        <div className="modal-backdrop" onClick={()=>setSelectedApproval(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <h3>Approval Request</h3>
            {selectedApproval.placeholder ? (
              <div className="muted">No approval requests at the moment.</div>
            ) : (
              <div className="approval-detail">
                <div><strong>Request raised by:</strong> {selectedApproval.from}</div>
                <div><strong>Date submitted on:</strong> {selectedApproval.date}</div>
                <div><strong>Comments:</strong> {selectedApproval.comments}</div>
                <div><strong>Academy type / difficulty:</strong> {selectedApproval.academyType || 'Unknown'}</div>
              </div>
            )}

            <div className="modal-actions">
              <button className="nav-btn" onClick={()=>setSelectedApproval(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
