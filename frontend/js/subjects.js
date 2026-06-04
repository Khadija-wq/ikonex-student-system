// Load and display subjects
async function loadSubjects() {
    try {
        const subjects = await getSubjects();
        const tbody = document.getElementById('subjectsBody');
        
        if (!tbody) return;
        
        if (subjects.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3">No subjects found</td></tr>';
            return;
        }
        
        tbody.innerHTML = subjects.map(subject => `
            <tr>
                <td>${subject.name}</td>
                <td>${subject.code}</td>
                <td>
                    <button class="btn btn-edit btn-sm" onclick="editSubject(${subject.id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteSubjectRecord(${subject.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading subjects:', error);
    }
}

// Open add modal
function openAddSubjectModal() {
    document.getElementById('subjectModalTitle').textContent = 'Add Subject';
    document.getElementById('subjectForm').reset();
    document.getElementById('subjectId').value = '';
    document.getElementById('subjectModal').style.display = 'flex';
}

// Close modal
function closeSubjectModal() {
    document.getElementById('subjectModal').style.display = 'none';
}

// Save subject
async function saveSubject(event) {
    event.preventDefault();
    
    const data = {
        name: document.getElementById('subjectName').value,
        code: document.getElementById('subjectCode').value
    };
    
    try {
        await createSubject(data);
        alert('Subject added successfully');
        closeSubjectModal();
        loadSubjects();
    } catch (error) {
        alert('Error saving subject: ' + error.message);
    }
}

// Delete subject
async function deleteSubjectRecord(id) {
    if (confirm('Are you sure you want to delete this subject?')) {
        try {
            await deleteSubject(id);
            alert('Subject deleted successfully');
            loadSubjects();
        } catch (error) {
            alert('Error deleting subject: ' + error.message);
        }
    }
}

// Load when page ready
if (document.getElementById('subjectsBody')) {
    loadSubjects();
}