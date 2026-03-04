import { useTheme } from "../context/ThemeContext";
import { FaMoon, FaSun, FaGraduationCap } from "react-icons/fa";

export default function Navbar() {
    const { dark, toggle } = useTheme();

    return (
        <header className="navbar">
            <div className="navbar-brand">
                <FaGraduationCap className="navbar-icon" />
                <h1>LearnBoard <span className="accent">AI</span></h1>
            </div>
            <button className="dark-toggle" onClick={toggle} title="Toggle dark mode">
                {dark ? <FaSun /> : <FaMoon />}
            </button>
        </header>
    );
}
