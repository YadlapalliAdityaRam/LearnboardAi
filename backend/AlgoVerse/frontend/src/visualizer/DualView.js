import React from 'react';
import CodeViewer from './CodeViewer';

const DualView = ({ children, code, activeLine, algorithmName, description }) => {
    return (
        <div style={{ display: 'flex', gap: '24px', height: 'calc(100vh - var(--nav-height) - 48px)', padding: '24px' }}>
            {/* Left: Visualization (Flexible width) */}
            <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="glass-panel" style={{ flex: 1, padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>{algorithmName}</h2>
                        <div style={{
                            background: 'rgba(255,255,255,0.1)',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '500',
                            color: 'var(--accent-yellow)',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                        }}>
                            {description || "Ready to start"}
                        </div>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        {children}
                    </div>
                </div>
            </div>

            {/* Right: Code & Controls (Fixed width) */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '400px' }}>
                <CodeViewer code={code} activeLine={activeLine} />
            </div>
        </div>
    );
};

export default DualView;
