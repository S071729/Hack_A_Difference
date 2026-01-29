import React from 'react'

export default function LessonCard({lesson, onClick, draggable, onDragStart}){
  return (
    <div 
      key={lesson.id} 
      className="lesson-card" 
      onClick={onClick} 
      draggable={draggable} 
      onDragStart={onDragStart}
    >
      <div className="course-icon">{lesson.lesson_title.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
      <div className="lesson-title">{lesson.lesson_title}</div>
      <div className="muted small">{[lesson.theme_name, lesson.theme_description].filter(Boolean).join(' - ')}</div>
    </div>
  )
}
