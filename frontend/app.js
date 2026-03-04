// API Configuration
const API_URL = "http://localhost:5000";

let currentData = null;
let currentSlideIndex = 0;
let pdfDoc = null;
let pageNum = 1;
let pdfFullscreen = false;
let boardFullscreen = false;
let bothFullscreen = false;

// Topic suggestions
const topicSuggestions = {
    "Science": ["Photosynthesis", "Quantum Mechanics", "DNA and Genetics", "Climate Change", "Theory of Relativity", "Black Holes", "Evolution", "Periodic Table", "Human Anatomy", "Cell Biology"],
    "Mathematics": ["Calculus", "Linear Algebra", "Statistics", "Trigonometry", "Probability Theory", "Number Theory", "Geometry", "Differential Equations"],
    "History": ["World War II", "Renaissance", "Ancient Rome", "Industrial Revolution", "French Revolution", "Ancient Egypt", "Cold War", "American Civil War"],
    "Technology": ["Artificial Intelligence", "Machine Learning", "Blockchain", "Quantum Computing", "Cloud Computing", "Cybersecurity", "Internet of Things", "5G Networks"],
    "Arts & Literature": ["Shakespeare", "Renaissance Art", "Classical Music", "Impressionism", "Modern Poetry", "Greek Mythology", "Film History"],
    "Business": ["Marketing Strategies", "Financial Management", "Entrepreneurship", "Project Management", "Supply Chain", "Digital Marketing"]
};

// Check backend connection on load
window.addEventListener('load', checkBackendConnection);

async function checkBackendConnection() {
    try {
        const response = await fetch(`${API_URL}/api/health`);
        if (response.ok) {
            console.log('✅ Backend connection successful');
        }
    } catch (error) {
        console.error('❌ Cannot connect to backend. Make sure it\'s running on port 8000');
        showError('Cannot connect to backend. Please start the server with: python app.py');
    }
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<strong>⚠️ Error:</strong> ${message}`;
    document.querySelector('.page-heading').after(errorDiv);
    setTimeout(() => errorDiv.remove(), 10000);
}

function showSuggestions(value) {
    const suggestionsDiv = document.getElementById('suggestions');
    const input = value.toLowerCase().trim();

    if (!input) {
        displayAllSuggestions(suggestionsDiv);
        return;
    }

    let html = '';
    let foundAny = false;

    for (let category in topicSuggestions) {
        const matches = topicSuggestions[category].filter(topic =>
            topic.toLowerCase().includes(input)
        );

        if (matches.length > 0) {
            foundAny = true;
            html += `<div class="suggestion-category">${category}</div>`;
            matches.forEach(topic => {
                html += `<div class="suggestion-item" onclick="selectTopic('${topic}')"><i class="fas fa-lightbulb"></i><span>${topic}</span></div>`;
            });
        }
    }

    if (!foundAny) {
        html = `<div class="suggestion-item" onclick="selectTopic('${value}')"><i class="fas fa-search"></i><span>Search for "${value}"</span></div>`;
    }

    suggestionsDiv.innerHTML = html;
    suggestionsDiv.classList.add('show');
}

function displayAllSuggestions(suggestionsDiv) {
    let html = '';
    for (let category in topicSuggestions) {
        html += `<div class="suggestion-category">${category}</div>`;
        topicSuggestions[category].slice(0, 5).forEach(topic => {
            html += `<div class="suggestion-item" onclick="selectTopic('${topic}')"><i class="fas fa-book"></i><span>${topic}</span></div>`;
        });
    }
    suggestionsDiv.innerHTML = html;
    suggestionsDiv.classList.add('show');
}

function selectTopic(topic) {
    document.getElementById('topic').value = topic;
    document.getElementById('suggestions').classList.remove('show');
}

document.addEventListener('click', function (e) {
    const suggestionsDiv = document.getElementById('suggestions');
    const topicInput = document.getElementById('topic');
    if (e.target !== topicInput && !suggestionsDiv.contains(e.target)) {
        suggestionsDiv.classList.remove('show');
    }
});

function syncPdfWithSlide(slideIndex) {
    if (!pdfDoc || !currentData) return;
    const totalSlides = currentData.slides.length;
    const totalPdfPages = pdfDoc.numPages;
    const pdfPageForSlide = Math.floor((slideIndex / totalSlides) * totalPdfPages) + 1;
    if (pdfPageForSlide !== pageNum) {
        renderPdfPage(pdfPageForSlide);
    }
}

async function createDoc() {
    const topic = document.getElementById('topic').value.trim();
    const pages = document.getElementById('pages').value;

    if (!topic) {
        alert("Please enter a topic");
        return;
    }

    showLoading("✨ Crafting your detailed lesson...");

    try {
        const res = await fetch(`${API_URL}/api/lessons/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic: topic, pages: parseInt(pages) })
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Server error");
        }

        currentData = await res.json();
        console.log('✅ Received lesson data:', currentData);

        if (!currentData.slides || currentData.slides.length === 0) {
            throw new Error("No slides generated");
        }

        startLesson();
    } catch (e) {
        console.error('❌ Error creating lesson:', e);
        alert(`Error creating lesson: ${e.message}\n\nMake sure:\n1. Backend is running (python app.py)\n2. OpenAI API key is configured`);
    } finally {
        hideLoading();
    }
}

async function uploadPDF() {
    const fileInput = document.getElementById('pdfFile');

    if (!fileInput.files[0]) {
        alert("Please select a PDF file");
        return;
    }

    showLoading("📚 Reading and analyzing PDF...");

    const file = fileInput.files[0];

    // Load PDF for viewer
    const fileReader = new FileReader();
    fileReader.onload = function () {
        const typedarray = new Uint8Array(this.result);
        pdfjsLib.getDocument(typedarray).promise.then(function (pdf) {
            pdfDoc = pdf;
            document.getElementById('pdfSide').style.display = 'flex';
            renderPdfPage(1);
        });
    };
    fileReader.readAsArrayBuffer(file);

    // Send to backend for analysis
    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await fetch(`${API_URL}/api/lessons/analyze-pdf`, {
            method: "POST",
            body: formData
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Server error");
        }

        currentData = await res.json();
        console.log('✅ Received PDF analysis:', currentData);

        if (!currentData.slides || currentData.slides.length === 0) {
            throw new Error("No slides generated from PDF");
        }

        startLesson();
    } catch (e) {
        console.error('❌ Error analyzing PDF:', e);
        alert(`Error analyzing PDF: ${e.message}\n\nMake sure:\n1. Backend is running\n2. PDF contains readable text\n3. OpenAI API key is configured`);
    } finally {
        hideLoading();
    }
}

async function askDoubt() {
    const question = document.getElementById('doubtQuestion').value.trim();

    if (!question) {
        alert("Please enter a question");
        return;
    }

    const context = currentData.slides[currentSlideIndex].content;
    const answerDiv = document.getElementById('tutorAnswer');

    answerDiv.style.display = 'block';
    answerDiv.innerHTML = "<em>🤔 Thinking...</em>";

    try {
        const res = await fetch(`${API_URL}/api/tutor/ask`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                question: question,
                context: context
            })
        });

        if (!res.ok) {
            throw new Error("Failed to get answer");
        }

        const data = await res.json();
        answerDiv.innerHTML = `<strong style="color: var(--success);">🤖 AI Tutor:</strong><br><br>${data.answer}`;
    } catch (e) {
        console.error('❌ Error asking doubt:', e);
        answerDiv.innerHTML = "❌ Error connecting to AI Tutor. Please try again.";
    }
}

function startLesson() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('classroom').style.display = 'block';
    document.getElementById('bothFullscreenBtn').classList.add('active');
    currentSlideIndex = 0;
    renderSlide();
    if (pdfDoc) {
        syncPdfWithSlide(0);
    }
}

function showMenu() {
    document.getElementById('menu').style.display = 'flex';
    document.getElementById('classroom').style.display = 'none';
    document.getElementById('pdfSide').style.display = 'none';
    document.getElementById('bothFullscreenBtn').classList.remove('active');
    pdfDoc = null;
    exitFullscreen('pdf');
    exitFullscreen('board');
    exitBothFullscreen();
}

function renderSlide() {
    if (!currentData || !currentData.slides) return;

    const slide = currentData.slides[currentSlideIndex];
    const total = currentData.slides.length;

    document.getElementById('slideTitle').innerText = slide.title;
    document.getElementById('slideContent').innerHTML = formatContent(slide.content);
    document.getElementById('slideCounter').innerText = `${currentSlideIndex + 1} / ${total}`;

    const expList = document.getElementById('slideExplanation');
    expList.innerHTML = "";

    if (slide.explanation && Array.isArray(slide.explanation)) {
        slide.explanation.forEach(point => {
            const li = document.createElement("li");
            li.innerText = point;
            expList.appendChild(li);
        });
    }

    const pct = ((currentSlideIndex + 1) / total) * 100;
    document.getElementById('progressBar').style.width = `${pct}%`;
    document.getElementById('progressText').innerText = `Slide ${currentSlideIndex + 1} of ${total}`;

    document.getElementById('tutorAnswer').style.display = 'none';
    document.getElementById('tutorAnswer').innerHTML = "";
    document.getElementById('doubtQuestion').value = "";

    if (pdfDoc) {
        syncPdfWithSlide(currentSlideIndex);
    }
}

function nextSlide() {
    if (currentData && currentSlideIndex < currentData.slides.length - 1) {
        currentSlideIndex++;
        renderSlide();
    }
}

function prevSlide() {
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
        renderSlide();
    }
}

function formatContent(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\n/g, '</p><p style="margin-top: 1.5rem;">')
        .replace(/\n/g, '<br>');
}

function renderPdfPage(num) {
    if (!pdfDoc) return;

    const pdfSide = document.getElementById('pdfSide');
    if (pdfSide.style.display === 'none') {
        pdfSide.style.display = 'flex';
    }

    pageNum = num;

    pdfDoc.getPage(num).then(function (page) {
        const canvas = document.getElementById('pdfCanvas');
        const ctx = canvas.getContext('2d');
        const pdfViewer = document.querySelector('.pdf-viewer');
        const containerWidth = pdfViewer.clientWidth - 40;
        const viewport = page.getViewport({ scale: 1.0 });
        const scale = containerWidth / viewport.width;
        const scaledViewport = page.getViewport({ scale: scale });

        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;

        const renderContext = {
            canvasContext: ctx,
            viewport: scaledViewport
        };

        page.render(renderContext).promise.then(function () {
            console.log('PDF page rendered successfully');
        });

        document.getElementById('pdfPageNum').innerText = `${num} / ${pdfDoc.numPages}`;
    }).catch(function (error) {
        console.error('Error rendering PDF page:', error);
    });
}

function nextPdfPage() {
    if (pdfDoc && pageNum < pdfDoc.numPages) {
        renderPdfPage(pageNum + 1);
    }
}

function prevPdfPage() {
    if (pdfDoc && pageNum > 1) {
        renderPdfPage(pageNum - 1);
    }
}

function toggleFullscreen(type) {
    if (type === 'pdf') {
        const pdfSide = document.getElementById('pdfSide');
        pdfFullscreen = !pdfFullscreen;
        if (pdfFullscreen) {
            pdfSide.classList.add('fullscreen');
        } else {
            pdfSide.classList.remove('fullscreen');
        }
        setTimeout(() => renderPdfPage(pageNum), 100);
    } else if (type === 'board') {
        const boardSide = document.getElementById('boardSide');
        boardFullscreen = !boardFullscreen;
        if (boardFullscreen) {
            boardSide.classList.add('fullscreen');
        } else {
            boardSide.classList.remove('fullscreen');
        }
    }
}

function toggleBothFullscreen() {
    const container = document.getElementById('classroomContainer');
    const btn = document.getElementById('bothFullscreenBtn');
    bothFullscreen = !bothFullscreen;

    if (bothFullscreen) {
        container.classList.add('both-fullscreen');
        btn.innerHTML = '<i class="fas fa-compress"></i> Exit Fullscreen';
    } else {
        container.classList.remove('both-fullscreen');
        btn.innerHTML = '<i class="fas fa-expand"></i> Fullscreen Both';
    }

    setTimeout(() => {
        if (pdfDoc) renderPdfPage(pageNum);
    }, 100);
}

function exitFullscreen(type) {
    if (type === 'pdf') {
        pdfFullscreen = false;
        document.getElementById('pdfSide').classList.remove('fullscreen');
        setTimeout(() => renderPdfPage(pageNum), 100);
    } else if (type === 'board') {
        boardFullscreen = false;
        document.getElementById('boardSide').classList.remove('fullscreen');
    }
}

function exitBothFullscreen() {
    bothFullscreen = false;
    document.getElementById('classroomContainer').classList.remove('both-fullscreen');
    document.getElementById('bothFullscreenBtn').innerHTML = '<i class="fas fa-expand"></i> Fullscreen Both';
    setTimeout(() => {
        if (pdfDoc) renderPdfPage(pageNum);
    }, 100);
}

function showLoading(msg) {
    document.getElementById('loadingText').innerText = msg;
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function downloadPDF() {
    if (!currentData) {
        alert("No lesson to save!");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 10;

    currentData.slides.forEach((slide, i) => {
        if (y > 250) {
            doc.addPage();
            y = 10;
        }

        doc.setFontSize(18);
        doc.setTextColor(99, 102, 241);
        doc.text(`Slide ${i + 1}: ${slide.title}`, 10, y);
        y += 12;

        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        const contentLines = doc.splitTextToSize(slide.content, 180);
        doc.text(contentLines, 10, y);
        y += (contentLines.length * 5) + 12;

        doc.setFontSize(10);
        doc.setTextColor(139, 92, 246);
        doc.text("Key Points:", 10, y);
        y += 8;

        doc.setTextColor(0, 0, 0);
        if (slide.explanation && Array.isArray(slide.explanation)) {
            slide.explanation.forEach((exp, j) => {
                if (y > 270) {
                    doc.addPage();
                    y = 10;
                }
                const expLines = doc.splitTextToSize(`✨ ${exp}`, 175);
                doc.text(expLines, 15, y);
                y += (expLines.length * 5) + 5;
            });
        }

        y += 15;
    });

    doc.save(`LearnBoard_Notes_${Date.now()}.pdf`);
}

// Keyboard shortcuts
document.addEventListener('keydown', function (e) {
    if (document.getElementById('classroom').style.display === 'block') {
        if (e.key === 'ArrowRight' && !e.target.matches('input, textarea')) {
            nextSlide();
        } else if (e.key === 'ArrowLeft' && !e.target.matches('input, textarea')) {
            prevSlide();
        } else if (e.key === 'Escape') {
            if (bothFullscreen) exitBothFullscreen();
            else if (pdfFullscreen) exitFullscreen('pdf');
            else if (boardFullscreen) exitFullscreen('board');
        } else if (e.key === 'f' && !e.target.matches('input, textarea')) {
            toggleBothFullscreen();
        }
    }
});