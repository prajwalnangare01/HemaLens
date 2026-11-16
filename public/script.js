document.addEventListener('DOMContentLoaded', () => {
    const resultsSection = document.getElementById('resultsSection');
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const loadingOverlay = document.getElementById('loadingOverlay');

    const navLinks = document.querySelectorAll('.nav-links a');

    // Handle Nav Active State
    // (Removed static navLinks listener as we handle navigation manually for History/Home)

    // Drag and Drop (Only on Index Page)
    if (uploadZone) {
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('drag-over');
        });

        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('drag-over');
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) handleFile(files[0]);
        });
    }

    if (uploadBtn && fileInput) {
        uploadBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) handleFile(e.target.files[0]);
        });
    }

    const sampleBtn = document.getElementById('sampleBtn');
    if (sampleBtn) {
        sampleBtn.addEventListener('click', () => {
            const sampleData = {
                biomarkers: [
                    { parameter: "Hemoglobin", result: "14.2", range: "13.5 - 17.5", status: "Normal" },
                    { parameter: "WBC Count", result: "7500", range: "4000 - 11000", status: "Normal" },
                    { parameter: "Glucose", result: "105", range: "70 - 100", status: "High" }
                ],
                docsNote: "The hemoglobin and WBC count are within normal ranges. Fasting glucose is slightly elevated.",
                hindiSummary: "रिपोर्ट सामान्य है, लेकिन शुगर का स्तर थोड़ा बढ़ा हुआ है।",
                actionableSteps: ["Monitor sugar intake", "Increase fiber", "Morning walks"],
                nutritionPlan: ["Leafy greens", "Whole grains", "Low-GI fruits"],
                risk: null
            };

            loadingOverlay.classList.remove('hidden');
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
                showResults(sampleData);
                resultsSection.classList.remove('hidden');
                void resultsSection.offsetWidth;
                resultsSection.classList.add('visible');
                resultsSection.scrollIntoView({ behavior: 'smooth' });
            }, 1000);
        });
    }

    let isProcessing = false;

    async function handleFile(file) {
        if (isProcessing) return;
        if (!file.type.startsWith('image/')) {
            alert('Please upload a valid image file of your report.');
            return;
        }

        isProcessing = true;
        // Show loading
        loadingOverlay.classList.remove('hidden');
        uploadBtn.disabled = true;
        uploadBtn.textContent = 'Processing...';

        const formData = new FormData();
        formData.append('report', file);

        try {
            const response = await fetch('/analyze', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.error || 'Failed to analyze report');
            }

            loadingOverlay.classList.add('hidden');
            showResults(data);
            resultsSection.classList.remove('hidden');
            // Force a reflow to trigger animations
            void resultsSection.offsetWidth;
            resultsSection.classList.add('visible');
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error(error);
            alert(`Error: ${error.message}`);
            loadingOverlay.classList.add('hidden');
        } finally {
            isProcessing = false;
            uploadBtn.disabled = false;
            uploadBtn.textContent = 'Choose File';
        }
    }

    const biomarkerInfo = {
        'HEMOGLOBIN': 'Carries oxygen in blood. Low means fatigue/anemia.',
        'WBC': 'Immunity soldiers. High counts mean infection fight.',
        'TOTAL LEUKOCYTE COUNT': 'Immunity soldiers. High counts mean infection fight.',
        'NEUTROPHILS': 'Bacteria and fungi fighters.',
        'LYMPHOCYTE': 'Viral infection fighters and antibody producers.',
        'MONOCYTES': 'Chronic infection clean-up cells.',
        'EOSINOPHILS': 'Allergy and parasite responders.',
        'BASOPHILS': 'Histamine releasers for allergic reactions.',
        'PLATELET COUNT': 'Essential for blood clotting and stopping bleeding.',
        'TOTAL RBC COUNT': 'Overall red cell count for oxygen transport.',
        'HEMATOCRIT': 'Volume percentage of red cells in blood.',
        'HCT': 'Volume percentage of red cells in blood.',
        'MCV': 'Average size of red blood cells.',
        'MCH': 'Average amount of hemoglobin per red cell.',
        'MCHC': 'Hemoglobin concentration in red cells.',
        'GLUCOSE': 'Primary energy source; indicator of diabetes.'
    };

    function showResults(data) {
        if (!data || !data.biomarkers) {
            console.error('Invalid report data:', data);
            return;
        }

        // Populate Table
        const tbody = document.querySelector('#biomarkerTable tbody');
        tbody.innerHTML = '';
        data.biomarkers.forEach(item => {
            const description = biomarkerInfo[item.parameter.toUpperCase()] || 'Clinical marker for health assessment.';
            const scaleHtml = generateScaleHtml(item.result, item.range, item.status);
            const row = `<tr>
                <td>
                    <div class="tooltip-wrapper">
                        <span class="param-name">${item.parameter}</span>
                        <span class="tooltip-text">${description}</span>
                    </div>
                </td>
                <td><strong>${item.result}</strong></td>
                <td>${item.range}</td>
                <td style="color: ${getStatusColor(item.status)}">${item.status}</td>
                <td>${scaleHtml}</td>
            </tr>`;
            tbody.insertAdjacentHTML('beforeend', row);
        });

        // Populate Summaries
        document.getElementById('englishSummary').textContent = data.docsNote;
        document.getElementById('hindiSummary').textContent = data.hindiSummary;

        // Populate Action Steps
        const stepsUl = document.getElementById('actionSteps');
        stepsUl.innerHTML = '';
        data.actionableSteps.forEach(step => {
            const li = `<li>${step}</li>`;
            stepsUl.insertAdjacentHTML('beforeend', li);
        });

        // Populate Nutrition Plan
        const nutritionUl = document.getElementById('nutritionPlan');
        nutritionUl.innerHTML = '';
        if (data.nutritionPlan) {
            data.nutritionPlan.forEach(food => {
                const li = `<li>${food}</li>`;
                nutritionUl.insertAdjacentHTML('beforeend', li);
            });
        }

        // Risk Alert
        const riskAlert = document.getElementById('riskAlert');
        if (data.risk) {
            riskAlert.classList.remove('hidden');
            document.getElementById('alertMessage').textContent = data.risk;
        } else {
            riskAlert.classList.add('hidden');
        }

        document.getElementById('reportDate').textContent = new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        setupExtraFeatures(data);
    }

    function getStatusColor(status) {
        const s = status.toLowerCase();
        if (s.includes('low') || s.includes('high') || s.includes('⚠️')) return 'var(--danger)';
        if (s.includes('warning') || s.includes('slight')) return 'var(--warning)';
        return 'var(--secondary)';
    }

    function generateScaleHtml(result, range, status) {
        // Simple logic to visual where the result sits
        let percent = 50; // default middle
        let colorClass = 'scale-normal';

        if (status.toLowerCase().includes('low')) {
            percent = 20;
            colorClass = 'scale-low';
        } else if (status.toLowerCase().includes('high')) {
            percent = 80;
            colorClass = 'scale-high';
        }

        return `
            <div class="scale-container">
                <div class="scale-bar ${colorClass}" style="width: ${percent}%"></div>
            </div>
        `;
    }



    function setupExtraFeatures(data) {
        const speakEnglishBtn = document.getElementById('speakEnglish');
        const speakHindiBtn = document.getElementById('speakHindi');

        function toggleSpeech(text, lang, btn) {
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
                if (btn.textContent === '⏹️') {
                    btn.textContent = '🔊';
                    return;
                }
            }

            // Reset both buttons
            speakEnglishBtn.textContent = '🔊';
            speakHindiBtn.textContent = '🔊';

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            utterance.onend = () => btn.textContent = '🔊';

            window.speechSynthesis.speak(utterance);
            btn.textContent = '⏹️';
        }

        speakEnglishBtn.onclick = () => toggleSpeech(data.docsNote, 'en-US', speakEnglishBtn);
        speakHindiBtn.onclick = () => toggleSpeech(data.hindiSummary, 'hi-IN', speakHindiBtn);

        document.getElementById('downloadPdfBtn').onclick = () => {
            const element = document.getElementById('resultsSection');
            const downloadBtn = document.getElementById('downloadPdfBtn');
            const speakBtns = document.querySelectorAll('.speak-btn');
            const tooltips = document.querySelectorAll('.tooltip-text');

            // Hide UI elements and tooltips for PDF
            downloadBtn.style.visibility = 'hidden';
            speakBtns.forEach(btn => btn.style.display = 'none');
            tooltips.forEach(t => t.style.display = 'none');

            const originalPadding = element.style.padding;
            element.style.padding = '10px 0 30px 0';

            const opt = {
                margin: [10, 5, 10, 5],
                filename: 'HemaLens_Health_Report.pdf',
                image: { type: 'jpeg', quality: 1 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    scrollY: 0,
                    windowHeight: element.scrollHeight
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            html2pdf().set(opt).from(element).save().then(() => {
                downloadBtn.style.visibility = 'visible';
                speakBtns.forEach(btn => btn.style.display = 'flex');
                tooltips.forEach(t => t.style.display = ''); // Restore tooltips for live view
                element.style.padding = originalPadding;
            });
        };
    }

    // Scroll to Top & Progress Logic
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const progressBar = document.querySelector('.progress-bar');
    const totalCircumference = 283; // 2 * PI * 45

    function updateProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollTop / docHeight;

        if (progressBar) {
            const offset = totalCircumference - (progress * totalCircumference);
            progressBar.style.strokeDashoffset = offset;
        }

        if (scrollTop > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }

    if (scrollTopBtn) {
        window.addEventListener('scroll', updateProgress);
        scrollTopBtn.onclick = function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
    }
});
