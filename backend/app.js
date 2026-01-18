import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for notes
let notes = [
    {
        id: 1,
        title: 'Welcome to NoteKeeper',
        content: 'This is your first note! Start organizing your thoughts and ideas here. You can create, edit, and delete notes easily.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 2,
        title: 'Docker Benefits',
        content: 'Docker helps in:\n- Consistent environments\n- Easy deployment\n- Scalability\n- Isolation',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 3,
        title: 'Learning Goals',
        content: 'Master containerization and microservices architecture to build production-ready applications.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

// Health check
app.get('/', (req, res) => {
    res.json({
        message: 'NoteKeeper API is running',
        endpoints: {
            getNotes: 'GET /api/notes',
            getNote: 'GET /api/notes/:id',
            createNote: 'POST /api/notes',
            updateNote: 'PUT /api/notes/:id',
            deleteNote: 'DELETE /api/notes/:id'
        }
    });
});

// Get all notes
app.get('/api/notes', (req, res) => {
    // Sort by most recent first
    return res.json(notes);
});

// Get single note
app.get('/api/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const note = notes.find(n => n.id === id);

    if (!note) {
        return res.status(404).json({ error: 'Note not found' });
    }

    return res.json(note);
});

// Create new note
app.post('/api/notes', (req, res) => {
    const { title, content } = req.body;

    if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Note title is required' });
    }

    if (!content || content.trim() === '') {
        return res.status(400).json({ error: 'Note content is required' });
    }

    const newNote = {
        id: notes.length + 1,
        title: title.trim(),
        content: content.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    notes.push(newNote);
    return res.status(201).json(newNote);
});

// Update note
app.put('/api/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, content } = req.body;

    const note = notes.find(n => n.id === id);

    if (!note) {
        return res.status(404).json({ error: 'Note not found' });
    }

    if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Note title is required' });
    }

    if (!content || content.trim() === '') {
        return res.status(400).json({ error: 'Note content is required' });
    }

    note.title = title.trim();
    note.content = content.trim();
    note.updatedAt = new Date().toISOString();

    return res.json(note);
});

// Delete note
app.delete('/api/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = notes.length;

    notes = notes.filter(n => n.id !== id);

    if (notes.length === initialLength) {
        return res.status(404).json({ error: 'Note not found' });
    }

    return res.status(200).json({ message: 'Note deleted successfully', id });
});

// Start server
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
