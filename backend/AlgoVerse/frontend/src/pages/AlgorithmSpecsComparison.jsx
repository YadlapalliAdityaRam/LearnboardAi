import React, { useState } from 'react';
import { algorithmList } from '../data/algorithmsData';
import { FaSearch, FaTimes } from 'react-icons/fa';
import MultiAlgoVisualizer from '../visualizer/MultiAlgoVisualizer';

const AlgorithmSpecsComparison = () => {
    // Array of 3 slots, initially null or from storage
    const [selectedAlgos, setSelectedAlgos] = useState(() => {
        const saved = sessionStorage.getItem('algo_comparison_selected');
        return saved ? JSON.parse(saved) : [null, null, null];
    });
    const [searchQueries, setSearchQueries] = useState(['', '', '']);
    const [showSuggestions, setShowSuggestions] = useState([false, false, false]);
    const [isVisualizing, setIsVisualizing] = useState(() => {
        const saved = sessionStorage.getItem('algo_comparison_visualizing');
        return saved ? JSON.parse(saved) : false;
    });

    // Persistence Effects
    React.useEffect(() => {
        sessionStorage.setItem('algo_comparison_selected', JSON.stringify(selectedAlgos));
    }, [selectedAlgos]);

    React.useEffect(() => {
        sessionStorage.setItem('algo_comparison_visualizing', JSON.stringify(isVisualizing));
    }, [isVisualizing]);

    const handleSelect = (index, algo) => {
        const newSelected = [...selectedAlgos];
        newSelected[index] = algo;
        setSelectedAlgos(newSelected);

        const newQueries = [...searchQueries];
        newQueries[index] = ''; // Clear search
        setSearchQueries(newQueries);

        const newShow = [...showSuggestions];
        newShow[index] = false;
        setShowSuggestions(newShow);
        setIsVisualizing(false); // Reset visualization if selection changes
    };

    const handleClear = (index) => {
        const newSelected = [...selectedAlgos];
        newSelected[index] = null;
        setSelectedAlgos(newSelected);
        setIsVisualizing(false);
    };

    const getAvailableAlgorithms = (currentIndex) => {
        const query = searchQueries[currentIndex].toLowerCase();
        // Filter out algorithms already selected in OTHER slots
        const otherSelectedIds = selectedAlgos
            .filter((algo, idx) => algo && idx !== currentIndex)
            .map(algo => algo.id);

        return algorithmList.filter(algo =>
            !otherSelectedIds.includes(algo.id) &&
            algo.name.toLowerCase().includes(query)
        );
    };

    const handleStartVisualization = () => {
        setIsVisualizing(true);
        // Scroll to visualization section
        setTimeout(() => {
            document.getElementById('visualization-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const selectedCount = selectedAlgos.filter(Boolean).length;

    return (
        <div className="main-content" style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px' }}>Algorithm Comparison</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Compare Time Complexity, Space Complexity, and Visualize them side-by-side.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
                {[0, 1, 2].map((slotIndex) => (
                    <div key={slotIndex} className="glass-panel" style={{ padding: '24px', borderRadius: '16px', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>

                        {/* Search / Header */}
                        {!selectedAlgos[slotIndex] ? (
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                    padding: '12px',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}>
                                    <FaSearch style={{ color: 'var(--text-secondary)', marginRight: '12px' }} />
                                    <input
                                        type="text"
                                        placeholder={`Select Algorithm ${slotIndex + 1}`}
                                        value={searchQueries[slotIndex]}
                                        onChange={(e) => {
                                            const newQueries = [...searchQueries];
                                            newQueries[slotIndex] = e.target.value;
                                            setSearchQueries(newQueries);
                                            const newShow = [...showSuggestions];
                                            newShow[slotIndex] = true;
                                            setShowSuggestions(newShow);
                                        }}
                                        onFocus={() => {
                                            const newShow = [...showSuggestions];
                                            newShow[slotIndex] = true;
                                            setShowSuggestions(newShow);
                                        }}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'white',
                                            width: '100%',
                                            outline: 'none',
                                            fontSize: '1rem'
                                        }}
                                    />
                                </div>
                                {showSuggestions[slotIndex] && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        right: 0,
                                        background: 'var(--bg-card-dark)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        marginTop: '8px',
                                        overflow: 'hidden',
                                        zIndex: 10,
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                                    }}>
                                        {getAvailableAlgorithms(slotIndex).map(algo => (
                                            <div
                                                key={algo.id}
                                                onClick={() => handleSelect(slotIndex, algo)}
                                                style={{ padding: '12px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}
                                                onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                                                onMouseOut={(e) => e.target.style.background = 'transparent'}
                                            >
                                                {algo.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, color: 'var(--primary-orange)' }}>{selectedAlgos[slotIndex].name}</h3>
                                <button onClick={() => handleClear(slotIndex)} style={{ background: 'transparent', color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                                    <FaTimes />
                                </button>
                            </div>
                        )}

                        {/* Details */}
                        {selectedAlgos[slotIndex] && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>

                                {/* Description */}
                                <div>
                                    <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px' }}>Description</h4>
                                    <p style={{ lineHeight: '1.6' }}>{selectedAlgos[slotIndex].description}</p>
                                </div>

                                {/* Complexity Grid */}
                                <div style={{ display: 'grid', gap: '16px' }}>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px' }}>
                                        <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>Time Complexity</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span>Best</span>
                                                <span style={{ color: 'var(--complexity-constant)', fontWeight: '600' }}>{selectedAlgos[slotIndex].timeComplexity?.best || 'N/A'}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span>Average</span>
                                                <span style={{ color: 'var(--complexity-linear)', fontWeight: '600' }}>{selectedAlgos[slotIndex].timeComplexity?.average || 'N/A'}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span>Worst</span>
                                                <span style={{ color: 'var(--complexity-quadratic)', fontWeight: '600' }}>{selectedAlgos[slotIndex].timeComplexity?.worst || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px' }}>
                                        <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>Space Complexity</h4>
                                        <span style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--primary-teal)' }}>
                                            {selectedAlgos[slotIndex].spaceComplexity || 'N/A'}
                                        </span>
                                    </div>
                                </div>

                                {/* Use Cases */}
                                <div>
                                    <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px' }}>Best Used For</h4>
                                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                        {selectedAlgos[slotIndex].useCases?.map((useCase, i) => (
                                            <li key={i} style={{ marginBottom: '8px' }}>{useCase}</li>
                                        )) || <li>General purpose</li>}
                                    </ul>
                                </div>

                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Visualize Button */}
            {selectedCount > 0 && (
                <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '40px' }}>
                    <button
                        onClick={handleStartVisualization}
                        disabled={isVisualizing}
                        className="control-btn play-btn"
                        style={{
                            padding: '16px 48px',
                            fontSize: '1.2rem',
                            background: isVisualizing ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, var(--primary-orange), var(--primary-teal))',
                            transform: isVisualizing ? 'none' : 'scale(1)',
                            opacity: isVisualizing ? 0.5 : 1
                        }}
                    >
                        {isVisualizing ? 'Visualization Active Below ↓' : 'Visualize Comparison'}
                    </button>
                </div>
            )}

            {/* Visualization Section */}
            {isVisualizing && (
                <div id="visualization-section">
                    <MultiAlgoVisualizer algorithms={selectedAlgos.filter(Boolean)} />
                </div>
            )}
        </div>
    );
};

export default AlgorithmSpecsComparison;
