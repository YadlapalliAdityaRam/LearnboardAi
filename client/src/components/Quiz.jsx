import { useState } from "react";
import { generateQuiz } from "../services/api";
import { useToast } from "../context/ToastContext";
import { FaPlay, FaCheck } from "react-icons/fa";

export default function Quiz({ content }) {
    const toast = useToast();
    const [questions, setQuestions] = useState(null);
    const [selected, setSelected] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [score, setScore] = useState(null);

    async function handleGenerate() {
        setLoading(true);
        setQuestions(null);
        setSelected({});
        setSubmitted(false);
        setScore(null);
        try {
            const data = await generateQuiz(content);
            setQuestions(data.questions);
            toast("Quiz ready! Test your knowledge.", "success");
        } catch (err) {
            toast("Error generating quiz: " + err.message, "error");
        } finally {
            setLoading(false);
        }
    }

    function handleSelect(qIdx, optIdx) {
        if (submitted) return;
        setSelected((s) => ({ ...s, [qIdx]: optIdx }));
    }

    function handleSubmit() {
        if (submitted) return;
        setSubmitted(true);
        let correct = 0;
        questions.forEach((q, i) => {
            if (selected[i] === q.correct) correct++;
        });
        setScore(correct);
    }

    function optionClass(qIdx, optIdx) {
        let cls = "quiz-option";
        if (selected[qIdx] === optIdx) cls += " selected";
        if (submitted) {
            if (optIdx === questions[qIdx].correct) cls += " correct";
            else if (selected[qIdx] === optIdx) cls += " incorrect";
        }
        return cls;
    }

    if (loading) return <div className="panel-center"><div className="spinner" /> Generating quiz...</div>;

    if (!questions) {
        return (
            <div className="panel-center">
                <h3>🎮 Quiz</h3>
                <p>Test your knowledge on this lesson</p>
                <button className="btn btn-primary" onClick={handleGenerate}><FaPlay /> Generate Quiz</button>
            </div>
        );
    }

    const pct = score !== null ? Math.round((score / questions.length) * 100) : 0;
    const emoji = pct >= 80 ? "🏆" : pct >= 60 ? "👏" : pct >= 40 ? "📚" : "💪";

    return (
        <div className="quiz-panel">
            <h3>🎮 Quiz</h3>
            {questions.map((q, qi) => (
                <div key={qi} className="quiz-question">
                    <p className="quiz-q-text">{qi + 1}. {q.question}</p>
                    <div className="quiz-options">
                        {q.options.map((opt, oi) => (
                            <div key={oi} className={optionClass(qi, oi)} onClick={() => handleSelect(qi, oi)}>
                                {opt}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            {!submitted && (
                <button className="btn btn-primary btn-full" onClick={handleSubmit} disabled={Object.keys(selected).length < questions.length}>
                    <FaCheck /> Submit Answers
                </button>
            )}
            {score !== null && (
                <div className="quiz-score">
                    {emoji} You scored <strong>{score}/{questions.length}</strong> ({pct}%)
                </div>
            )}
        </div>
    );
}
