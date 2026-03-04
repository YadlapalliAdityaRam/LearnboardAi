import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../../redux/slices/authSlice';
import { FaSearch, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import BackForward from './BackForward';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector(state => state.auth);

    const isActive = (path) => {
        return location.pathname.startsWith(path) && path !== '/';
    };

    const getLinkStyle = (path) => ({
        color: isActive(path) ? 'var(--primary-orange)' : 'var(--text-primary)',
        fontWeight: isActive(path) ? '600' : '400'
    });

    const onLogout = () => {
        dispatch(logout());
    };

    return (
        <nav className="navbar">
            <div className="nav-left">
                <BackForward />
                <Link to="/" className="logo">AlgoVerse</Link>

                <div className="search-container">
                    <FaSearch style={{ position: 'absolute', left: '14px', top: '13px', color: '#64748b' }} />
                    <input type="text" placeholder="Search algorithms..." className="search-input" />
                </div>
            </div>

            <div className="nav-right">
                <Link to="/algorithms" className="nav-link" style={getLinkStyle('/algorithms')}>Algorithms</Link>
                <Link to="/compare" className="nav-link" style={getLinkStyle('/compare')}>Compare</Link>
                <Link to="/companies" className="nav-link" style={getLinkStyle('/companies')}>Companies</Link>
                <Link to="/contests" className="nav-link" style={getLinkStyle('/contests')}>Contests</Link>
                <Link to="/community" className="nav-link" style={getLinkStyle('/community')}>Community</Link>
                <Link to="/coding-platform" className="nav-link" style={getLinkStyle('/coding-platform')}>Practice</Link>
                <Link to="/leaderboard" className="nav-link" style={getLinkStyle('/leaderboard')}>Leaderboard</Link>

                {isAuthenticated ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <Link to="/profile" className="nav-link" style={{
                            background: 'var(--primary-teal)', color: 'black', padding: '6px 16px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px'
                        }}>
                            <FaUserCircle /> {user?.username}
                        </Link>
                        <button onClick={onLogout} className="nav-link" style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '1.2rem', cursor: 'pointer' }} title="Logout">
                            <FaSignOutAlt />
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Link to="/login" className="nav-link" style={{ color: 'var(--text-primary)' }}>Login</Link>
                        <Link to="/register" className="nav-link" style={{
                            background: 'var(--primary-orange)', color: 'black', padding: '6px 16px', borderRadius: '8px', fontWeight: 'bold'
                        }}>Sign Up</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
