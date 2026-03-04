import { useState } from "react";
import { generateFlashcards } from "../services/api";
import { useToast } from "../context/ToastContext";
import { FaPlay, FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function Flashcards({ content }) {
    const toast = useToast();
    const [cards, setCards] = useState(null);
    const [idx, setIdx] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleGenerate() {
        setLoading(true);
        setCards(null);
        setIdx(0);
        setFlipped(false);
        try {
            const data = await generateFlashcards(content);
            setCards(data.cards);
            toast("Flashcards ready! Click to flip.", "success");
        } catch (err) {
            toast("Error generating flashcards: " + err.message, "error");
        } finally {
            setLoading(false);
        }
    }

    function goNext() {
        if (idx < cards.length - 1) { setIdx(idx + 1); setFlipped(false); }
    }

    function goPrev() {
        if (idx > 0) { setIdx(idx - 1); setFlipped(false); }
    }

    if (loading) return <div className="panel-center"><div className="spinner" /> Generating flashcards...</div>;

    if (!cards) {
        return (
            <div className="panel-center">
                <h3>🃏 Flashcards</h3>
                <p>Study key concepts from this lesson</p>
                <button className="btn btn-primary" onClick={handleGenerate}><FaPlay /> Generate Flashcards</button>
            </div>
        );
    }

    const card = cards[idx];

    return (
        <div className="flashcard-panel">
            <h3>🃏 Flashcards</h3>
            <div className={`flashcard ${flipped ? "flipped" : ""}`} onClick={() => setFlipped(!flipped)}>
                <div className="flashcard-inner">
                    <div className="flashcard-front">
                        <span className="fc-label">Question</span>
                        <p>{card.front}</p>
                    </div>
                    <div className="flashcard-back">
                        <span className="fc-label">Answer</span>
                        <p>{card.back}</p>
                    </div>
                </div>
            </div>
            <div className="fc-nav">
                <button className="btn btn-secondary" onClick={goPrev} disabled={idx === 0}><FaArrowLeft /></button>
                <span>{idx + 1} / {cards.length}</span>
                <button className="btn btn-secondary" onClick={goNext} disabled={idx === cards.length - 1}><FaArrowRight /></button>
            </div>
        </div>
    );
}
