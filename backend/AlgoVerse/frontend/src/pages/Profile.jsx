import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { logout } from '../redux/slices/authSlice';
import { problems } from '../data/problems'; // Keep for problem titles if not fully populated
import { BADGES } from '../utils/gamification';

// Heatmap Component
const ActivityHeatmap = ({ history }) => {
    // Generate last 365 days
    const today = new Date();
    const days = [];
    for (let i = 364; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        days.push(d.toISOString().split('T')[0]);
    }

    const submissionsByDay = {};
    if (history && Array.isArray(history)) {
        history.forEach(item => {
            submissionsByDay[item._id] = item.count;
        });
    }

    return (
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '800px' }}>
            {days.map(day => {
                const count = submissionsByDay[day] || 0;
                let color = 'rgba(255,255,255,0.05)';
                if (count > 0) color = '#3b82f6'; // Blue for 1-2
                if (count > 2) color = '#8b5cf6'; // Purple for 3+
                if (count > 5) color = '#22c55e'; // Green for high activity

                return (
                    <div
                        key={day}
                        title={`${day}: ${count} submissions`}
                        style={{
                            width: '12px', height: '12px', borderRadius: '2px',
                            backgroundColor: color
                        }}
                    />
                );
            })}
        </div>
    );
};

const Profile = () => {
    const { user, isAuthenticated } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    // Local state for fetched data
    const [statsData, setStatsData] = useState({ heatmap: [], topics: {}, difficulties: {} });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            fetchUserData();
        }
    }, [isAuthenticated]);

    const fetchUserData = async () => {
        try {
            const [submissionsRes, statsRes] = await Promise.all([
                api.get('/submissions/my'),
                api.get('/users/stats')
            ]);

            setMySubmissions(submissionsRes.data.submissions);
            setStatsData(statsRes.data);
        } catch (err) {
            console.error("Failed to fetch profile data", err);
            toast.error("Could not load profile");
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2>Please Login</h2>
                    <p>You need to be logged in to view your profile.</p>
                    <Link to="/login" className="control-btn" style={{ background: 'var(--primary-teal)', color: 'black', marginTop: '20px', display: 'inline-block' }}>
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return <div className="main-content" style={{ padding: '40px' }}>Loading Profile...</div>;
    }

    // Stats from User Object
    const { username, level, xp, stats, badges, solvedProblems } = user || {};

    // Topic logic handled by backend now
    const topicCounts = statsData.topics || {};
    const maxTopicCount = Math.max(...Object.values(topicCounts), 1);

    // Calculate Acceptance Rate
    const acceptRate = stats.totalSubmissions > 0
        ? Math.round((stats.acceptedSubmissions / stats.totalSubmissions) * 100)
        : 0;

    return (
        <div className="main-content">
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: `linear-gradient(135deg, var(--primary-teal), var(--primary-blue))`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', border: `4px solid var(--primary-teal)` }}>
                        {username ? username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <h1 style={{ margin: 0, fontSize: '2.5rem' }}>{username}</h1>
                            <span style={{ background: 'var(--primary-teal)', color: 'black', padding: '4px 12px', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.9rem' }}>Level {level}</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', margin: '4px 0 12px 0' }}>XP: {xp}</p>

                        {/* XP Bar (Visual only for now, assume 1000 XP per level cap scaling or static) */}
                        <div style={{ height: '8px', width: '100%', maxWidth: '400px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(xp % 1000) / 10}%` }} // Simplified percentage
                                style={{ height: '100%', background: 'var(--primary-teal)' }}
                            />
                        </div>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                        <button
                            onClick={() => dispatch(logout())}
                            className="control-btn"
                            style={{ background: '#ef4444', color: 'white', border: 'none' }}
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Badges */}
                <div style={{ marginBottom: '40px' }}>
                    <h3 style={{ marginBottom: '16px' }}>Badges</h3>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        {badges && badges.length === 0 ? <p style={{ color: '#888' }}>No badges yet. Start solving!</p> : badges.map((b, idx) => (
                            <div key={idx} title={b.name} style={{ background: 'rgba(255,255,255,0.05)', padding: '12px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <span style={{ fontSize: '1.5rem' }}>{b.icon || '🏅'}</span>
                                <span style={{ fontWeight: 'bold' }}>{b.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                    <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', textAlign: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '3rem', color: 'var(--primary-teal)' }}>{solvedProblems ? solvedProblems.length : 0}</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Problems Solved</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', textAlign: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '3rem', color: 'var(--accent-yellow)' }}>{acceptRate}%</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Acceptance Rate</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', textAlign: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '3rem', color: '#a855f7' }}>{stats.totalSubmissions || 0}</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Total Submissions</p>
                    </div>
                </div>

                {/* Heatmap */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', marginBottom: '40px' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Submission Activity</h3>
                    <ActivityHeatmap history={statsData.heatmap} />
                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '12px', justifyContent: 'flex-end' }}>
                        <span>Less</span>
                        <div style={{ width: '12px', height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}></div>
                        <div style={{ width: '12px', height: '12px', background: '#3b82f6', borderRadius: '2px' }}></div>
                        <div style={{ width: '12px', height: '12px', background: '#8b5cf6', borderRadius: '2px' }}></div>
                        <div style={{ width: '12px', height: '12px', background: '#22c55e', borderRadius: '2px' }}></div>
                        <span>More</span>
                    </div>
                </div>

                {/* Skills Graph */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '24px' }}>Skill Distribution</h3>
                        {Object.keys(topicCounts).length === 0 ? (
                            <p style={{ color: '#888' }}>Solve problems to see your stats!</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {Object.entries(topicCounts).map(([topic, count]) => (
                                    <div key={topic}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.9rem' }}>
                                            <span>{topic}</span>
                                            <span>{count}</span>
                                        </div>
                                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(count / maxTopicCount) * 100}%` }}
                                                style={{ height: '100%', background: 'var(--primary-orange)' }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Recent Submissions</h3>
                        {mySubmissions.length === 0 ? (
                            <p style={{ color: '#888' }}>No submissions yet.</p>
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {mySubmissions.slice(0, 5).map(sub => (
                                    <li key={sub._id} style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <Link to={`/coding-platform/${sub.problem._id}`} style={{ color: 'var(--primary-teal)', textDecoration: 'none', display: 'block' }}>
                                                {sub.problem.title}
                                            </Link>
                                            <span style={{ fontSize: '0.75rem', color: '#666' }}>{new Date(sub.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <span style={{
                                            fontSize: '0.8rem',
                                            color: sub.status === 'accepted' ? '#22c55e' : '#ef4444',
                                            fontWeight: 'bold',
                                            textTransform: 'capitalize'
                                        }}>
                                            {sub.status.replace('_', ' ')}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};


