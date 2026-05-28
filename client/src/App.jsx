import { useState, useEffect, useCallback } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider, useToast } from "./context/ToastContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import LandingPage from "./components/LandingPage";
import Classroom from "./components/Classroom";
import { generateLesson, analyzePDF, healthCheck } from "./services/api";
import { Analytics } from "@vercel/analytics/react";

function AppInner() {
    const toast = useToast();
    const [view, setView] = useState("home"); // home | classroom
    const [lessonData, setLessonData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState("");
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem("lb-history") || "[]"));

    useEffect(() => {
        healthCheck().then(() => console.log("✅ Backend connected")).catch(() => toast("Cannot connect to backend. Start server first.", "error"));
    }, []);

    const saveHistory = useCallback((title) => {
        const entry = { title, date: new Date().toLocaleDateString() };
        const updated = [entry, ...history].slice(0, 10);
        setHistory(updated);
        localStorage.setItem("lb-history", JSON.stringify(updated));
    }, [history]);

    async function handleGenerate(topic, pages) {
        if (!topic.trim()) { toast("Please enter a topic", "warning"); return; }
        setLoading(true);
        setLoadingMsg("✨ Crafting your lesson...");
        try {
            const data = await generateLesson(topic, parseInt(pages));
            setLessonData(data);
            setView("classroom");
            saveHistory(topic);
            toast(`Lesson on "${topic}" generated!`, "success");
        } catch (err) {
            toast(`Error: ${err.message}`, "error");
        } finally {
            setLoading(false);
        }
    }

    async function handleUpload(file) {
        setLoading(true);
        setLoadingMsg("📚 Analyzing your PDF...");
        try {
            const data = await analyzePDF(file);
            setLessonData(data);
            setView("classroom");
            saveHistory(`PDF: ${file.name}`);
            toast("PDF analyzed!", "success");
        } catch (err) {
            toast(`Error: ${err.message}`, "error");
        } finally {
            setLoading(false);
        }
    }

    function handleDownload() {
        if (!lessonData) return;
        import("jspdf").then(({ jsPDF }) => {
            const doc = new jsPDF();
            let y = 20;
            doc.setFontSize(24);
            doc.setTextColor(99, 102, 241);
            doc.text("LearnBoard AI Notes", 105, y, { align: "center" });
            y += 12;
            doc.setFontSize(10);
            doc.setTextColor(100, 116, 139);
            doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, y, { align: "center" });
            y += 15;
            doc.setDrawColor(99, 102, 241);
            doc.line(20, y, 190, y);
            y += 10;

            lessonData.slides.forEach((slide, i) => {
                if (y > 250) { doc.addPage(); y = 20; }
                doc.setFontSize(14);
                doc.setTextColor(99, 102, 241);
                doc.text(`${i + 1}. ${slide.title}`, 20, y);
                y += 8;
                doc.setFontSize(10);
                doc.setTextColor(30, 41, 59);
                const lines = doc.splitTextToSize(slide.content, 170);
                lines.forEach((line) => {
                    if (y > 275) { doc.addPage(); y = 20; }
                    doc.text(line, 20, y);
                    y += 5;
                });
                y += 5;
                if (slide.explanation) {
                    slide.explanation.forEach((exp) => {
                        if (y > 275) { doc.addPage(); y = 20; }
                        const el = doc.splitTextToSize(`• ${exp}`, 165);
                        doc.text(el, 25, y);
                        y += el.length * 5 + 2;
                    });
                }
                y += 10;
            });
            doc.save(`LearnBoard_Notes_${Date.now()}.pdf`);
            toast("Notes saved as PDF!", "success");
        });
    }

    return (
        <div className="app">
            <Navbar />
            <div className="app-body">
                <Sidebar history={history} onClear={() => { setHistory([]); localStorage.removeItem("lb-history"); }} />
                <main className="main-content">
                    {view === "home" && (
                        <LandingPage onGenerate={handleGenerate} onUpload={handleUpload} loading={loading} />
                    )}
                    {view === "classroom" && lessonData && (
                        <Classroom data={lessonData} onBack={() => setView("home")} onDownload={handleDownload} />
                    )}
                </main>
            </div>

            {/* Loading Overlay */}
            {loading && (
                <div className="loading-overlay">
                    <div className="loading-card">
                        <div className="spinner" />
                        <p>{loadingMsg}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <ToastProvider>
                <AppInner />
                <Analytics />
            </ToastProvider>
        </ThemeProvider>
    );
}
