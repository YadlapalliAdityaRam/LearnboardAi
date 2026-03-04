import { useState } from "react";
import { askTutor } from "../services/api";
import { FaPaperPlane } from "react-icons/fa";

export default function AiTutor({ context }) {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleAsk() {
        if (!question.trim()) return;
        setLoading(true);
        setAnswer("");
        try {
            const data = await askTutor(question, context);
            setAnswer(data.answer);
        } catch (err) {
            setAnswer("❌ Error: " + err.message);
        } finally {
            setLoading(false);
        }
    }

    function formatAnswer(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\n\n/g, '</p><p style="margin-top:0.75rem;">')
            .replace(/\n/g, "<br>");
    }

    return (
        <div className="tutor-panel">
            <h3>🤖 AI Tutor</h3>
            <p className="tutor-hint">Ask any question about the current slide content</p>
            <div className="tutor-input">
                <input
                    type="text"
                    className="input"
                    placeholder="Type your question..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                />
                <button className="btn btn-primary" onClick={handleAsk} disabled={loading || !question.trim()}>
                    <FaPaperPlane />
                </button>
            </div>
            {loading && <div className="tutor-loading">🤔 Thinking...</div>}
            {answer && !loading && (
                <div className="tutor-answer" dangerouslySetInnerHTML={{ __html: formatAnswer(answer) }} />
            )}
        </div>
    );
}
