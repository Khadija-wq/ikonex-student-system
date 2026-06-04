// Reports page - Backend on port 5001
const BACKEND_URL = 'http://localhost:5001/api';

console.log('Reports loaded - Backend:', BACKEND_URL);

window.addEventListener('load', async () => {
    console.log('Page loaded');
    
    try {
        // Load classes
        const classRes = await fetch(BACKEND_URL + '/class-streams');
        const classData = await classRes.json();
        console.log('Classes:', classData);
        
        const select = document.getElementById('classSelect');
        select.innerHTML = '<option value="">Select Class</option>';
        
        if (classData.success && classData.data.length > 0) {
            classData.data.forEach(c => {
                const option = document.createElement('option');
                option.value = c.id;
                option.textContent = `${c.name} (${c.code})`;
                select.appendChild(option);
            });
            console.log('Added', classData.data.length, 'classes');
        }
        
        // When class selected
        select.onchange = async () => {
            const classId = select.value;
            if (!classId) {
                document.getElementById('rankingSection').style.display = 'none';
                return;
            }
            
            console.log('Loading ranking for class:', classId);
            
            try {
                const rankRes = await fetch(BACKEND_URL + `/reports/class-ranking/${classId}/Term%201/2025-2026`);
                const rankData = await rankRes.json();
                console.log('Ranking:', rankData);
                
                const tbody = document.getElementById('rankingBody');
                if (rankData.success && rankData.data && rankData.data.length > 0) {
                    tbody.innerHTML = rankData.data.map(s => `
                        <tr>
                            <td>${s.position || '-'}</td>
                            <td>${s.admission_number || '-'}</td>
                            <td>${s.full_name || '-'}</td>
                            <td>${s.total_marks || 0}</td>
                            <td>${s.average_score ? s.average_score.toFixed(2) : '0'}</td>
                            <td>${s.grade || '-'}</td>
                        </tr>
                    `).join('');
                    document.getElementById('rankingSection').style.display = 'block';
                } else {
                    tbody.innerHTML = '<tr><td colspan="6">No scores entered yet. Go to Enter Scores page first.</td></tr>';
                    document.getElementById('rankingSection').style.display = 'block';
                }
            } catch (err) {
                console.error('Error loading ranking:', err);
                document.getElementById('rankingBody').innerHTML = '<tr><td colspan="6">Error loading ranking. Make sure backend is running.</td></tr>';
            }
        };
        
    } catch (err) {
        console.error('Error loading classes:', err);
        alert('Error: ' + err.message + '\n\nMake sure backend is running on port 5001');
    }
});