import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProblems } from '../redux/slices/problemSlice';
import { FaFire, FaCheckCircle, FaLock, FaSearch, FaFilter, FaTrophy } from 'react-icons/fa';

const CodingPlatform = () => {
    const dispatch = useDispatch();
    const { problems, isLoading, error } = useSelector(state => state.problems);
    const { user } = useSelector(state => state.auth);

    const [filter, setFilter] = useState({ difficulty: 'All', topic: 'All', company: 'All' });
    const [searchTerm, setSearchTerm] = useState('');
    const [solvedIDs, setSolvedIDs] = useState([]);

    useEffect(() => {
        dispatch(fetchProblems());
        // In a real app, solvedIDs would come from user profile/stats
        const solved = JSON.parse(localStorage.getItem('solved_problems') || '[]');
        setSolvedIDs(solved);
    }, [dispatch]);

    const uniqueCompanies = [...new Set(problems.flatMap(p => p.companies || []))].sort();
    const uniqueTopics = [...new Set(problems.map(p => p.topic))].sort();

    const filteredProblems = problems.filter(p => {
        const matchesDiff = filter.difficulty === 'All' || p.difficulty === filter.difficulty;
        const matchesTopic = filter.topic === 'All' || p.topic === filter.topic;
        const matchesCompany = filter.company === 'All' || (p.companies && p.companies.includes(filter.company));
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesDiff && matchesTopic && matchesCompany && matchesSearch;
    });

    // Daily Challenge Logic (Mock: Rotates based on day)
    const dailyProblem = problems.length > 0
        ? problems[Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24) % problems.length]
        : null;

    if (isLoading) return <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>Loading Problems...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>Error: {error}</div>;

    return (
        <div className="main-content">
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>

                {/* Header Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <h1 className="gradient-text" style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '8px' }}>
                            {user ? `Welcome back, ${user.username} 👋` : 'Practice Arena ⚔️'}
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                            Sharpen your skills. Conquer the interview.
                        </p>
                    </div>

                    {/* Progress Widget */}
                    <div className="glass-panel" style={{ padding: '16px 24px', borderRadius: '12px', display: 'flex', gap: '24px', alignItems: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-teal)' }}>{solvedIDs.length}</div>
                            <div style={{ fontSize: '0.8rem', color: '#888' }}>Solved</div>
                        </div>
                        <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }}></div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-orange)' }}>
                                {problems.length > 0 ? Math.round((solvedIDs.length / problems.length) * 100) : 0}%
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#888' }}>Completion</div>
                        </div>
                    </div>
                </div>

                {/* Daily Challenge & Stats Grid */}
                {dailyProblem && (
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '40px' }}>
                        {/* Daily Challenge Card */}
                        <div className="glass-panel" style={{
                            padding: '32px', borderRadius: '24px',
                            background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.1), rgba(0,0,0,0))',
                            border: '1px solid rgba(234, 179, 8, 0.3)',
                            position: 'relative', overflow: 'hidden'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', position: 'relative', zIndex: 1 }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#eab308', marginBottom: '12px', fontWeight: 'bold' }}>
                                        <FaFire /> DAILY CHALLENGE
                                    </div>
                                    <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>{dailyProblem.title}</h2>
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                                        <span style={{ background: 'rgba(234, 179, 8, 0.2)', color: '#eab308', padding: '4px 12px', borderRadius: '8px', fontSize: '0.9rem' }}>{dailyProblem.difficulty}</span>
                                        <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '8px', fontSize: '0.9rem' }}>{dailyProblem.topic}</span>
                                    </div>
                                    <Link to={`/coding-platform/${dailyProblem.slug || dailyProblem._id}`}>
                                        <button className="control-btn" style={{ background: '#eab308', color: 'black', fontWeight: 'bold', padding: '12px 32px' }}>
                                            Solve Now
                                        </button>
                                    </Link>
                                </div>
                                <FaTrophy style={{ fontSize: '8rem', opacity: 0.1, transform: 'rotate(15deg)' }} />
                            </div>
                        </div>

                        {/* Quick Stats / Leaderboard Preview */}
                        <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px', background: 'rgba(30, 41, 59, 0.3)' }}>
                            <h3 style={{ margin: '0 0 16px 0' }}>Top Performers 🏆</h3>
                            {[
                                { name: 'Aditya Ram (You)', xp: '1250 XP', rank: 1 },
                                { name: 'graph_wizard', xp: '1100 XP', rank: 2 },
                                { name: 'algo_bot', xp: '950 XP', rank: 3 }
                            ].map(user => (
                                <div key={user.rank} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <span style={{ color: user.rank === 1 ? '#eab308' : user.rank === 2 ? '#94a3b8' : '#b45309', fontWeight: 'bold' }}>#{user.rank}</span>
                                        <span>{user.name}</span>
                                    </div>
                                    <span style={{ color: '#aaa', fontSize: '0.9rem' }}>{user.xp}</span>
                                </div>
                            ))}
                            <Link to="/profile" style={{ display: 'block', marginTop: '16px', textAlign: 'center', color: 'var(--primary-teal)', fontSize: '0.9rem' }}>View Full Leaderboard →</Link>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    <div className="search-container" style={{ flex: 1, minWidth: '200px' }}>
                        <FaSearch style={{ position: 'absolute', left: '14px', top: '13px', color: '#64748b' }} />
                        <input
                            type="text"
                            placeholder="Search problems..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                            style={{ width: '100%' }}
                        />
                    </div>
                    <select
                        className="control-btn"
                        style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }}
                        value={filter.difficulty}
                        onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}
                    >
                        <option value="All">Difficulty: All</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                    <select
                        className="control-btn"
                        style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }}
                        value={filter.topic}
                        onChange={(e) => setFilter({ ...filter, topic: e.target.value })}
                    >
                        <option value="All">Topic: All</option>
                        {uniqueTopics.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <select
                        className="control-btn"
                        style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }}
                        value={filter.company}
                        onChange={(e) => setFilter({ ...filter, company: e.target.value })}
                    >
                        <option value="All">Company: All</option>
                        {uniqueCompanies.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {/* Problem List */}
                <div style={{ display: 'grid', gap: '12px' }}>
                    {filteredProblems.map(problem => {
                        const isSolved = solvedIDs.includes(problem.id);
                        return (
                            <motion.div
                                key={problem._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-panel"
                                style={{
                                    padding: '20px 24px', borderRadius: '16px',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    borderLeft: isSolved ? '4px solid #22c55e' : '4px solid transparent'
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                        <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{problem.title}</h3>
                                        {isSolved && <FaCheckCircle style={{ color: '#22c55e', fontSize: '1rem' }} />}
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <span style={{
                                            color: problem.difficulty === 'Easy' ? '#22c55e' :
                                                problem.difficulty === 'Medium' ? '#eab308' : '#ef4444',
                                            fontSize: '0.85rem', fontWeight: 'bold'
                                        }}>
                                            {problem.difficulty}
                                        </span>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>• {problem.topic}</span>
                                        {problem.companies && problem.companies.length > 0 && (
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                {problem.companies.slice(0, 3).map(c => (
                                                    <span key={c} style={{ background: 'rgba(255,255,255,0.05)', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', color: '#aaa' }}>{c}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Link
                                    to={`/coding-platform/${problem.slug || problem._id}`}
                                    className="control-btn"
                                    style={{
                                        textDecoration: 'none',
                                        background: isSolved ? 'rgba(34, 197, 94, 0.1)' : 'var(--primary-teal)',
                                        color: isSolved ? '#22c55e' : 'black',
                                        fontWeight: 'bold',
                                        fontSize: '0.9rem',
                                        padding: '10px 24px'
                                    }}
                                >
                                    {isSolved ? 'Solve Again' : 'Solve'}
                                </Link>
                            </motion.div>
                        );
                    })}

                    {filteredProblems.length === 0 && (
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '60px' }}>
                            <FaSearch style={{ fontSize: '2rem', marginBottom: '16px', opacity: 0.5 }} />
                            <p>No problems found matching your filters.</p>
                            <button className="control-btn" onClick={() => setFilter({ difficulty: 'All', topic: 'All', company: 'All' })} style={{ marginTop: '12px' }}>
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CodingPlatform;
