import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Thread = ({ title, author, views, replies, tags }) => (
    <motion.div
        whileHover={{ x: 5 }}
        style={{
            padding: '20px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '12px',
            marginBottom: '12px',
            cursor: 'pointer',
            border: '1px solid rgba(255,255,255,0.05)'
        }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#e0e0e0' }}>{title}</h4>
            <span style={{ color: '#666', fontSize: '0.9rem' }}>{views} views</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            {tags.map(t => (
                <span key={t} style={{ fontSize: '0.8rem', background: '#222', padding: '2px 8px', borderRadius: '4px', color: '#aaa' }}>{t}</span>
            ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#888' }}>
            <span>by <span style={{ color: 'var(--primary-teal)' }}>{author}</span></span>
            <span>{replies} replies</span>
        </div>
    </motion.div>
);

const Community = () => {
    return (
        <div className="main-content">
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '2.5rem' }}>Community 🗣️</h1>
                        <p style={{ color: '#aaa' }}>Discuss solutions, share interviews, and help others.</p>
                    </div>
                    <button className="control-btn" style={{ background: 'var(--primary-orange)', color: 'white', border: 'none' }}>
                        + New Thread
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '32px' }}>

                    {/* Threads */}
                    <div>
                        <Thread
                            title="Google L4 Interview Experience (Offer Accepted!)"
                            author="graph_wizard"
                            views={1240}
                            replies={45}
                            tags={['Interview', 'Google']}
                        />
                        <Thread
                            title="Detailed explanation for DP on Trees problem"
                            author="algo_master"
                            views={890}
                            replies={12}
                            tags={['Dynamic Programming', 'Tutorial']}
                        />
                        <Thread
                            title="Why is my O(n) solution getting TLE in Python?"
                            author="py_newbie"
                            views={340}
                            replies={8}
                            tags={['Help', 'Python']}
                        />
                        <Thread
                            title="Official Contest 128 Discussion"
                            author="System"
                            views={5600}
                            replies={230}
                            tags={['Contest', 'Official']}
                        />
                    </div>

                    {/* Sidebar */}
                    <div>
                        <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px' }}>
                            <h3 style={{ marginTop: 0 }}>Trending Tags</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {['DP', 'Graphs', 'Interview', 'Amazon', 'System Design'].map(t => (
                                    <span key={t} style={{ background: '#333', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', color: '#ddd' }}>#{t}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Community;
