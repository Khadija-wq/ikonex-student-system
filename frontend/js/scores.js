// Load classes for dropdown
async function loadScoreClasses() {
    try {
        console.log('Loading classes...');
        const classes = await getClassStreams();
        console.log('Classes loaded:', classes);
        
        const select = document.getElementById('classSelect');
        if (select) {
            select.innerHTML = '<option value="">Select Class</option>' +
                classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        }
    } catch (error) {
        console.error('Error loading classes:', error);
        alert('Error loading classes: ' + error.message);
    }
}

// Load students by class
async function loadStudentsByClass() {
    const classId = document.getElementById('classSelect').value;
    console.log('Selected class ID:', classId);
    
    if (!classId) {
        document.getElementById('studentSelect').innerHTML = '<option value="">Select Student</option>';
        document.getElementById('scoresForm').style.display = 'none';
        return;
    }
    
    try {
        console.log('Loading students for class:', classId);
        const students = await getStudents();
        console.log('All students:', students);
        
        // Filter students by class ID
        const filteredStudents = students.filter(s => s.class_stream_id == classId);
        console.log('Filtered students:', filteredStudents);
        
        const select = document.getElementById('studentSelect');
        if (filteredStudents.length === 0) {
            select.innerHTML = '<option value="">No students in this class</option>';
            document.getElementById('scoresForm').style.display = 'none';
            return;
        }
        
        select.innerHTML = '<option value="">Select Student</option>' +
            filteredStudents.map(s => `<option value="${s.id}">${s.full_name} (${s.admission_number})</option>`).join('');
        
        console.log('Student dropdown updated');
    } catch (error) {
        console.error('Error loading students:', error);
        alert('Error loading students: ' + error.message);
    }
}

// Load subjects for score entry
async function loadSubjectsForScore() {
    const classId = document.getElementById('classSelect').value;
    console.log('Loading subjects for class:', classId);
    
    if (!classId) {
        document.getElementById('scoresForm').style.display = 'none';
        return;
    }
    
    try {
        // Get subjects assigned to this class
        const allSubjects = await getSubjects();
        console.log('All subjects:', allSubjects);
        
        const container = document.getElementById('subjectsContainer');
        
        if (allSubjects.length === 0) {
            container.innerHTML = '<p>No subjects available. Please add subjects first.</p>';
            document.getElementById('scoresForm').style.display = 'block';
            return;
        }
        
        container.innerHTML = allSubjects.map(subject => `
            <div class="form-row" style="margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                <div class="form-group">
                    <label><strong>${subject.name}</strong> (${subject.code})</label>
                </div>
                <div class="form-group">
                    <label>Exam Score (0-100)</label>
                    <input type="number" class="exam-score" data-subject-id="${subject.id}" 
                           min="0" max="100" step="0.01" placeholder="Exam score">
                </div>
                <div class="form-group">
                    <label>CA Score (0-100)</label>
                    <input type="number" class="ca-score" data-subject-id="${subject.id}" 
                           min="0" max="100" step="0.01" placeholder="CA score">
                </div>
            </div>
        `).join('');
        
        document.getElementById('scoresForm').style.display = 'block';
        console.log('Score form displayed');
    } catch (error) {
        console.error('Error loading subjects:', error);
        alert('Error loading subjects: ' + error.message);
    }
}

// Save all scores
async function saveAllScores(event) {
    event.preventDefault();
    
    const studentId = document.getElementById('studentSelect').value;
    console.log('Saving scores for student ID:', studentId);
    
    if (!studentId) {
        alert('Please select a student');
        return;
    }
    
    const examInputs = document.querySelectorAll('.exam-score');
    const caInputs = document.querySelectorAll('.ca-score');
    
    let hasError = false;
    
    for (let i = 0; i < examInputs.length; i++) {
        const subjectId = examInputs[i].dataset.subjectId;
        let examScore = examInputs[i].value;
        let caScore = caInputs[i].value;
        
        // Handle empty values
        if (examScore === '') examScore = 0;
        if (caScore === '') caScore = 0;
        
        const examScoreNum = parseFloat(examScore);
        const caScoreNum = parseFloat(caScore);
        
        if (isNaN(examScoreNum) || isNaN(caScoreNum)) {
            alert('Please enter valid numbers for all scores');
            hasError = true;
            return;
        }
        
        if (examScoreNum < 0 || examScoreNum > 100 || caScoreNum < 0 || caScoreNum > 100) {
            alert('Scores must be between 0 and 100');
            hasError = true;
            return;
        }
        
        try {
            console.log(`Saving: student=${studentId}, subject=${subjectId}, exam=${examScoreNum}, ca=${caScoreNum}`);
            await enterScore({
                student_id: parseInt(studentId),
                subject_id: parseInt(subjectId),
                exam_score: examScoreNum,
                ca_score: caScoreNum,
                term: CURRENT_TERM,
                academic_year: CURRENT_YEAR
            });
        } catch (error) {
            console.error(`Error saving score for subject ${subjectId}:`, error);
            alert(`Error saving score: ${error.message}`);
            hasError = true;
            return;
        }
    }
    
    if (!hasError) {
        alert('All scores saved successfully!');
        // Clear the form
        document.querySelectorAll('.exam-score, .ca-score').forEach(input => input.value = '');
    }
}

// Initialize when page loads
if (document.getElementById('classSelect')) {
    console.log('Scores page loaded, initializing...');
    loadScoreClasses();
    
    // Add event listener for class selection
    document.getElementById('classSelect').addEventListener('change', function() {
        console.log('Class changed to:', this.value);
        loadStudentsByClass();
        loadSubjectsForScore();
    });
}