import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearError } from '../../redux/slices/authSlice';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const { username, email, password, confirmPassword } = formData;

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, error, isLoading } = useSelector(state => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/coding-platform');
        }
        if (error) {
            setTimeout(() => dispatch(clearError()), 3000);
        }
    }, [isAuthenticated, error, navigate, dispatch]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        if (password !== confirmPassword) {
            // Dispatch error manually or show toast (using slice error for now is hard without action, so just alert/console)
            alert("Passwords do not match");
            return;
        }
        dispatch(register({ username, email, password }));
    };

    return (
        <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel"
                style={{ padding: '40px', borderRadius: '20px', width: '100%', maxWidth: '400px' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '10px' }}>Join AlgoVerse</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Start your coding journey today</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '10px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontSize: '0.9rem' }}
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={onSubmit}>
                    <div className="search-container" style={{ marginBottom: '20px' }}>
                        <FaUser style={{ position: 'absolute', left: '14px', top: '14px', color: '#64748b' }} />
                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={onChange}
                            placeholder="Username"
                            className="search-input"
                            style={{ width: '100%', paddingLeft: '40px' }}
                            required
                            minLength="3"
                        />
                    </div>

                    <div className="search-container" style={{ marginBottom: '20px' }}>
                        <FaEnvelope style={{ position: 'absolute', left: '14px', top: '14px', color: '#64748b' }} />
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            placeholder="Email Address"
                            className="search-input"
                            style={{ width: '100%', paddingLeft: '40px' }}
                            required
                        />
                    </div>

                    <div className="search-container" style={{ marginBottom: '20px' }}>
                        <FaLock style={{ position: 'absolute', left: '14px', top: '14px', color: '#64748b' }} />
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            placeholder="Password (min 6 chars)"
                            className="search-input"
                            style={{ width: '100%', paddingLeft: '40px' }}
                            required
                            minLength="6"
                        />
                    </div>

                    <div className="search-container" style={{ marginBottom: '30px' }}>
                        <FaLock style={{ position: 'absolute', left: '14px', top: '14px', color: '#64748b' }} />
                        <input
                            type="password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={onChange}
                            placeholder="Confirm Password"
                            className="search-input"
                            style={{ width: '100%', paddingLeft: '40px' }}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="control-btn"
                        style={{ width: '100%', padding: '12px', background: 'var(--primary-teal)', color: 'black', fontWeight: 'bold', justifyContent: 'center' }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : <><FaUserPlus /> Register</>}
                    </button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary-teal)', fontWeight: 'bold' }}>Login</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
