import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const API_URL = '/api';
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);


  async function fetchNotes() {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/notes`);
      if (!response.ok) {
        throw new Error('Failed to fetch Notes!');
      }
      const data = await response.json();
      setNotes(data);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);

    }
  }



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('Please fill both title & content!');
      return;
    }

    try {
      if (editingId) {
        const response = await fetch(`${API_URL}/notes/${editingId}`, {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ title, content })
        })

        if (!response.ok) {
          throw new Error('failed to update note');
        }

        const updatedNote = await response.json();
        setNotes(notes.map(note => note.id === editingId ? updatedNote : note));
        setEditingId(null);
      } else {
        const response = await fetch(`${API_URL}/notes`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ title, content })
        })

        if (!response.ok) {
          throw new Error("Failed to create note!");
        }

        const newNote = await response.json();
        setNotes([...notes, newNote]);
      }

      setTitle('');
      setContent('');
    } catch (error) {
      alert(error.message);
    }
  }

  const handleEdit = (note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      const response = await fetch(`${API_URL}/notes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      setNotes(notes.filter(note => note.id !== id));
      if (editingId == id) {
        setEditingId(null);
        setTitle('');
        setContent('');
      }
    } catch (error) {
      alert(error.message);
    }

  }

  const handleCancel = () => {
    setEditingId(null)
    setTitle('')
    setContent('')
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }




  return (
    <div className="app">
      <header className="header">
        <h1>📝 NoteKeeper</h1>
        <p>Your simple, containerized note-taking app</p>
      </header>

      <div className="container">
        {/* Note Form */}
        <div className="note-form">
          <h2>{editingId ? 'Edit Note' : 'Create New Note'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note here..."
              />
            </div>

            <div className="btn-group">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update Note' : 'Add Note'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Notes List */}
        <div className="notes-section">
          <h2>Your Notes ({notes.length})</h2>

          {loading && <div className="loading">Loading notes...</div>}

          {error && <div className="error">Error: {error}</div>}

          {!loading && !error && notes.length === 0 && (
            <div className="empty-state">
              <h3>No notes yet</h3>
              <p>Create your first note to get started!</p>
            </div>
          )}

          {!loading && !error && notes.length > 0 && (
            <div className="notes-grid">
              {notes.map(note => (
                <div
                  key={note.id}
                  className={`note-card ${editingId === note.id ? 'selected' : ''}`}
                >
                  <h3>{note.title}</h3>
                  <p>{note.content}</p>
                  <div className="note-meta">
                    Last updated: {formatDate(note.updatedAt)}
                  </div>
                  <div className="note-actions">
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(note)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(note.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
