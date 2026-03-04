import { FaBookOpen, FaTrash } from "react-icons/fa";

export default function Sidebar({ history, onClear }) {
    return (
        <aside className="sidebar">
            <div className="sidebar-section">
                <h3><FaBookOpen /> Recent Lessons</h3>
                {history.length === 0 ? (
                    <p className="sidebar-empty">No recent lessons yet</p>
                ) : (
                    <ul className="history-list">
                        {history.map((h, i) => (
                            <li key={i} className="history-item" title={h.date}>
                                <span className="history-dot" />
                                {h.title}
                            </li>
                        ))}
                    </ul>
                )}
                {history.length > 0 && (
                    <button className="btn-ghost btn-sm" onClick={onClear}>
                        <FaTrash /> Clear History
                    </button>
                )}
            </div>
        </aside>
    );
}
