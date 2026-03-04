import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { algorithmList } from '../data/algorithmsData';

const Algorithms = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [displayedAlgorithms, setDisplayedAlgorithms] = useState([]);

    const categories = ['All', 'Sorting', 'Searching', 'Graphs', 'Trees', 'Dynamic Programming', 'Greedy'];
    const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

    // Initial Random Shuffle
    useEffect(() => {
        const shuffled = [...algorithmList].sort(() => 0.5 - Math.random());
        setDisplayedAlgorithms(shuffled);
    }, []);

    // Filter Logic
    useEffect(() => {
        let filtered = algorithmList;

        if (selectedCategory !== 'All') {
            filtered = filtered.filter(algo => algo.category === selectedCategory);
        }

        if (selectedDifficulty !== 'All') {
            filtered = filtered.filter(algo => algo.difficulty === selectedDifficulty);
        }

        // If filtering returns to 'All' category, re-shuffle to keep it dynamic, 
        // otherwise sort by name for stability in specific categories
        if (selectedCategory === 'All' && selectedDifficulty === 'All') {
            // Keep the random order or re-shuffle could be jarring. 
            // Let's just filter the original shuffled list if we stored it, 
            // but for now, simple filtering is fine.
            // To ensure "spread randomly" feeling, we can shuffle again if 'All' is picked.
            filtered = [...algorithmList].sort(() => 0.5 - Math.random());
        }

        setDisplayedAlgorithms(filtered);
    }, [selectedCategory, selectedDifficulty]);

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <h1 className="gradient-text" style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '16px' }}>
                    Algorithm Universe
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                    Explore our galaxy of algorithms. Filter by type or difficulty to find your next challenge.
                </p>
            </div>

            {/* Controls Container */}
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', marginBottom: '40px' }}>

                {/* Category Filters */}
                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '12px', letterSpacing: '1px' }}>Category</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => { setSelectedCategory(cat); setSelectedDifficulty('All'); }} // Reset difficulty on category switch
                                style={{
                                    padding: '8px 20px',
                                    borderRadius: '99px',
                                    background: selectedCategory === cat ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                    color: selectedCategory === cat ? 'white' : 'var(--text-secondary)',
                                    border: selectedCategory === cat ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Difficulty Filters (Conditional or Always Visible - User asked for "after filtering logic") */}
                <div style={{
                    opacity: selectedCategory !== 'All' ? 1 : 0.5,
                    pointerEvents: selectedCategory !== 'All' ? 'auto' : 'none',
                    transition: 'opacity 0.3s'
                }}>
                    <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '12px', letterSpacing: '1px' }}>Difficulty</h3>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {difficulties.map(diff => (
                            <button
                                key={diff}
                                onClick={() => setSelectedDifficulty(diff)}
                                style={{
                                    padding: '6px 16px',
                                    borderRadius: '8px',
                                    background: selectedDifficulty === diff ? 'var(--secondary)' : 'rgba(255,255,255,0.05)',
                                    color: selectedDifficulty === diff ? 'white' : 'var(--text-secondary)',
                                    border: selectedDifficulty === diff ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {diff}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid */}
            <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                <AnimatePresence>
                    {displayedAlgorithms.map((algo) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            key={algo.id}
                        >
                            <Link to={algo.path} style={{ textDecoration: 'none' }}>
                                <div className="glass-panel" style={{
                                    padding: '24px',
                                    borderRadius: '16px',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    background: 'rgba(30, 41, 59, 0.4)',
                                    transition: 'transform 0.2s',
                                    border: '1px solid rgba(255,255,255,0.05)'
                                }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            padding: '4px 8px',
                                            borderRadius: '6px',
                                            background: 'rgba(255,255,255,0.1)',
                                            color: 'var(--text-secondary)'
                                        }}>
                                            {algo.category}
                                        </span>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            padding: '4px 8px',
                                            borderRadius: '6px',
                                            background: algo.difficulty === 'Beginner' ? 'rgba(16, 185, 129, 0.2)' : algo.difficulty === 'Intermediate' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                            color: algo.difficulty === 'Beginner' ? '#34D399' : algo.difficulty === 'Intermediate' ? '#FBBF24' : '#F87171'
                                        }}>
                                            {algo.difficulty}
                                        </span>
                                    </div>

                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px' }}>{algo.name}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', flex: 1 }}>{algo.description}</p>

                                    <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', color: 'var(--primary)', fontWeight: '500', fontSize: '0.9rem' }}>
                                        Visualize Algorithm →
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {displayedAlgorithms.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    No algorithms found matching your filters.
                </div>
            )}
        </div>
    );
};

export default Algorithms;
