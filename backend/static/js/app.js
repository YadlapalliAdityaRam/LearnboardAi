// ============================================
// LearnBoard AI - Complete Application Logic
// ============================================

const API_URL = "http://localhost:5000";

// State
let currentData = null;
let currentSlideIndex = 0;
let pdfDoc = null;
let pageNum = 1;
let pdfFullscreen = false;
let boardFullscreen = false;
let bothFullscreen = false;
let quizData = null;
let quizAnswered = false;
let flashcardsData = null;
let currentFlashcardIndex = 0;

// Topic suggestions
const topicSuggestions = {
    "Science": ["Photosynthesis", "Quantum Mechanics", "DNA and Genetics", "Climate Change", "Theory of Relativity", "Black Holes", "Evolution", "Periodic Table", "Human Anatomy", "Cell Biology"],
    "Mathematics": ["Calculus", "Linear Algebra", "Statistics", "Trigonometry", "Probability Theory", "Number Theory", "Geometry", "Differential Equations"],
    "History": ["World War II", "Renaissance", "Ancient Rome", "Industrial Revolution", "French Revolution", "Ancient Egypt", "Cold War", "American Civil War"],
    "Technology": ["Artificial Intelligence", "Machine Learning", "Blockchain", "Quantum Computing", "Cloud Computing", "Cybersecurity", "Internet of Things", "5G Networks"],
    "Arts & Literature": ["Shakespeare", "Renaissance Art", "Classical Music", "Impressionism", "Modern Poetry", "Greek Mythology", "Film History"],
    "Business": ["Marketing Strategies", "Financial Management", "Entrepreneurship", "Project Management", "Supply Chain", "Digital Marketing"]
};

// ============ Init ============
window.addEventListener('load', () => {
    checkBackendConnection();
    loadDarkMode();
    loadLessonHistory();
});

async function checkBackendConnection() {
    try {
        const response = await fetch(`${API_URL}/api/health`);
        if (response.ok) {
            console.log('✅ Backend connected');
        }
    } catch (error) {
        console.error('❌ Backend not reachable');
        showToast('Cannot connect to backend. Start server with: python app.py', 'error');
    }
}

// ============ Toast Notifications ============
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = { success: 'check-circle', error: 'exclamation-circle', info: 'info-circle', warning: 'exclamation-triangle' };
    toast.innerHTML = `<i class="fas fa-${icons[type] || 'info-circle'}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ============ Dark Mode ============
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    document.getElementById('darkModeIcon').className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('learnboard-dark-mode', isDark);
}

function loadDarkMode() {
    const isDark = localStorage.getItem('learnboard-dark-mode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeIcon').className = 'fas fa-sun';
    }
}

// ============ File Upload Handler ============
function handleFileSelect(input) {
    const label = document.getElementById('fileUploadLabel');
    const text = document.getElementById('fileUploadText');
    if (input.files && input.files[0]) {
        label.classList.add('has-file');
        text.textContent = input.files[0].name;
    } else {
        label.classList.remove('has-file');
        text.textContent = 'Click to upload PDF';
    }
}

// ============ Suggestions ============
function showSuggestions(value) {
    const suggestionsDiv = document.getElementById('suggestions');
    const input = value.toLowerCase().trim();
    if (!input) { displayAllSuggestions(suggestionsDiv); return; }
    let html = '';
    let foundAny = false;
    for (let category in topicSuggestions) {
        const matches = topicSuggestions[category].filter(t => t.toLowerCase().includes(input));
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
        topicSuggestions[category].slice(0, 4).forEach(topic => {
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
    if (topicInput && suggestionsDiv && e.target !== topicInput && !suggestionsDiv.contains(e.target)) {
        suggestionsDiv.classList.remove('show');
    }
});

// ============ PDF Sync ============
function syncPdfWithSlide(slideIndex) {
    if (!pdfDoc || !currentData) return;
    const totalSlides = currentData.slides.length;
    const totalPdfPages = pdfDoc.numPages;
    const pdfPageForSlide = Math.floor((slideIndex / totalSlides) * totalPdfPages) + 1;
    if (pdfPageForSlide !== pageNum) renderPdfPage(pdfPageForSlide);
}

// ============ Create Lesson ============
async function createDoc() {
    const topic = document.getElementById('topic').value.trim();
    const pages = document.getElementById('pages').value;
    if (!topic) { showToast('Please enter a topic', 'warning'); return; }
    showLoading("✨ Crafting your lesson...");
    try {
        const res = await fetch(`${API_URL}/api/lessons/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic, pages: parseInt(pages) })
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Server error");
        }
        currentData = await res.json();
        if (!currentData.slides || currentData.slides.length === 0) throw new Error("No slides generated");
        saveLessonToHistory(topic);
        showToast(`Lesson on "${topic}" generated!`, 'success');
        startLesson();
    } catch (e) {
        console.error('❌ Error:', e);
        showToast(`Error: ${e.message}`, 'error');
    } finally {
        hideLoading();
    }
}

// ============ Upload PDF ============
async function uploadPDF() {
    const fileInput = document.getElementById('pdfFile');
    if (!fileInput.files[0]) { showToast('Please select a PDF file', 'warning'); return; }
    showLoading("📚 Analyzing your PDF...");
    const file = fileInput.files[0];
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
    const formData = new FormData();
    formData.append("file", file);
    try {
        const res = await fetch(`${API_URL}/api/lessons/analyze-pdf`, { method: "POST", body: formData });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Server error");
        }
        currentData = await res.json();
        if (!currentData.slides || currentData.slides.length === 0) throw new Error("No slides from PDF");
        saveLessonToHistory(`PDF: ${file.name}`);
        showToast('PDF analyzed successfully!', 'success');
        startLesson();
    } catch (e) {
        console.error('❌ Error:', e);
        showToast(`Error: ${e.message}`, 'error');
    } finally {
        hideLoading();
    }
}

// ============ Ask Doubt ============
async function askDoubt() {
    const question = document.getElementById('doubtQuestion').value.trim();
    if (!question) { showToast('Please enter a question', 'warning'); return; }
    const context = currentData.slides[currentSlideIndex].content;
    const answerDiv = document.getElementById('tutorAnswer');
    answerDiv.style.display = 'block';
    answerDiv.innerHTML = "<em>🤔 Thinking...</em>";
    try {
        const res = await fetch(`${API_URL}/api/tutor/ask`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question, context })
        });
        if (!res.ok) throw new Error("Failed to get answer");
        const data = await res.json();
        answerDiv.innerHTML = `<strong style="color:var(--success);">🤖 AI Tutor:</strong><br><br>${formatContent(data.answer)}`;
    } catch (e) {
        answerDiv.innerHTML = "❌ Error connecting to AI Tutor. Please try again.";
        showToast('Error getting answer', 'error');
    }
}

// ============ Lesson Navigation ============
function startLesson() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('classroom').style.display = 'block';
    document.getElementById('bothFullscreenBtn').classList.add('active');
    document.getElementById('quizBtn').style.display = 'block';
    document.getElementById('flashcardBtn').style.display = 'block';
    currentSlideIndex = 0;
    quizData = null;
    flashcardsData = null;
    document.getElementById('quizSection').style.display = 'none';
    document.getElementById('flashcardSection').style.display = 'none';
    renderSlide();
    if (pdfDoc) syncPdfWithSlide(0);
}

function showMenu() {
    document.getElementById('menu').style.display = 'flex';
    document.getElementById('classroom').style.display = 'none';
    document.getElementById('pdfSide').style.display = 'none';
    document.getElementById('bothFullscreenBtn').classList.remove('active');
    document.getElementById('quizBtn').style.display = 'none';
    document.getElementById('flashcardBtn').style.display = 'none';
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
    if (pdfDoc) syncPdfWithSlide(currentSlideIndex);
    // Re-trigger slide animation
    const slideContent = document.getElementById('slideContent');
    slideContent.style.animation = 'none';
    slideContent.offsetHeight; // trigger reflow
    slideContent.style.animation = 'slideIn 0.4s ease-out';
}

function nextSlide() {
    if (currentData && currentSlideIndex < currentData.slides.length - 1) {
        currentSlideIndex++;
        renderSlide();
    } else if (currentData && currentSlideIndex === currentData.slides.length - 1) {
        showToast('🎉 You reached the last slide!', 'info');
    }
}

function prevSlide() {
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
        renderSlide();
    }
}

function formatContent(text) {
    if (!text) return '';
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\n/g, '</p><p style="margin-top:1rem;">')
        .replace(/\n/g, '<br>');
}

// ============ PDF Viewer ============
function renderPdfPage(num) {
    if (!pdfDoc) return;
    const pdfSide = document.getElementById('pdfSide');
    if (pdfSide.style.display === 'none') pdfSide.style.display = 'flex';
    pageNum = num;
    pdfDoc.getPage(num).then(function (page) {
        const canvas = document.getElementById('pdfCanvas');
        const ctx = canvas.getContext('2d');
        const pdfViewer = document.querySelector('.pdf-viewer');
        const containerWidth = pdfViewer.clientWidth - 40;
        const viewport = page.getViewport({ scale: 1.0 });
        const scale = containerWidth / viewport.width;
        const scaledViewport = page.getViewport({ scale });
        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;
        page.render({ canvasContext: ctx, viewport: scaledViewport });
        document.getElementById('pdfPageNum').innerText = `${num} / ${pdfDoc.numPages}`;
    }).catch(err => console.error('PDF render error:', err));
}

function nextPdfPage() { if (pdfDoc && pageNum < pdfDoc.numPages) renderPdfPage(pageNum + 1); }
function prevPdfPage() { if (pdfDoc && pageNum > 1) renderPdfPage(pageNum - 1); }

// ============ Fullscreen ============
function toggleFullscreen(type) {
    if (type === 'pdf') {
        pdfFullscreen = !pdfFullscreen;
        document.getElementById('pdfSide').classList.toggle('fullscreen', pdfFullscreen);
        setTimeout(() => renderPdfPage(pageNum), 100);
    } else if (type === 'board') {
        boardFullscreen = !boardFullscreen;
        document.getElementById('boardSide').classList.toggle('fullscreen', boardFullscreen);
    }
}

function toggleBothFullscreen() {
    const container = document.getElementById('classroomContainer');
    const btn = document.getElementById('bothFullscreenBtn');
    bothFullscreen = !bothFullscreen;
    container.classList.toggle('both-fullscreen', bothFullscreen);
    btn.innerHTML = bothFullscreen
        ? '<i class="fas fa-compress"></i> Exit Fullscreen'
        : '<i class="fas fa-expand"></i> Fullscreen Both';
    setTimeout(() => { if (pdfDoc) renderPdfPage(pageNum); }, 100);
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
    setTimeout(() => { if (pdfDoc) renderPdfPage(pageNum); }, 100);
}

// ============ Loading ============
function showLoading(msg) {
    document.getElementById('loadingText').innerText = msg;
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

// ============ Quiz ============
async function generateQuiz() {
    if (!currentData) { showToast('Start a lesson first!', 'warning'); return; }
    const section = document.getElementById('quizSection');
    const content = document.getElementById('quizContent');
    const scoreDiv = document.getElementById('quizScore');
    section.style.display = 'block';
    scoreDiv.style.display = 'none';
    content.innerHTML = '<em>🤔 Generating quiz...</em>';
    quizAnswered = false;
    // Gather all slide content
    const allContent = currentData.slides.map(s => `${s.title}: ${s.content}`).join('\n\n');
    try {
        const res = await fetch(`${API_URL}/api/quiz/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: allContent })
        });
        if (!res.ok) throw new Error("Failed to generate quiz");
        quizData = await res.json();
        renderQuiz();
        showToast('Quiz ready! Test your knowledge.', 'success');
    } catch (e) {
        content.innerHTML = '❌ Error generating quiz. Please try again.';
        showToast('Error generating quiz', 'error');
    }
}

function renderQuiz() {
    if (!quizData || !quizData.questions) return;
    const content = document.getElementById('quizContent');
    let html = '';
    quizData.questions.forEach((q, i) => {
        html += `<div class="quiz-question" id="quizQ${i}">
            <p>${i + 1}. ${q.question}</p>
            <div class="quiz-options">`;
        q.options.forEach((opt, j) => {
            html += `<div class="quiz-option" data-question="${i}" data-option="${j}" onclick="selectQuizOption(${i}, ${j})">${opt}</div>`;
        });
        html += `</div></div>`;
    });
    html += `<button class="btn btn-primary btn-full" onclick="submitQuiz()" style="margin-top:1rem;"><i class="fas fa-check"></i> Submit Answers</button>`;
    content.innerHTML = html;
}

function selectQuizOption(qIndex, optIndex) {
    if (quizAnswered) return;
    const options = document.querySelectorAll(`.quiz-option[data-question="${qIndex}"]`);
    options.forEach(opt => opt.classList.remove('selected'));
    options[optIndex].classList.add('selected');
}

function submitQuiz() {
    if (quizAnswered || !quizData) return;
    quizAnswered = true;
    let correct = 0;
    const total = quizData.questions.length;
    quizData.questions.forEach((q, i) => {
        const options = document.querySelectorAll(`.quiz-option[data-question="${i}"]`);
        const correctIdx = q.correct;
        options.forEach((opt, j) => {
            if (j === correctIdx) opt.classList.add('correct');
            if (opt.classList.contains('selected') && j !== correctIdx) opt.classList.add('incorrect');
            if (opt.classList.contains('selected') && j === correctIdx) correct++;
            opt.style.cursor = 'default';
        });
    });
    const scoreDiv = document.getElementById('quizScore');
    const pct = Math.round((correct / total) * 100);
    let emoji = pct >= 80 ? '🏆' : pct >= 60 ? '👏' : pct >= 40 ? '📚' : '💪';
    scoreDiv.innerHTML = `${emoji} You scored ${correct}/${total} (${pct}%)`;
    scoreDiv.style.display = 'block';
    // Scroll to score
    scoreDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ============ Flashcards ============
async function generateFlashcards() {
    if (!currentData) { showToast('Start a lesson first!', 'warning'); return; }
    const section = document.getElementById('flashcardSection');
    const container = document.getElementById('flashcardContainer');
    const nav = document.getElementById('flashcardNav');
    section.style.display = 'block';
    nav.style.display = 'none';
    container.innerHTML = '<em>🃏 Generating flashcards...</em>';
    currentFlashcardIndex = 0;
    const allContent = currentData.slides.map(s => `${s.title}: ${s.content}`).join('\n\n');
    try {
        const res = await fetch(`${API_URL}/api/flashcards/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: allContent })
        });
        if (!res.ok) throw new Error("Failed to generate flashcards");
        flashcardsData = await res.json();
        renderFlashcard();
        nav.style.display = 'flex';
        showToast('Flashcards ready! Click to flip.', 'success');
    } catch (e) {
        container.innerHTML = '❌ Error generating flashcards.';
        showToast('Error generating flashcards', 'error');
    }
}

function renderFlashcard() {
    if (!flashcardsData || !flashcardsData.cards) return;
    const container = document.getElementById('flashcardContainer');
    const card = flashcardsData.cards[currentFlashcardIndex];
    container.innerHTML = `
        <div class="flashcard" onclick="this.classList.toggle('flipped')">
            <div class="flashcard-front">
                <div class="fc-label">Question</div>
                <div class="fc-question">${card.front}</div>
            </div>
            <div class="flashcard-back">
                <div class="fc-label">Answer</div>
                <div class="fc-answer">${card.back}</div>
            </div>
        </div>
    `;
    document.getElementById('flashcardCounter').textContent = `${currentFlashcardIndex + 1} / ${flashcardsData.cards.length}`;
}

function nextFlashcard() {
    if (flashcardsData && currentFlashcardIndex < flashcardsData.cards.length - 1) {
        currentFlashcardIndex++;
        renderFlashcard();
    }
}

function prevFlashcard() {
    if (currentFlashcardIndex > 0) {
        currentFlashcardIndex--;
        renderFlashcard();
    }
}

// ============ Lesson History ============
function saveLessonToHistory(title) {
    let history = JSON.parse(localStorage.getItem('learnboard-history') || '[]');
    history.unshift({ title, date: new Date().toLocaleDateString() });
    if (history.length > 10) history = history.slice(0, 10);
    localStorage.setItem('learnboard-history', JSON.stringify(history));
    loadLessonHistory();
}

function loadLessonHistory() {
    const list = document.getElementById('lessonHistory');
    if (!list) return;
    const history = JSON.parse(localStorage.getItem('learnboard-history') || '[]');
    if (history.length === 0) {
        list.innerHTML = '<li class="history-empty">No recent lessons</li>';
        return;
    }
    list.innerHTML = history.map(h =>
        `<li title="${h.date}"><i class="fas fa-book-open"></i> ${h.title}</li>`
    ).join('');
}

// ============ Download PDF ============
function downloadPDF() {
    if (!currentData) { showToast('No lesson to save!', 'warning'); return; }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 20;
    // Title page
    doc.setFontSize(28);
    doc.setTextColor(99, 102, 241);
    doc.text('LearnBoard AI Notes', 105, y, { align: 'center' });
    y += 15;
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, y, { align: 'center' });
    y += 20;
    doc.setDrawColor(99, 102, 241);
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);
    y += 15;

    currentData.slides.forEach((slide, i) => {
        if (y > 250) { doc.addPage(); y = 20; }
        doc.setFontSize(16);
        doc.setTextColor(99, 102, 241);
        const titleLines = doc.splitTextToSize(`${i + 1}. ${slide.title}`, 170);
        doc.text(titleLines, 20, y);
        y += (titleLines.length * 7) + 5;

        doc.setFontSize(10);
        doc.setTextColor(30, 41, 59);
        const contentLines = doc.splitTextToSize(slide.content, 170);
        contentLines.forEach(line => {
            if (y > 275) { doc.addPage(); y = 20; }
            doc.text(line, 20, y);
            y += 5;
        });
        y += 8;

        if (slide.explanation && Array.isArray(slide.explanation)) {
            doc.setFontSize(10);
            doc.setTextColor(139, 92, 246);
            doc.text("Key Points:", 20, y);
            y += 7;
            doc.setTextColor(30, 41, 59);
            slide.explanation.forEach(exp => {
                if (y > 275) { doc.addPage(); y = 20; }
                const expLines = doc.splitTextToSize(`• ${exp}`, 165);
                doc.text(expLines, 25, y);
                y += (expLines.length * 5) + 3;
            });
        }
        y += 12;
    });
    doc.save(`LearnBoard_Notes_${Date.now()}.pdf`);
    showToast('Notes saved as PDF!', 'success');
}

// ============ Keyboard Shortcuts ============
document.addEventListener('keydown', function (e) {
    if (document.getElementById('classroom').style.display === 'block') {
        if (e.key === 'ArrowRight' && !e.target.matches('input, textarea')) nextSlide();
        else if (e.key === 'ArrowLeft' && !e.target.matches('input, textarea')) prevSlide();
        else if (e.key === 'Escape') {
            if (bothFullscreen) exitBothFullscreen();
            else if (pdfFullscreen) exitFullscreen('pdf');
            else if (boardFullscreen) exitFullscreen('board');
        } else if (e.key === 'f' && !e.target.matches('input, textarea')) toggleBothFullscreen();
    }
});
