import React from 'react';
import { motion } from 'framer-motion';

const ContestCard = ({ title, date, duration, active }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="glass-panel"
        style={{ padding: '24px', borderRadius: '16px', borderLeft: active ? '4px solid #22c55e' : '4px solid #444', marginBottom: '20px' }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem' }}>{title}</h3>
                <p style={{ color: '#aaa', margin: 0 }}>{date} • {duration}</p>
            </div>
            <button className="control-btn" style={{
                background: active ? 'var(--primary-teal)' : '#333',
                color: active ? 'black' : '#888',
                fontWeight: 'bold'
            }}>
                {active ? 'Enter Contest' : 'Registered'}
            </button>
        </div>
    </motion.div>
);

const Contests = () => {
    return (
        <div className="main-content">
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '16px' }}>Contest Arena 🏆</h1>
                    <p style={{ color: '#aaa', fontSize: '1.2rem' }}>Compete with the best. Climb the global leaderboard.</p>
                </div>

                <div style={{ display: 'grid', gap: '32px' }}>

                    {/* Active/Upcoming */}
                    <section>
                        <h2 style={{ marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Upcoming Contests</h2>
                        <ContestCard
                            title="Weekly Contest 128"
                            date="Starts in 02:14:35"
                            duration="90 Minutes"
                            active={true}
                        />
                        <ContestCard
                            title="Bi-Weekly Challenge 45"
                            date="Sat, Feb 14 • 8:00 PM IST"
                            duration="2 Hours"
                            active={false}
                        />
                    </section>

                    {/* Past */}
                    <section>
                        <h2 style={{ marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px', color: '#888' }}>Past Contests</h2>
                        <div style={{ opacity: 0.7 }}>
                            <ContestCard
                                title="Weekly Contest 127"
                                date="Ended 2 days ago"
                                duration="90 Minutes"
                                active={false}
                            />
                            <ContestCard
                                title="AlgoVerse Launch Cup"
                                date="Jan 2026"
                                duration="3 Hours"
                                active={false}
                            />
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default Contests;
