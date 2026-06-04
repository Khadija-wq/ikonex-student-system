// Load and display class streams
async function loadClassStreams() {
    try {
        const classes = await getClassStreams();
        const tbody = document.getElementById('classStreamsBody');
        
        if (!tbody) return;
        
        if (classes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3">No class streams found</td></tr>';
            return;
        }
        
        tbody.innerHTML = classes.map(cls => `
            <tr>
                <td>${cls.name}</td>
                <td>${cls.code}</td>
                <td>
                    <button class="btn btn-edit btn-sm" onclick="editClassStream(${cls.id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteClassStreamRecord(${cls.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading class streams:', error);
    }
}

// Open add modal
function openAddClassModal() {
    document.getElementById('classModalTitle').textContent = 'Add Class Stream';
    document.getElementById('classForm').reset();
    document.getElementById('classId').value = '';
    document.getElementById('classModal').style.display = 'flex';
}

// Close modal
function closeClassModal() {
    document.getElementById('classModal').style.display = 'none';
}

// Save class stream
async function saveClassStream(event) {
    event.preventDefault();
    
    const data = {
        name: document.getElementById('className').value,
        code: document.getElementById('classCode').value
    };
    
    try {
        await createClassStream(data);
        alert('Class stream added successfully');
        closeClassModal();
        loadClassStreams();
    } catch (error) {
        alert('Error saving class stream: ' + error.message);
    }
}

// Delete class stream
async function deleteClassStreamRecord(id) {
    if (confirm('Are you sure you want to delete this class stream?')) {
        try {
            await deleteClassStream(id);
            alert('Class stream deleted successfully');
            loadClassStreams();
        } catch (error) {
            alert('Error deleting class stream: ' + error.message);
        }
    }
}

// Load when page ready
if (document.getElementById('classStreamsBody')) {
    loadClassStreams();
}