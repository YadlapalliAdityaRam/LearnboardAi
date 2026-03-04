const API = import.meta.env.VITE_API_URL || "/api";

export async function generateLesson(topic, pages) {
    const res = await fetch(`${API}/lessons/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, pages }),
    });
    if (!res.ok) throw new Error((await res.json()).error || "Server error");
    return res.json();
}

export async function analyzePDF(file) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API}/lessons/analyze-pdf`, { method: "POST", body: formData });
    if (!res.ok) throw new Error((await res.json()).error || "Server error");
    return res.json();
}

export async function askTutor(question, context) {
    const res = await fetch(`${API}/tutor/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, context }),
    });
    if (!res.ok) throw new Error((await res.json()).error || "Server error");
    return res.json();
}

export async function generateQuiz(content) {
    const res = await fetch(`${API}/quiz/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error((await res.json()).error || "Server error");
    return res.json();
}

export async function generateFlashcards(content) {
    const res = await fetch(`${API}/flashcards/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error((await res.json()).error || "Server error");
    return res.json();
}

export async function healthCheck() {
    const res = await fetch(`${API}/health`);
    return res.json();
}
