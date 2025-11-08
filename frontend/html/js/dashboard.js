// Dashboard functionality

document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const resultsSection = document.getElementById('resultsSection');
    const errorMessage = document.getElementById('errorMessage');
    const spinner = document.getElementById('spinner');
    const btnText = document.querySelector('.btn-text');

    // File input change handler
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            fileName.textContent = file.name;
            fileSize.textContent = window.ApiUtils.formatFileSize(file.size);
            fileInfo.style.display = 'block';
            analyzeBtn.disabled = false;
        } else {
            fileInfo.style.display = 'none';
            analyzeBtn.disabled = true;
        }
    });

    // Form submit handler
    uploadForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const file = fileInput.files[0];
        if (!file) return;

        // Show loading state
        analyzeBtn.disabled = true;
        spinner.style.display = 'block';
        btnText.textContent = 'Analyzing...';
        errorMessage.style.display = 'none';
        resultsSection.style.display = 'none';

        try {
            // Check API health first
            const isHealthy = await window.ApiUtils.checkApiHealth();
            if (!isHealthy) {
                throw new Error('Backend API is not available. Please start the Flask server.');
            }

            // Analyze file
            const results = await window.ApiUtils.analyzeFile(file);

            // Display results
            displayResults(results);

        } catch (error) {
            showError(error.message);
        } finally {
            // Reset loading state
            analyzeBtn.disabled = false;
            spinner.style.display = 'none';
            btnText.textContent = 'Analyze File';
        }
    });

    function displayResults(results) {
        // Update verdict badge
        const verdictBadge = document.getElementById('verdictBadge');
        const verdict = results.verdict.toLowerCase();
        verdictBadge.textContent = results.verdict;
        verdictBadge.className = `verdict-badge ${verdict}`;

        // Update risk score
        const riskScore = document.getElementById('riskScore');
        const progressFill = document.getElementById('progressFill');
        riskScore.textContent = results.risk_score;
        progressFill.style.width = `${results.risk_score}%`;

        // Display detection results
        displayDetectionResult('signatureResults', results.signature_based);
        displayDetectionResult('hostResults', results.host_based);
        displayDetectionResult('behaviorResults', results.behavior_based);
        displayGeminiResult('geminiResults', results.gemini_analysis);

        // Show results section
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    function displayDetectionResult(elementId, data) {
        const element = document.getElementById(elementId);
        element.innerHTML = '';

        if (typeof data === 'object' && data !== null) {
            for (const [key, value] of Object.entries(data)) {
                const p = document.createElement('p');

                if (key === 'status') {
                    p.innerHTML = `<strong>Status:</strong> <span class="status ${value.toLowerCase()}">${value}</span>`;
                } else if (key === 'threat_count' || key === 'suspicious_count') {
                    p.innerHTML = `<strong>${key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> ${value}`;
                } else if (key === 'message') {
                    p.innerHTML = `<strong>Message:</strong> ${value}`;
                } else if (key === 'threats' && Array.isArray(value)) {
                    p.innerHTML = `<strong>Threats Found:</strong> ${value.length}`;
                    if (value.length > 0) {
                        const ul = document.createElement('ul');
                        value.slice(0, 3).forEach(threat => {
                            const li = document.createElement('li');
                            li.textContent = `${threat.type}: ${threat.value}`;
                            ul.appendChild(li);
                        });
                        if (value.length > 3) {
                            const li = document.createElement('li');
                            li.textContent = `... and ${value.length - 3} more`;
                            ul.appendChild(li);
                        }
                        element.appendChild(ul);
                    }
                } else if (key === 'suspicious_processes' && Array.isArray(value)) {
                    p.innerHTML = `<strong>Suspicious Processes:</strong> ${value.length}`;
                    if (value.length > 0) {
                        const ul = document.createElement('ul');
                        value.slice(0, 3).forEach(proc => {
                            const li = document.createElement('li');
                            li.textContent = `${proc.process_name || proc.name}: CPU ${proc.cpu}%, Memory ${proc.memory}MB`;
                            ul.appendChild(li);
                        });
                        if (value.length > 3) {
                            const li = document.createElement('li');
                            li.textContent = `... and ${value.length - 3} more`;
                            ul.appendChild(li);
                        }
                        element.appendChild(ul);
                    }
                } else {
                    p.innerHTML = `<strong>${key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> ${JSON.stringify(value)}`;
                }

                element.appendChild(p);
            }
        } else {
            element.innerHTML = '<p>No data available</p>';
        }
    }

    function displayGeminiResult(elementId, data) {
        const element = document.getElementById(elementId);
        element.innerHTML = '';

        if (typeof data === 'object' && data !== null) {
            for (const [key, value] of Object.entries(data)) {
                const p = document.createElement('p');

                if (key === 'verdict') {
                    p.innerHTML = `<strong>Verdict:</strong> <span class="status ${value.toLowerCase()}">${value}</span>`;
                } else if (key === 'explanation') {
                    p.innerHTML = `<strong>Explanation:</strong> ${value}`;
                } else if (key === 'recommendations' && Array.isArray(value)) {
                    p.innerHTML = `<strong>Recommendations:</strong>`;
                    const ul = document.createElement('ul');
                    value.forEach(rec => {
                        const li = document.createElement('li');
                        li.textContent = rec;
                        ul.appendChild(li);
                    });
                    element.appendChild(p);
                    element.appendChild(ul);
                    continue;
                } else {
                    p.innerHTML = `<strong>${key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> ${value}`;
                }

                element.appendChild(p);
            }
        } else {
            element.innerHTML = '<p>AI analysis not available</p>';
        }
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
});
