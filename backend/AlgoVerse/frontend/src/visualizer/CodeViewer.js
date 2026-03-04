import React from 'react';
import { motion } from 'framer-motion';

const CodeViewer = ({ code, activeLine, language = 'javascript' }) => {
    // Basic syntax highlighting logic (can be expanded)
    const lines = code.split('\n');

    return (
        <div className="glass-panel" style={{
            padding: '16px',
            borderRadius: '12px',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            height: '100%',
            overflowY: 'auto',
            background: 'rgba(15, 23, 42, 0.6)'
        }}>
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>{language}</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                    <div style={{ width: '10px', height: '1000%', background: '#ff5f56', borderRadius: '50%' }}></div>
                    <div style={{ width: '10px', height: '10px', background: '#ffbd2e', borderRadius: '50%' }}></div>
                    <div style={{ width: '10px', height: '10px', background: '#27c93f', borderRadius: '50%' }}></div>
                </div>
            </div>

            {lines.map((line, index) => {
                const isActive = activeLine === index + 1; // 1-based index from step generator
                return (
                    <motion.div
                        key={index}
                        initial={false}
                        animate={{
                            backgroundColor: isActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                            borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent'
                        }}
                        style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            display: 'flex',
                            gap: '16px'
                        }}
                    >
                        <span style={{ color: 'var(--text-muted)', minWidth: '24px', textAlign: 'right', userSelect: 'none' }}>{index + 1}</span>
                        <code style={{ color: isActive ? 'white' : 'var(--text-primary)' }}>{line}</code>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default CodeViewer;
