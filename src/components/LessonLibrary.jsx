import React, {useState} from 'react'
import LessonCard from './LessonCard'

export default function LessonLibrary({lessons = [], myLessons = [], setMyLessons}){
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [durationFilter, setDurationFilter] = useState('all')
  const [participantsFilter, setParticipantsFilter] = useState('all')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadFile, setUploadFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadMetadata, setUploadMetadata] = useState({
    lesson_title: '',
    duration_minutes: '',
    difficulty_level: 'Beginner',
    max_participants: '',
    delivery_method: ''
  })
  const itemsPerPage = 20

  const filteredLessons = (lessons || []).filter(l => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = l.lesson_title.toLowerCase().includes(searchLower) || 
           (l.theme_name && l.theme_name.toLowerCase().includes(searchLower))
    
    const matchesDifficulty = difficultyFilter === 'all' || l.difficulty_level === difficultyFilter
    
    const matchesDuration = durationFilter === 'all' || 
      (durationFilter === '0-30' && l.duration_minutes <= 30) ||
      (durationFilter === '31-60' && l.duration_minutes > 30 && l.duration_minutes <= 60) ||
      (durationFilter === '61+' && l.duration_minutes > 60)
    
    const matchesParticipants = participantsFilter === 'all' ||
      (participantsFilter === '1-10' && l.max_participants <= 10) ||
      (participantsFilter === '11-20' && l.max_participants > 10 && l.max_participants <= 20) ||
      (participantsFilter === '21+' && l.max_participants > 20)
    
    return matchesSearch && matchesDifficulty && matchesDuration && matchesParticipants
  })

  const totalPages = Math.ceil(filteredLessons.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentLessons = filteredLessons.slice(startIndex, endIndex)

  const handleFilterChange = () => {
    setCurrentPage(1) // Reset to first page when filters change
  }

  const goToPage = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files && files[0]) {
      setUploadFile(files[0])
    }
  }

  const handleFileSelect = (e) => {
    const files = e.target.files
    if (files && files[0]) {
      setUploadFile(files[0])
    }
  }

  const handleUploadSubmit = () => {
    if (uploadFile) {
      console.log('Uploading file:', uploadFile)
      console.log('Metadata:', uploadMetadata)
      // Add your upload logic here
      alert(`File "${uploadFile.name}" uploaded successfully!`)
      setShowUploadModal(false)
      setUploadFile(null)
      setUploadMetadata({
        lesson_title: '',
        duration_minutes: '',
        difficulty_level: 'Beginner',
        max_participants: '',
        delivery_method: ''
      })
    } else {
      alert('Please select a file to upload')
    }
  }

  const handleUploadCancel = () => {
    setShowUploadModal(false)
    setUploadFile(null)
    setIsDragging(false)
    setUploadMetadata({
      lesson_title: '',
      duration_minutes: '',
      difficulty_level: 'Beginner',
      max_participants: '',
      delivery_method: ''
    })
  }

  const handleAddToSaved = () => {
    if (selectedLesson && setMyLessons) {
      // Check if lesson is already saved
      const isAlreadySaved = myLessons.some(l => l.id === selectedLesson.id)
      if (isAlreadySaved) {
        alert('This lesson is already in your saved plans')
        return
      }
      // Add to saved lessons
      setMyLessons([...myLessons, selectedLesson])
      alert('Lesson added to Saved Lesson Plans!')
      setSelectedLesson(null)
    }
  }

  return (
    <main className="container">
      <div className="card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
          <h2 style={{margin: 0}}>Lesson Library</h2>
          <button className="btn primary" onClick={() => setShowUploadModal(true)}>
            Upload Lesson Plan
          </button>
        </div>
        
        <div style={{
          display: 'flex',
          gap: 12,
          marginTop: 8,
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Search bar on the left */}
          <input 
            placeholder="Search courses, keywords, or location" 
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }} 
            style={{
              flex: 1,
              padding: 8,
              borderRadius: 8,
              border: '1px solid #dfe6ea',
              maxWidth: '400px'
            }} 
          />

          {/* Filters on the right */}
          <div style={{
            display: 'flex',
            gap: 12,
            alignItems: 'center'
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
              <label className="muted" style={{fontSize: 14, whiteSpace: 'nowrap'}}>Difficulty:</label>
              <select 
                value={difficultyFilter} 
                onChange={(e) => {setDifficultyFilter(e.target.value); handleFilterChange()}}
                style={{padding: 8, borderRadius: 8, border: '1px solid #ddd'}}
              >
                <option value="all">All</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
              <label className="muted" style={{fontSize: 14, whiteSpace: 'nowrap'}}>Duration:</label>
              <select 
                value={durationFilter} 
                onChange={(e) => {setDurationFilter(e.target.value); handleFilterChange()}}
                style={{padding: 8, borderRadius: 8, border: '1px solid #ddd'}}
              >
                <option value="all">All</option>
                <option value="0-30">0-30 min</option>
                <option value="31-60">31-60 min</option>
                <option value="61+">60+ min</option>
              </select>
            </div>

            <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
              <label className="muted" style={{fontSize: 14, whiteSpace: 'nowrap'}}>Max Participants:</label>
              <select 
                value={participantsFilter} 
                onChange={(e) => {setParticipantsFilter(e.target.value); handleFilterChange()}}
                style={{padding: 8, borderRadius: 8, border: '1px solid #ddd'}}
              >
                <option value="all">All</option>
                <option value="1-10">1-10</option>
                <option value="11-20">11-20</option>
                <option value="21+">21+</option>
              </select>
            </div>

            {(difficultyFilter !== 'all' || durationFilter !== 'all' || participantsFilter !== 'all') && (
              <button 
                className="btn" 
                onClick={() => {
                  setDifficultyFilter('all')
                  setDurationFilter('all')
                  setParticipantsFilter('all')
                  handleFilterChange()
                }}
                style={{fontSize: 14, padding: '6px 12px'}}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div style={{
          marginTop: 20,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16
        }}>
          {currentLessons.length > 0 ? (
            currentLessons.map(l => (
              <LessonCard 
                key={l.id} 
                lesson={l} 
                onClick={() => setSelectedLesson(l)}
              />
            ))
          ) : (
            <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: '#999'}}>
              {searchTerm ? 'No lessons found matching your search.' : 'No lessons available.'}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
            marginTop: 24,
            paddingTop: 16,
            borderTop: '1px solid #eee'
          }}>
            <button 
              className="btn" 
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              style={{opacity: currentPage === 1 ? 0.5 : 1}}
            >
              Previous
            </button>
            
            <div style={{display: 'flex', gap: 4}}>
              {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={currentPage === page ? 'btn primary' : 'btn'}
                  onClick={() => goToPage(page)}
                  style={{
                    minWidth: 40,
                    padding: '8px 12px'
                  }}
                >
                  {page}
                </button>
              ))}
            </div>

            <button 
              className="btn" 
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{opacity: currentPage === totalPages ? 0.5 : 1}}
            >
              Next
            </button>
          </div>
        )}

        {/* Results info */}
        {filteredLessons.length > 0 && (
          <div style={{
            textAlign: 'center',
            marginTop: 12,
            fontSize: 14,
            color: '#666'
          }}>
            Showing {startIndex + 1} - {Math.min(endIndex, filteredLessons.length)} of {filteredLessons.length} lessons
          </div>
        )}
      </div>

      {/* Modal for lesson details */}
      {selectedLesson && (
        <div className="modal-overlay" onClick={() => setSelectedLesson(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{textAlign:'center',fontWeight:800}}>{selectedLesson.lesson_title || selectedLesson.title}</h3>
            <p style={{lineHeight:1.6}}>{[selectedLesson.theme_name, selectedLesson.theme_description].filter(Boolean).join(' - ')}</p>
            <div style={{display:'flex',gap:16,marginTop:12,paddingBottom:12,borderBottom:'1px solid #eee',fontSize:14}}>
              <div><span className="muted">Max Participants:</span> {selectedLesson.max_participants || 'N/A'}</div>
              <div><span className="muted">Duration:</span> {selectedLesson.duration_minutes || 'N/A'} min</div>
              <div><span className="muted">Difficulty:</span> {selectedLesson.difficulty_level || 'N/A'}</div>
            </div>
            {selectedLesson.download_url && (
              <a href={selectedLesson.download_url} target="_blank" rel="noopener noreferrer" style={{textDecoration:'none'}}>
                <button className="btn primary" style={{width:'100%',padding:10,marginTop:12}}>Download Lesson Plan</button>
              </a>
            )}
            <div style={{display:'flex',gap:8,justifyContent:'space-between',marginTop:20}}>
              <button className="btn" onClick={() => setSelectedLesson(null)}>Close</button>
              <button className="btn primary" onClick={handleAddToSaved}>Add to Saved Lesson Plans</button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={handleUploadCancel}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{maxWidth: 600}}>
            <h3 style={{textAlign:'center',fontWeight:800,marginBottom:20}}>Upload Lesson Plan</h3>
            
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${isDragging ? '#0066cc' : '#ddd'}`,
                borderRadius: 8,
                padding: 40,
                textAlign: 'center',
                backgroundColor: isDragging ? '#f0f8ff' : '#fafafa',
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginBottom: 20
              }}
            >
              <input
                type="file"
                id="file-upload"
                style={{display: 'none'}}
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.ppt,.pptx"
              />
              <label htmlFor="file-upload" style={{cursor: 'pointer', display: 'block'}}>
                <div style={{fontSize: 48, marginBottom: 10}}>📄</div>
                <div style={{fontSize: 16, fontWeight: 600, marginBottom: 8}}>
                  {uploadFile ? uploadFile.name : 'Drag and drop your file here'}
                </div>
                <div style={{fontSize: 14, color: '#666'}}>
                  {uploadFile ? `Size: ${(uploadFile.size / 1024).toFixed(2)} KB` : 'or click to browse'}
                </div>
              </label>
            </div>

            {/* Metadata Fields */}
            <div style={{display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20}}>
              <div>
                <label className="muted" style={{display: 'block', marginBottom: 6}}>Lesson Title *</label>
                <input
                  type="text"
                  value={uploadMetadata.lesson_title}
                  onChange={(e) => setUploadMetadata({...uploadMetadata, lesson_title: e.target.value})}
                  placeholder="Enter lesson title"
                  style={{width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ddd'}}
                />
              </div>

              <div style={{display: 'flex', gap: 12}}>
                <div style={{flex: 1}}>
                  <label className="muted" style={{display: 'block', marginBottom: 6}}>Duration (minutes) *</label>
                  <input
                    type="number"
                    value={uploadMetadata.duration_minutes}
                    onChange={(e) => setUploadMetadata({...uploadMetadata, duration_minutes: e.target.value})}
                    placeholder="e.g. 60"
                    style={{width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ddd'}}
                  />
                </div>

                <div style={{flex: 1}}>
                  <label className="muted" style={{display: 'block', marginBottom: 6}}>Difficulty Level *</label>
                  <select
                    value={uploadMetadata.difficulty_level}
                    onChange={(e) => setUploadMetadata({...uploadMetadata, difficulty_level: e.target.value})}
                    style={{width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ddd'}}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div style={{display: 'flex', gap: 12}}>
                <div style={{flex: 1}}>
                  <label className="muted" style={{display: 'block', marginBottom: 6}}>Max Participants *</label>
                  <input
                    type="number"
                    value={uploadMetadata.max_participants}
                    onChange={(e) => setUploadMetadata({...uploadMetadata, max_participants: e.target.value})}
                    placeholder="e.g. 20"
                    style={{width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ddd'}}
                  />
                </div>

                <div style={{flex: 1}}>
                  <label className="muted" style={{display: 'block', marginBottom: 6}}>Delivery Method *</label>
                  <input
                    type="text"
                    value={uploadMetadata.delivery_method}
                    onChange={(e) => setUploadMetadata({...uploadMetadata, delivery_method: e.target.value})}
                    placeholder="e.g. In-person, Online"
                    style={{width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ddd'}}
                  />
                </div>
              </div>
            </div>

            <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
              <button className="btn" onClick={handleUploadCancel}>Cancel</button>
              <button className="btn primary" onClick={handleUploadSubmit}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
