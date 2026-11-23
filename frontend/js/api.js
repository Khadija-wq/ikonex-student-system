// Base API fetch function
async function apiFetch(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: { 'Content-Type': 'application/json' },
            ...options
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Something went wrong');
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ============ CLASS STREAMS ============
async function getClassStreams() {
    return await apiFetch('/class-streams'); // Fixed
}

async function createClassStream(data) {
    return await apiFetch('/class-streams', {
        method: 'POST',
        body: JSON.stringify(data)
    }); // Fixed
}

async function updateClassStream(id, data) {
    return await apiFetch(`/class-streams/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }); // Fixed
}

async function deleteClassStream(id) {
    return await apiFetch(`/class-streams/${id}`, {
        method: 'DELETE'
    }); // Fixed
}

// ============ STUDENTS ============
async function getStudents() {
    return await apiFetch('/students'); // Fixed
}

async function getStudentsByClass(classId) {
    return await apiFetch(`/students/class/${classId}`); // Fixed
}

async function getStudent(id) {
    return await apiFetch(`/students/${id}`); // Fixed
}

async function createStudent(data) {
    return await apiFetch('/students', {
        method: 'POST',
        body: JSON.stringify(data)
    }); // Fixed
}

async function updateStudent(id, data) {
    return await apiFetch(`/students/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }); // Fixed
}

async function deleteStudent(id) {
    return await apiFetch(`/students/${id}`, {
        method: 'DELETE'
    }); // Fixed
}

// ============ SUBJECTS ============
async function getSubjects() {
    return await apiFetch('/subjects'); // Fixed
}

async function getSubjectsByClass(classId) {
    return await apiFetch(`/subjects/class/${classId}`); // Fixed
}

async function createSubject(data) {
    return await apiFetch('/subjects', {
        method: 'POST',
        body: JSON.stringify(data)
    }); // Fixed
}

async function updateSubject(id, data) {
    return await apiFetch(`/subjects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }); // Fixed
}

async function deleteSubject(id) {
    return await apiFetch(`/subjects/${id}`, {
        method: 'DELETE'
    }); // Fixed
}

// ============ SCORES ============
async function enterScore(data) {
    return await apiFetch('/scores', {
        method: 'POST',
        body: JSON.stringify(data)
    }); // Fixed
}

async function getStudentScores(studentId, term, year) {
    return await apiFetch(`/scores/student/${studentId}/${term}/${year}`); // Fixed
}

// ============ REPORTS ============
async function getClassRanking(classId, term, year) {
    return await apiFetch(`/reports/class-ranking/${classId}/${term}/${year}`); // Fixed
}

async function getStudentReport(studentId, term, year) {
    return await apiFetch(`/reports/student-report/${studentId}/${term}/${year}`); // Fixed
}