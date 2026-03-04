import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import api from '../utils/api';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();

        // Socket.io Connection
        const socket = io('http://localhost:5000');

        socket.on('leaderboardUpdate', (updatedUser) => {
            // Optimistic update or refetch
            // For simplicity, let's refetch to get the correct order
            fetchLeaderboard();
        });

        return () => socket.disconnect();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const res = await api.get('/users/leaderboard');
            setUsers(res.data.users);
        } catch (err) {
            console.error("Failed to fetch leaderboard", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-content">
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
                <h1 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '40px', background: 'linear-gradient(to right, #4fd1c5, #63b3ed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Top Coders
                </h1>

                {loading ? (
                    <div style={{ textAlign: 'center' }}>Loading...</div>
                ) : (
                    <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                                    <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>Rank</th>
                                    <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>User</th>
                                    <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>Level</th>
                                    <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>XP</th>
                                    <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>Solved</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <motion.tr
                                        key={user._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                                    >
                                        <td style={{ padding: '16px' }}>
                                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                        </td>
                                        <td style={{ padding: '16px', fontWeight: 'bold' }}>{user.username}</td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                                                Lvl {user.level}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', color: 'var(--primary-teal)' }}>{user.xp}</td>
                                        <td style={{ padding: '16px' }}>{user.stats.acceptedSubmissions}</td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
