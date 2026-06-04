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
    const response = await apiFetch('/class-streams');
    return response.data;
}

async function createClassStream(data) {
    const response = await apiFetch('/class-streams', {
        method: 'POST',
        body: JSON.stringify(data)
    });
    return response.data;
}

async function updateClassStream(id, data) {
    const response = await apiFetch(`/class-streams/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
    return response;
}

async function deleteClassStream(id) {
    const response = await apiFetch(`/class-streams/${id}`, {
        method: 'DELETE'
    });
    return response;
}

// ============ STUDENTS ============
async function getStudents() {
    const response = await apiFetch('/students');
    return response.data;
}

async function getStudentsByClass(classId) {
    const response = await apiFetch(`/students/class/${classId}`);
    return response.data;
}

async function getStudent(id) {
    const response = await apiFetch(`/students/${id}`);
    return response.data;
}

async function createStudent(data) {
    const response = await apiFetch('/students', {
        method: 'POST',
        body: JSON.stringify(data)
    });
    return response.data;
}

async function updateStudent(id, data) {
    const response = await apiFetch(`/students/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
    return response;
}

async function deleteStudent(id) {
    const response = await apiFetch(`/students/${id}`, {
        method: 'DELETE'
    });
    return response;
}

// ============ SUBJECTS ============
async function getSubjects() {
    const response = await apiFetch('/subjects');
    return response.data;
}

async function getSubjectsByClass(classId) {
    const response = await apiFetch(`/subjects/class/${classId}`);
    return response.data;
}

async function createSubject(data) {
    const response = await apiFetch('/subjects', {
        method: 'POST',
        body: JSON.stringify(data)
    });
    return response.data;
}

async function updateSubject(id, data) {
    const response = await apiFetch(`/subjects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
    return response;
}

async function deleteSubject(id) {
    const response = await apiFetch(`/subjects/${id}`, {
        method: 'DELETE'
    });
    return response;
}

// ============ SCORES ============
async function enterScore(data) {
    const response = await apiFetch('/scores', {
        method: 'POST',
        body: JSON.stringify(data)
    });
    return response;
}

async function getStudentScores(studentId, term, year) {
    const response = await apiFetch(`/scores/student/${studentId}/${term}/${year}`);
    return response.data;
}

// ============ REPORTS ============
async function getClassRanking(classId, term, year) {
    const response = await apiFetch(`/reports/class-ranking/${classId}/${term}/${year}`);
    return response.data;
}

async function getStudentReport(studentId, term, year) {
    const response = await apiFetch(`/reports/student-report/${studentId}/${term}/${year}`);
    return response.data;
}