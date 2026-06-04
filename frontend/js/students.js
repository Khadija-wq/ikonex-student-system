// Load and display students
async function loadStudents() {
    try {
        const students = await getStudents();
        const tbody = document.getElementById('studentsTableBody');
        
        if (!tbody) return;
        
        if (students.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">No students found</td></tr>';
            return;
        }
        
        tbody.innerHTML = students.map(student => `
            <tr>
                <td>${student.admission_number}</td>
                <td>${student.full_name}</td>
                <td>${student.class_name}</td>
                <td>
                    <button class="btn btn-edit btn-sm" onclick="editStudent(${student.id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteStudentRecord(${student.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading students:', error);
    }
}

// Load class streams for dropdown
async function loadClassStreamsForForm() {
    try {
        const classes = await getClassStreams();
        const select = document.getElementById('classStreamId');
        if (select) {
            select.innerHTML = '<option value="">Select Class</option>' +
                classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        }
    } catch (error) {
        console.error('Error loading classes:', error);
    }
}

// Open add student modal
function openAddStudentModal() {
    document.getElementById('modalTitle').textContent = 'Register New Student';
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = '';
    document.getElementById('studentModal').style.display = 'flex';
}

// Close modal
function closeModal() {
    document.getElementById('studentModal').style.display = 'none';
}

// Save student
async function saveStudent(event) {
    event.preventDefault();
    
    const studentId = document.getElementById('studentId').value;
    const data = {
        admission_number: document.getElementById('admissionNumber').value,
        full_name: document.getElementById('fullName').value,
        class_stream_id: document.getElementById('classStreamId').value
    };
    
    try {
        if (studentId) {
            await updateStudent(studentId, data);
            alert('Student updated successfully');
        } else {
            await createStudent(data);
            alert('Student registered successfully');
        }
        closeModal();
        loadStudents();
    } catch (error) {
        alert('Error saving student: ' + error.message);
    }
}

// Delete student
async function deleteStudentRecord(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        try {
            await deleteStudent(id);
            alert('Student deleted successfully');
            loadStudents();
        } catch (error) {
            alert('Error deleting student: ' + error.message);
        }
    }
}

// Load all data when page loads
if (document.getElementById('studentsTableBody')) {
    loadStudents();
    loadClassStreamsForForm();
}