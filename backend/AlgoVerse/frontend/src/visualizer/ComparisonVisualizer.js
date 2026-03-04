import React, { useState, useEffect } from 'react';
import AnimationCanvas from './AnimationCanvas';
import useAnimation from '../hooks/useAnimation';
import { generateBubbleSortSteps } from '../algorithms/sorting/bubbleSort';
import { generateSelectionSortSteps } from '../algorithms/sorting/selectionSort';
// Import other algorithms as they become available

const ALGORITHMS = {
    'Bubble Sort': generateBubbleSortSteps,
    'Selection Sort': generateSelectionSortSteps,
    // 'Insertion Sort': generateInsertionSortSteps, 
};

const ComparisonVisualizer = () => {
    const [algo1Name, setAlgo1Name] = useState('Bubble Sort');
    const [algo2Name, setAlgo2Name] = useState('Selection Sort');
    const [array, setArray] = useState([]);

    // Generate shared array
    useEffect(() => {
        generateNewArray();
    }, []);

    const generateNewArray = () => {
        const newArr = Array.from({ length: 15 }, () => Math.floor(Math.random() * 100) + 5);
        setArray(newArr);
    };

    // Hooks
    const algo1 = useAnimation(ALGORITHMS[algo1Name], array);
    const algo2 = useAnimation(ALGORITHMS[algo2Name], array);

    // Sync Controls
    const handlePlay = () => { algo1.play(); algo2.play(); };
    const handlePause = () => { algo1.pause(); algo2.pause(); };
    const handleReset = () => { algo1.reset(); algo2.reset(); };

    // We need to sync the array updates when generating new array
    // When 'array' changes, useAnimation updates its internal state automatically due to dependencies?
    // Let's check useAnimation. 
    // If useAnimation takes 'initialArray', it might cache it. 
    // We might need to force reset or pass array as dependency.

    return (
        <div className="main-content" style={{ padding: '24px' }}>
            {/* Header & Controls */}
            <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Algorithm Race</h1>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Compare efficiency and behavior side-by-side.</p>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <button onClick={handlePlay} className="control-btn play-btn" title="Play Both">
                        ▶
                    </button>
                    <button onClick={handlePause} className="control-btn" title="Pause Both">
                        ⏸
                    </button>
                    <button onClick={generateNewArray} className="control-btn" title="New Random Array">
                        🎲
                    </button>
                </div>
            </div>

            {/* Comparison Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

                {/* Algo 1 */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <select
                            value={algo1Name}
                            onChange={(e) => setAlgo1Name(e.target.value)}
                            style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px', borderRadius: '8px' }}
                        >
                            {Object.keys(ALGORITHMS).map(name => <option key={name} value={name}>{name}</option>)}
                        </select>
                        <div style={{ color: 'var(--accent-yellow)' }}>Steps: {algo1.currentStepIndex}</div>
                    </div>
                    <div style={{ height: '300px' }}>
                        <AnimationCanvas
                            array={algo1.currentArray}
                            currentIndices={algo1.currentStep.indices || []}
                            compareIndices={algo1.currentStep.type === 'compare' ? algo1.currentStep.indices : []}
                            sortedIndices={algo1.currentStep.sortedIndices || []}
                        />
                    </div>
                    <p style={{ marginTop: '16px', minHeight: '40px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {algo1.currentStep.description}
                    </p>
                </div>

                {/* Algo 2 */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <select
                            value={algo2Name}
                            onChange={(e) => setAlgo2Name(e.target.value)}
                            style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px', borderRadius: '8px' }}
                        >
                            {Object.keys(ALGORITHMS).map(name => <option key={name} value={name}>{name}</option>)}
                        </select>
                        <div style={{ color: 'var(--accent-yellow)' }}>Steps: {algo2.currentStepIndex}</div>
                    </div>
                    <div style={{ height: '300px' }}>
                        <AnimationCanvas
                            array={algo2.currentArray}
                            currentIndices={algo2.currentStep.indices || []}
                            compareIndices={algo2.currentStep.type === 'compare' ? algo2.currentStep.indices : []}
                            sortedIndices={algo2.currentStep.sortedIndices || []}
                        />
                    </div>
                    <p style={{ marginTop: '16px', minHeight: '40px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {algo2.currentStep.description}
                    </p>
                </div>

            </div>
        </div>
    );
};

export default ComparisonVisualizer;
