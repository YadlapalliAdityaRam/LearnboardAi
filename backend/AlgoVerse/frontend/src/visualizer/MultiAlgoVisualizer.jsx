import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnimationCanvas from './AnimationCanvas';
import useAnimation from '../hooks/useAnimation';
import { generateBubbleSortSteps } from '../algorithms/sorting/bubbleSort';
import { generateSelectionSortSteps } from '../algorithms/sorting/selectionSort';
import { generateInsertionSortSteps } from '../algorithms/sorting/insertionSort';
import { generateMergeSortSteps } from '../algorithms/sorting/mergeSort';
import { generateQuickSortSteps } from '../algorithms/sorting/quickSort';
// Add others as needed

const ALGO_MAP = {
    'Bubble Sort': generateBubbleSortSteps,
    'Selection Sort': generateSelectionSortSteps,
    'Insertion Sort': generateInsertionSortSteps,
    'Merge Sort': generateMergeSortSteps,
    'Quick Sort': generateQuickSortSteps,
    // 'Heap Sort': generateHeapSortSteps, // Not implemented yet
};

const SingleAlgoView = ({ name, array, isPlaying, onReset, path, isAscending }) => {
    const generator = ALGO_MAP[name];

    // Safety check if algorithm generator exists
    if (!generator) {
        return (
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Visualization not available for {name}</p>
            </div>
        );
    }

    const memoizedGenerator = React.useCallback((arr) => {
        return generator(arr, isAscending);
    }, [generator, isAscending]);

    const {
        currentArray,
        currentStep,
        currentStepIndex,
        steps,
        play,
        pause,
        reset
    } = useAnimation(memoizedGenerator, array);

    // Timer state
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    // Sync attempt: Simple approach - parent controls play state, here we react to props
    useEffect(() => {
        if (isPlaying && !isFinished) {
            play();
            if (startTime === null) setStartTime(Date.now());
        } else {
            pause();
        }
    }, [isPlaying, play, pause, isFinished, startTime]);

    // Track completion
    useEffect(() => {
        if (currentStepIndex >= 0 && steps.length > 0 && currentStepIndex === steps.length - 1 && !isFinished) {
            setIsFinished(true);
            pause();
        }
    }, [currentStepIndex, steps.length, isFinished, pause]);

    // Stopwatch
    useEffect(() => {
        let interval;
        if (isPlaying && !isFinished && steps.length > 0) {
            interval = setInterval(() => {
                setElapsedTime(prev => prev + 100); // 100ms resolution
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isPlaying, isFinished, steps.length]);

    useEffect(() => {
        if (onReset) {
            reset();
            setElapsedTime(0);
            setIsFinished(false);
            setStartTime(null);
        }
    }, [onReset, reset]);

    const handleOpenPlayground = () => {
        // Navigate to the algorithm's specific page with current state
        // using window.location or navigate hook from parent
        // For now, let's just use window.open or navigate if passed
        // We'll emit an event or return a button
    };

    return (
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--primary-orange)' }}>{name}</h3>
                <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.9rem', color: isFinished ? 'var(--bar-sorted)' : 'var(--text-secondary)', fontWeight: isFinished ? 'bold' : 'normal', display: 'block' }}>
                        {isFinished ? '🏁 Finished' : `Step: ${currentStepIndex} / ${steps.length}`}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                        ⏱️ {(elapsedTime / 1000).toFixed(1)}s
                    </span>
                </div>
            </div>

            <div style={{ flex: 1, minHeight: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: '16px' }}>
                <AnimationCanvas
                    array={currentArray}
                    currentIndices={currentStep.indices || []}
                    compareIndices={currentStep.type === 'compare' ? currentStep.indices : []}
                    sortedIndices={currentStep.sortedIndices || []}
                />
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', minHeight: '3em', marginBottom: '12px' }}>
                    {currentStep.description || 'Ready to start'}
                </p>
                <Link
                    to={path}
                    className="control-btn"
                    style={{
                        display: 'block',
                        textAlign: 'center',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        background: 'rgba(255,255,255,0.05)',
                        width: '100%',
                        color: 'white'
                    }}
                >
                    Open Playground ↗
                </Link>
            </div>
        </div>
    );
};


const MultiAlgoVisualizer = ({ algorithms }) => {
    const [array, setArray] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [resetTrigger, setResetTrigger] = useState(0);
    const [manualInput, setManualInput] = useState('');
    const [error, setError] = useState('');
    const [isAscending, setIsAscending] = useState(true);

    // Generate random array on mount or load from storage
    useEffect(() => {
        const savedArray = sessionStorage.getItem('algo_race_array');
        const savedInput = sessionStorage.getItem('algo_race_input');

        if (savedArray && savedInput) {
            setArray(JSON.parse(savedArray));
            setManualInput(savedInput);
            setResetTrigger(prev => prev + 1); // Ensure visualizers update
        } else {
            handleGenerateArray();
        }
    }, []);

    // Persist array state
    useEffect(() => {
        if (array.length > 0) {
            sessionStorage.setItem('algo_race_array', JSON.stringify(array));
            sessionStorage.setItem('algo_race_input', manualInput);
        }
    }, [array, manualInput]);

    const handleGenerateArray = () => {
        // Limit to 10 integers as requested
        const newArr = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 5);
        setArray(newArr);
        setManualInput(newArr.join(', '));
        setError('');
        setIsPlaying(false);
        setResetTrigger(prev => prev + 1);
    };

    const handleManualSubmit = () => {
        if (!manualInput.trim()) return;

        const updates = manualInput.split(',').map(num => parseInt(num.trim(), 10));

        // Validation
        if (updates.some(isNaN)) {
            setError('Please enter valid numbers separated by commas.');
            return;
        }
        if (updates.length > 10) {
            setError(`Limit exceeded! Maximum 10 elements allowed. (You entered ${updates.length})`);
            return;
        }
        if (updates.length < 2) {
            setError('Please enter at least 2 numbers.');
            return;
        }

        setArray(updates);
        setError('');
        setIsPlaying(false);
        setResetTrigger(prev => prev + 1);
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const handleReset = () => {
        setIsPlaying(false);
        setResetTrigger(prev => prev + 1);
    };

    const toggleOrder = () => {
        setIsAscending(!isAscending);
        setIsPlaying(false);
        setResetTrigger(prev => prev + 1);
    };

    return (
        <div style={{ marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '2rem' }}>Live Race Evaluation</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Comparing {algorithms.length} algorithms. (Max 10 elements)</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {/* Order Toggle */}
                    <button
                        onClick={toggleOrder}
                        className="control-btn"
                        style={{
                            marginRight: '12px',
                            background: isAscending ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            color: isAscending ? '#22c55e' : '#ef4444',
                            border: `1px solid ${isAscending ? '#22c55e' : '#ef4444'}`
                        }}
                    >
                        Order: {isAscending ? 'Increasing ↑' : 'Decreasing ↓'}
                    </button>

                    <button onClick={togglePlay} className="control-btn play-btn" style={{ padding: '12px 24px', fontSize: '1.2rem' }}>
                        {isPlaying ? 'Pause All' : 'Run All'}
                    </button>
                    <button onClick={handleReset} className="control-btn">
                        Reset
                    </button>
                    <button onClick={handleGenerateArray} className="control-btn">
                        New Data 🎲
                    </button>
                </div>
            </div>

            {/* Manual Input Section */}
            <div style={{ marginBottom: '32px', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>Custom Data:</span>
                    <input
                        type="text"
                        value={manualInput}
                        onChange={(e) => setManualInput(e.target.value)}
                        placeholder="e.g. 50, 10, 25, 5 (Max 10)"
                        style={{
                            flex: 1,
                            background: 'rgba(0,0,0,0.2)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'white',
                            padding: '10px',
                            borderRadius: '8px',
                            fontFamily: 'monospace'
                        }}
                    />
                    <button onClick={handleManualSubmit} className="control-btn" style={{ background: 'var(--primary-teal)', color: 'black', fontWeight: 'bold' }}>
                        Set Data
                    </button>
                </div>
                {error && <p style={{ color: 'var(--bar-swapping)', margin: '8px 0 0 0', fontSize: '0.9rem' }}>⚠️ {error}</p>}
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${Math.max(1, algorithms.length)}, 1fr)`,
                gap: '24px'
            }}>
                {algorithms.map((algo, idx) => (
                    <SingleAlgoView
                        key={`${algo.id}-${resetTrigger}`} // Force remount on reset to clear internal hooks
                        name={algo.name}
                        path={algo.path}
                        array={array}
                        isPlaying={isPlaying}
                        onReset={resetTrigger}
                        isAscending={isAscending}
                    />
                ))}
            </div>
        </div>
    );
};

export default MultiAlgoVisualizer;
