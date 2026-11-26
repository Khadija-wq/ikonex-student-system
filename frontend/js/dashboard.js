// Check if user is logged in
if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}
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
        
        // Safety check: ensure we are getting arrays back
        const studentCount = Array.isArray(students) ? students.length : 0;
        const classCount = Array.isArray(classes) ? classes.length : 0;
        const subjectCount = Array.isArray(subjects) ? subjects.length : 0;
        
        document.getElementById('totalStudents').textContent = studentCount;
        document.getElementById('totalClasses').textContent = classCount;
        document.getElementById('totalSubjects').textContent = subjectCount;
        document.getElementById('avgPerformance').textContent = '75%';
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load recent students
async function loadRecentStudents() {
    const tbody = document.getElementById('recentStudentsBody');
    
    try {
        const students = await getStudents();
        
        // Safety check: ensure students is an array before slicing
        const recentStudents = Array.isArray(students) ? students.slice(0, 5) : [];
        
        if (recentStudents.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">No students found</td></tr>';
            return;
        }
        
        tbody.innerHTML = recentStudents.map(student => `
            <tr>
                <td>${student.admission_number || 'N/A'}</td>
                <td>${student.full_name || 'N/A'}</td>
                <td>${student.class_name || 'N/A'}</td>
                <td><button class="btn btn-primary btn-sm" onclick="alert('View student ID: ${student.id}')">View</button></td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Error loading recent students:', error);
        // If the API fails, show this instead of staying stuck on "Loading..."
        tbody.innerHTML = '<tr><td colspan="4" style="color: red;">Failed to load data. Check console.</td></tr>';
    }
}

// Initialize dashboard
displayCurrentDate();
loadDashboardStats();
loadRecentStudents();