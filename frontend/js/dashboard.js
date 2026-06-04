// Display current date
function displayCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

// Load dashboard stats
async function loadDashboardStats() {
    try {
        const students = await getStudents();
        const classes = await getClassStreams();
        const subjects = await getSubjects();
        
        document.getElementById('totalStudents').textContent = students.length;
        document.getElementById('totalClasses').textContent = classes.length;
        document.getElementById('totalSubjects').textContent = subjects.length;
        document.getElementById('avgPerformance').textContent = '75%';
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load recent students
async function loadRecentStudents() {
    try {
        const students = await getStudents();
        const recentStudents = students.slice(0, 5);
        
        const tbody = document.getElementById('recentStudentsBody');
        if (recentStudents.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">No students found</td></tr>';
            return;
        }
        
        tbody.innerHTML = recentStudents.map(student => `
            <tr>
                <td>${student.admission_number}</td>
                <td>${student.full_name}</td>
                <td>${student.class_name}</td>
                <td><button class="btn btn-primary btn-sm" onclick="alert('View student ID: ${student.id}')">View</button></td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading recent students:', error);
    }
}

// Initialize dashboard
displayCurrentDate();
loadDashboardStats();
loadRecentStudents();