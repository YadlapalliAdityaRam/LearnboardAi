import React from 'react';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaRedo } from 'react-icons/fa';
import './AnimationControls.css';

const AnimationControls = ({
    isPlaying,
    onPlay,
    onPause,
    onStepForward,
    onStepBackward,
    onReset,
    speed,
    onSpeedChange,
    currentStep,
    totalSteps,
    onScrub,
    onManualInput,
    onGenerateRandom
}) => {
    return (
        <div className="animation-controls">
            {/* Playback Controls */}
            <div className="controls-group">
                <button onClick={onReset} title="Reset" className="control-btn icon-btn">
                    <FaRedo />
                </button>
                <button onClick={onStepBackward} disabled={currentStep === 0} title="Step Back" className="control-btn icon-btn">
                    <FaStepBackward />
                </button>
                <button
                    onClick={isPlaying ? onPause : onPlay}
                    className="control-btn play-btn"
                    title={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                <button onClick={onStepForward} disabled={currentStep === totalSteps - 1} title="Step Forward" className="control-btn icon-btn">
                    <FaStepForward />
                </button>
            </div>

            {/* Scrubber */}
            <div className="scrubber-container">
                <input
                    type="range"
                    min="0"
                    max={Math.max(0, totalSteps - 1)}
                    value={currentStep}
                    onChange={(e) => onScrub(parseInt(e.target.value))}
                    className="scrubber-input"
                />
                <span className="step-counter">{currentStep + 1} / {totalSteps || 1}</span>
            </div>

            {/* Speed Control */}
            <div className="speed-control">
                <label>Speed: {speed}x</label>
                <input
                    type="range"
                    min="0.5"
                    max="4"
                    step="0.5"
                    value={speed}
                    onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
                />
            </div>

            {/* Manual Input (New Feature) */}
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="e.g. 50, 10, 20"
                        id="custom-input"
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            flex: 1,
                            fontSize: '0.9rem'
                        }}
                    />
                    <button
                        onClick={() => {
                            const val = document.getElementById('custom-input').value;
                            if (!val) return;
                            const arr = val.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
                            if (arr.length > 0 && onManualInput) onManualInput(arr);
                        }}
                        style={{
                            background: 'var(--primary)',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '0.9rem'
                        }}
                    >
                        Set
                    </button>
                    <button
                        onClick={onGenerateRandom}
                        title="Randomize"
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            color: 'white',
                            padding: '6px',
                            borderRadius: '6px'
                        }}
                    >
                        🎲
                    </button>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Enter numbers separated by commas.
                </div>
            </div>
        </div>
    );
};

export default AnimationControls;
