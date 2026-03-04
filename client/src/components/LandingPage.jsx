import { useState, useRef } from "react";
import { FaRocket, FaUpload, FaBrain, FaGamepad, FaLayerGroup, FaFilePdf } from "react-icons/fa";

const SUGGESTIONS = {
    Science: ["Photosynthesis", "Quantum Mechanics", "DNA and Genetics", "Climate Change", "Black Holes"],
    Mathematics: ["Calculus", "Linear Algebra", "Trigonometry", "Probability Theory"],
    History: ["World War II", "Renaissance", "Industrial Revolution", "Ancient Rome"],
    Technology: ["Artificial Intelligence", "Machine Learning", "Blockchain", "Quantum Computing"],
    Arts: ["Shakespeare", "Renaissance Art", "Classical Music", "Impressionism"],
};

export default function LandingPage({ onGenerate, onUpload, loading }) {
    const [topic, setTopic] = useState("");
    const [pages, setPages] = useState(5);
    const [showSugg, setShowSugg] = useState(false);
    const [fileName, setFileName] = useState("");
    const fileRef = useRef();

    const filtered = topic.trim()
        ? Object.entries(SUGGESTIONS).reduce((acc, [cat, items]) => {
            const m = items.filter((t) => t.toLowerCase().includes(topic.toLowerCase()));
            if (m.length) acc.push([cat, m]);
            return acc;
        }, [])
        : Object.entries(SUGGESTIONS);

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            onUpload(file);
        }
    };

    const handleKey = (e) => {
        if (e.key === "Enter" && topic.trim()) {
            setShowSugg(false);
            onGenerate(topic, pages);
        }
    };

    return (
        <div className="landing">
            <div className="landing-hero">
                <h2 className="hero-title">
                    Learn Anything with <span className="gradient-text">AI-Powered</span> Lessons
                </h2>
                <p className="hero-sub">Generate interactive slides, quizzes, and flashcards from any topic or PDF</p>
            </div>

            <div className="landing-cards">
                {/* Topic Card */}
                <div className="card glass">
                    <div className="card-header">
                        <FaBrain className="card-icon" />
                        <h3>Create New Lesson</h3>
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Enter any topic..."
                            value={topic}
                            onChange={(e) => { setTopic(e.target.value); setShowSugg(true); }}
                            onFocus={() => setShowSugg(true)}
                            onKeyDown={handleKey}
                            className="input"
                        />
                        {showSugg && filtered.length > 0 && (
                            <div className="suggestions">
                                {filtered.map(([cat, items]) => (
                                    <div key={cat}>
                                        <div className="sugg-cat">{cat}</div>
                                        {items.map((t) => (
                                            <div key={t} className="sugg-item" onClick={() => { setTopic(t); setShowSugg(false); }}>
                                                {t}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="input-row">
                        <label className="label-sm">Slides:</label>
                        <input type="number" min="1" max="15" value={pages} onChange={(e) => setPages(e.target.value)} className="input input-sm" />
                    </div>
                    <button className="btn btn-primary" onClick={() => onGenerate(topic, pages)} disabled={!topic.trim() || loading}>
                        <FaRocket /> Generate Lesson
                    </button>
                </div>

                {/* PDF Card */}
                <div className="card glass">
                    <div className="card-header">
                        <FaFilePdf className="card-icon pdf-icon" />
                        <h3>Analyze PDF</h3>
                    </div>
                    <label className={`file-upload ${fileName ? "has-file" : ""}`} onClick={() => fileRef.current?.click()}>
                        <FaUpload />
                        <span>{fileName || "Click to upload PDF"}</span>
                    </label>
                    <input ref={fileRef} type="file" accept=".pdf" onChange={handleFile} hidden />
                </div>
            </div>

            <div className="feature-strip">
                {[
                    { icon: <FaBrain />, text: "AI Tutor" },
                    { icon: <FaGamepad />, text: "Quizzes" },
                    { icon: <FaLayerGroup />, text: "Flashcards" },
                    { icon: <FaFilePdf />, text: "Save Notes" },
                ].map((f) => (
                    <div key={f.text} className="feature-badge">
                        {f.icon} {f.text}
                    </div>
                ))}
            </div>
        </div>
    );
}
