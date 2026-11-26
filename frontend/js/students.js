// 1. Security Check: Ensure the user is logged in
if (localStorage.getItem('isLoggedIn') !== 'true') {
    // Because this file is in the /pages/ folder, we need to go up one level to find login.html
    window.location.href = '../login.html';
}

// 2. Load Students Table
async function loadStudents() {
    const tbody = document.getElementById('studentsBody'); // Make sure your HTML table body has this ID
    if (!tbody) return;

    try {
        const students = await getStudents();
        
        if (!Array.isArray(students) || students.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No students found. Add one above!</td></tr>';
            return;
        }

        tbody.innerHTML = students.map(student => `
            <tr>
                <td>${student.admission_number || 'N/A'}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 30px; height: 30px; background: #667eea; color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 12px; font-weight: bold;">
                            ${student.full_name ? student.full_name.charAt(0).toUpperCase() : '?'}
                        </div>
                        ${student.full_name || 'N/A'}
                    </div>
                </td>
                <td><span style="background: #e2e8f0; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;">${student.class_name || 'N/A'}</span></td>
                <td>
                    <button class="btn btn-edit btn-sm" onclick="editStudent(${student.id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteStudent(${student.id})">Delete</button>
                </td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('Error loading students:', error);
        tbody.innerHTML = '<tr><td colspan="5" style="color: red; text-align:center;">Failed to load students.</td></tr>';
    }
}

// 3. Load Classes for the Dropdown
async function loadClassesForDropdown() {
    const select = document.getElementById('classStream');
    if (!select) return;

    try {
        const classes = await getClassStreams();
        select.innerHTML = '<option value="">Select Class</option>';
        
        if (Array.isArray(classes)) {
            classes.forEach(cls => {
                const option = document.createElement('option');
                option.value = cls.id;
                option.textContent = `${cls.name} (${cls.code})`;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading classes:', error);
    }
}

// 4. Add New Student
async function addStudent(event) {
    event.preventDefault();
    
    const admission_number = document.getElementById('admissionNumber').value;
    const full_name = document.getElementById('fullName').value;
    const class_stream_id = document.getElementById('classStream').value;

    try {
        await createStudent({
            admission_number,
            full_name,
            class_stream_id
        });
        
        // Clear form
        document.getElementById('admissionNumber').value = '';
        document.getElementById('fullName').value = '';
        document.getElementById('classStream').value = '';
        
        // Reload table
        loadStudents();
        alert('Student added successfully!');
    } catch (error) {
        alert('Error adding student: ' + error.message);
    }
}

// 5. Delete Student (Placeholder for now)
async function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        try {
            // You will need to create the deleteStudent function in api.js
            // await apiDeleteStudent(id); 
            alert('Delete functionality coming soon!');
        } catch (error) {
            alert('Error deleting student');
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadStudents();
    loadClassesForDropdown();

    const form = document.getElementById('studentForm');
    if (form) {
        form.addEventListener('submit', addStudent);
    }
});