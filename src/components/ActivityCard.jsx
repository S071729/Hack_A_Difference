import React from 'react'

export default function ActivityCard({activity, draggable, onDragStart}){
  return (
    <div 
      className="lesson-card" 
      draggable={draggable} 
      onDragStart={onDragStart}
    >
      <div className="course-icon">{activity.title.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
      <div className="lesson-title">{activity.title}</div>
    </div>
  )
}
