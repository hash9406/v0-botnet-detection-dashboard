// History page functionality

document.addEventListener('DOMContentLoaded', function() {
    const historyTable = document.getElementById('historyTable');
    const historyBody = document.getElementById('historyBody');
    const refreshBtn = document.getElementById('refreshBtn');
    const errorMessage = document.getElementById('errorMessage');
    const detailsModal = document.getElementById('detailsModal');
    const scanDetails = document.getElementById('scanDetails');
    const closeBtn = document.querySelector('.close');

    // Load history on page load
    loadHistory();

    // Refresh button handler
    refreshBtn.addEventListener('click', loadHistory);

    // Close modal handlers
    closeBtn.addEventListener('click', () => {
        detailsModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === detailsModal) {
            detailsModal.style.display = 'none';
        }
    });

    async function loadHistory() {
        try {
            errorMessage.style.display = 'none';
            historyBody.innerHTML = '<tr><td colspan="6" class="loading">Loading history...</td></tr>';

            const history = await window.ApiUtils.getHistory();

            if (history.length === 0) {
                historyBody.innerHTML = '<tr><td colspan="6" class="loading">No scan history found</td></tr>';
                return;
            }

            displayHistory(history);

        } catch (error) {
            showError('Failed to load history: ' + error.message);
            historyBody.innerHTML = '<tr><td colspan="6" class="loading">Error loading history</td></tr>';
        }
    }

    function displayHistory(history) {
        historyBody.innerHTML = '';

        history.forEach((scan, index) => {
            const row = document.createElement('tr');

            // Date & Time
            const timestampCell = document.createElement('td');
            timestampCell.textContent = window.ApiUtils.formatTimestamp(scan.timestamp);
            row.appendChild(timestampCell);

            // File Name
            const fileNameCell = document.createElement('td');
            fileNameCell.textContent = scan.file_info ? scan.file_info.filename : 'N/A';
            row.appendChild(fileNameCell);

            // File Size
            const fileSizeCell = document.createElement('td');
            fileSizeCell.textContent = scan.file_info ? window.ApiUtils.formatFileSize(scan.file_info.size) : 'N/A';
            row.appendChild(fileSizeCell);

            // Risk Score
            const riskScoreCell = document.createElement('td');
            riskScoreCell.textContent = scan.risk_score || 0;
            row.appendChild(riskScoreCell);

            // Verdict
            const verdictCell = document.createElement('td');
            const verdict = scan.verdict || 'UNKNOWN';
            verdictCell.innerHTML = `<span class="verdict-badge ${verdict.toLowerCase()}">${verdict}</span>`;
            row.appendChild(verdictCell);

            // Actions
            const actionsCell = document.createElement('td');
            const viewBtn = document.createElement('button');
            viewBtn.textContent = 'View Details';
            viewBtn.className = 'btn btn-secondary';
            viewBtn.addEventListener('click', () => showScanDetails(scan));
            actionsCell.appendChild(viewBtn);
            row.appendChild(actionsCell);

            historyBody.appendChild(row);
        });
    }

    function showScanDetails(scan) {
        scanDetails.innerHTML = '';

        // Header
        const header = document.createElement('h3');
        header.textContent = `Scan Details - ${scan.file_info ? scan.file_info.filename : 'Unknown File'}`;
        scanDetails.appendChild(header);

        // Timestamp
        const timestamp = document.createElement('p');
        timestamp.innerHTML = `<strong>Timestamp:</strong> ${window.ApiUtils.formatTimestamp(scan.timestamp)}`;
        scanDetails.appendChild(timestamp);

        // File Info
        if (scan.file_info) {
            const fileInfo = document.createElement('p');
            fileInfo.innerHTML = `<strong>File:</strong> ${scan.file_info.filename} (${window.ApiUtils.formatFileSize(scan.file_info.size)})`;
            scanDetails.appendChild(fileInfo);
        }

        // Risk Score and Verdict
        const riskVerdict = document.createElement('p');
        riskVerdict.innerHTML = `<strong>Risk Score:</strong> ${scan.risk_score}/100 | <strong>Verdict:</strong> <span class="verdict-badge ${scan.verdict.toLowerCase()}">${scan.verdict}</span>`;
        scanDetails.appendChild(riskVerdict);

        // Detection Results
        const sections = ['signature_based', 'host_based', 'behavior_based', 'gemini_analysis'];
        sections.forEach(section => {
            if (scan[section]) {
                const sectionDiv = document.createElement('div');
                sectionDiv.className = 'result-section';
                sectionDiv.innerHTML = `<h4>${section.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>`;

                const data = scan[section];
                if (typeof data === 'object') {
                    for (const [key, value] of Object.entries(data)) {
                        const p = document.createElement('p');
                        if (key === 'status' || key === 'verdict') {
                            p.innerHTML = `<strong>${key}:</strong> <span class="status ${value.toLowerCase()}">${value}</span>`;
                        } else if (Array.isArray(value)) {
                            p.innerHTML = `<strong>${key}:</strong>`;
                            const ul = document.createElement('ul');
                            value.forEach(item => {
                                const li = document.createElement('li');
                                li.textContent = typeof item === 'object' ? JSON.stringify(item) : item;
                                ul.appendChild(li);
                            });
                            sectionDiv.appendChild(p);
                            sectionDiv.appendChild(ul);
                            continue;
                        } else {
                            p.innerHTML = `<strong>${key}:</strong> ${value}`;
                        }
                        sectionDiv.appendChild(p);
                    }
                }

                scanDetails.appendChild(sectionDiv);
            }
        });

        detailsModal.style.display = 'block';
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
});
