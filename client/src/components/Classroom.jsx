import { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaHome, FaQuestionCircle, FaGamepad, FaLayerGroup, FaDownload } from "react-icons/fa";
import AiTutor from "./AiTutor";
import Quiz from "./Quiz";
import Flashcards from "./Flashcards";

export default function Classroom({ data, onBack, onDownload }) {
    const [idx, setIdx] = useState(0);
    const [tab, setTab] = useState("slide"); // slide | tutor | quiz | flashcards

    const slide = data.slides[idx];
    const total = data.slides.length;
    const pct = ((idx + 1) / total) * 100;

    const allContent = data.slides.map((s) => `${s.title}: ${s.content}`).join("\n\n");

    function formatContent(text) {
        if (!text) return "";
        return text
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\n\n/g, '</p><p style="margin-top:0.75rem;">')
            .replace(/\n/g, "<br>");
    }

    return (
        <div className="classroom">
            {/* Toolbar */}
            <div className="toolbar">
                <button className="btn-icon" onClick={onBack} title="Back to menu"><FaHome /></button>
                <div className="toolbar-tabs">
                    <button className={`tab ${tab === "slide" ? "active" : ""}`} onClick={() => setTab("slide")}>📖 Slides</button>
                    <button className={`tab ${tab === "tutor" ? "active" : ""}`} onClick={() => setTab("tutor")}>🤖 AI Tutor</button>
                    <button className={`tab ${tab === "quiz" ? "active" : ""}`} onClick={() => setTab("quiz")}>🎮 Quiz</button>
                    <button className={`tab ${tab === "flashcards" ? "active" : ""}`} onClick={() => setTab("flashcards")}>🃏 Flashcards</button>
                </div>
                <button className="btn-icon" onClick={onDownload} title="Download PDF"><FaDownload /></button>
            </div>

            {/* Progress */}
            <div className="progress-wrapper">
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="progress-label">Slide {idx + 1} of {total}</span>
            </div>

            {/* Content Area */}
            <div className="classroom-body">
                {tab === "slide" && (
                    <div className="slide-panel" key={idx}>
                        <h2 className="slide-title">{slide.title}</h2>
                        <div className="slide-content" dangerouslySetInnerHTML={{ __html: formatContent(slide.content) }} />
                        {slide.explanation && slide.explanation.length > 0 && (
                            <div className="key-points">
                                <h4>✨ Key Points</h4>
                                <ul>
                                    {slide.explanation.map((p, i) => <li key={i}>{p}</li>)}
                                </ul>
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="slide-nav">
                            <button className="btn btn-secondary" onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0}>
                                <FaArrowLeft /> Previous
                            </button>
                            <span className="slide-counter">{idx + 1} / {total}</span>
                            <button className="btn btn-primary" onClick={() => setIdx((i) => Math.min(total - 1, i + 1))} disabled={idx === total - 1}>
                                Next <FaArrowRight />
                            </button>
                        </div>
                    </div>
                )}

                {tab === "tutor" && <AiTutor context={slide.content} />}
                {tab === "quiz" && <Quiz content={allContent} />}
                {tab === "flashcards" && <Flashcards content={allContent} />}
            </div>
        </div>
    );
}
