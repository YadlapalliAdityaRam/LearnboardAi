import React from 'react';
import { useParams } from 'react-router-dom';

const GenericVisualizer = () => {
    const { category, algorithm } = useParams();

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>{algorithm ? algorithm.charAt(0).toUpperCase() + algorithm.slice(1) : 'Algorithm'} Visualizer</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
                Visualization for <strong>{algorithm}</strong> is coming soon!
            </p>
            <div style={{ margin: '2rem 0', padding: '2rem', border: '1px dashed #ccc', borderRadius: '8px' }}>
                [Animation Canvas Placeholder]
            </div>
        </div>
    );
};

export default GenericVisualizer;
