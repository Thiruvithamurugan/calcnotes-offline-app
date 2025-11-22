// Notes Module - Full CRUD with Auto-save

class NotesApp {
    constructor() {
        this.notes = [];
        this.currentNote = null;
        this.autoSaveTimer = null;
        this.STORAGE_KEY = 'calcnotes_data';

        // DOM Elements
        this.notesList = document.getElementById('notesList');
        this.emptyState = document.getElementById('emptyState');
        this.noteEditor = document.getElementById('noteEditor');
        this.searchInput = document.getElementById('searchInput');
        this.newNoteBtn = document.getElementById('newNoteBtn');
        this.backBtn = document.getElementById('backBtn');
        this.pinBtn = document.getElementById('pinBtn');
        this.deleteBtn = document.getElementById('deleteBtn');
        this.noteTitle = document.getElementById('noteTitle');
        this.noteContent = document.getElementById('noteContent');
        this.createdDate = document.getElementById('createdDate');
        this.modifiedDate = document.getElementById('modifiedDate');

        this.init();
    }

    init() {
        // Load notes from localStorage
        this.loadNotes();

        // Event listeners
        this.newNoteBtn.addEventListener('click', () => this.createNewNote());
        this.backBtn.addEventListener('click', () => this.closeEditor());
        this.pinBtn.addEventListener('click', () => this.togglePin());
        this.deleteBtn.addEventListener('click', () => this.deleteNote());
        this.searchInput.addEventListener('input', (e) => this.filterNotes(e.target.value));

        // Auto-save on input
        this.noteTitle.addEventListener('input', () => this.scheduleAutoSave());
        this.noteContent.addEventListener('input', () => this.scheduleAutoSave());

        // Initial render
        this.renderNotesList();
    }

    loadNotes() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            this.notes = stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading notes:', error);
            this.notes = [];
        }
    }

    saveNotes() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.notes));
        } catch (error) {
            console.error('Error saving notes:', error);
        }
    }

    createNewNote() {
        const note = {
            id: this.generateId(),
            title: '',
            content: '',
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString(),
            pinned: false
        };

        this.notes.unshift(note);
        this.saveNotes();
        this.openEditor(note);
    }

    openEditor(note) {
        this.currentNote = note;

        // Populate editor
        this.noteTitle.value = note.title;
        this.noteContent.value = note.content;
        this.createdDate.textContent = this.formatDate(note.createdAt);
        this.modifiedDate.textContent = this.formatDate(note.modifiedAt);

        // Update pin button state
        if (note.pinned) {
            this.pinBtn.classList.add('active');
        } else {
            this.pinBtn.classList.remove('active');
        }

        // Show editor
        this.noteEditor.style.display = 'flex';

        // Focus on title if empty, otherwise content
        setTimeout(() => {
            if (!note.title) {
                this.noteTitle.focus();
            } else {
                this.noteContent.focus();
            }
        }, 100);
    }

    closeEditor() {
        // Save before closing
        if (this.currentNote) {
            this.saveCurrentNote();

            // Remove note if both title and content are empty
            if (!this.currentNote.title && !this.currentNote.content) {
                this.notes = this.notes.filter(n => n.id !== this.currentNote.id);
                this.saveNotes();
            }
        }

        this.noteEditor.style.display = 'none';
        this.currentNote = null;
        this.renderNotesList();
    }

    saveCurrentNote() {
        if (!this.currentNote) return;

        const noteIndex = this.notes.findIndex(n => n.id === this.currentNote.id);
        if (noteIndex === -1) return;

        this.notes[noteIndex].title = this.noteTitle.value || 'Untitled Note';
        this.notes[noteIndex].content = this.noteContent.value;
        this.notes[noteIndex].modifiedAt = new Date().toISOString();

        // Update current note reference
        this.currentNote = this.notes[noteIndex];

        // Update modified date display
        this.modifiedDate.textContent = this.formatDate(this.currentNote.modifiedAt);

        this.saveNotes();
    }

    scheduleAutoSave() {
        // Clear existing timer
        if (this.autoSaveTimer) {
            clearTimeout(this.autoSaveTimer);
        }

        // Save after 500ms of no typing
        this.autoSaveTimer = setTimeout(() => {
            this.saveCurrentNote();
        }, 500);
    }

    togglePin() {
        if (!this.currentNote) return;

        const noteIndex = this.notes.findIndex(n => n.id === this.currentNote.id);
        if (noteIndex === -1) return;

        this.notes[noteIndex].pinned = !this.notes[noteIndex].pinned;
        this.currentNote.pinned = this.notes[noteIndex].pinned;

        // Update pin button state
        if (this.currentNote.pinned) {
            this.pinBtn.classList.add('active');
        } else {
            this.pinBtn.classList.remove('active');
        }

        this.saveNotes();
    }

    deleteNote() {
        if (!this.currentNote) return;

        // Confirm deletion
        const confirmDelete = confirm('Are you sure you want to delete this note?');
        if (!confirmDelete) return;

        this.notes = this.notes.filter(n => n.id !== this.currentNote.id);
        this.saveNotes();
        this.closeEditor();
    }

    renderNotesList(filteredNotes = null) {
        const notesToRender = filteredNotes || this.notes;

        // Clear existing notes
        this.notesList.innerHTML = '';

        // Show empty state if no notes
        if (notesToRender.length === 0) {
            this.emptyState.style.display = 'flex';
            return;
        }

        this.emptyState.style.display = 'none';

        // Sort: pinned first, then by modified date
        const sortedNotes = [...notesToRender].sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return new Date(b.modifiedAt) - new Date(a.modifiedAt);
        });

        // Render each note
        sortedNotes.forEach(note => {
            const noteItem = this.createNoteElement(note);
            this.notesList.appendChild(noteItem);
        });
    }

    createNoteElement(note) {
        const div = document.createElement('div');
        div.className = `note-item${note.pinned ? ' pinned' : ''}`;
        div.addEventListener('click', () => this.openEditor(note));

        const title = note.title || 'Untitled Note';
        const preview = note.content.substring(0, 100) || 'No content';
        const date = this.formatDate(note.modifiedAt);

        div.innerHTML = `
            <div class="note-item-header">
                <h3 class="note-item-title">${this.escapeHtml(title)}</h3>
            </div>
            <p class="note-item-preview">${this.escapeHtml(preview)}</p>
            <span class="note-item-date">${date}</span>
        `;

        return div;
    }

    filterNotes(query) {
        if (!query.trim()) {
            this.renderNotesList();
            return;
        }

        const lowerQuery = query.toLowerCase();
        const filtered = this.notes.filter(note => {
            const titleMatch = note.title.toLowerCase().includes(lowerQuery);
            const contentMatch = note.content.toLowerCase().includes(lowerQuery);
            return titleMatch || contentMatch;
        });

        this.renderNotesList(filtered);
    }

    generateId() {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

        // Format as date
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize notes app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NotesApp();
});
