import React from 'react';
import { companies, guide } from '../data/companyData';

const Companies = () => {
    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Placement Guide</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Comprehensive details for top service and product-based companies.</p>

            <section style={{ marginBottom: '48px' }}>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '24px', borderBottom: '2px solid #E2E8F0', paddingBottom: '8px' }}>Company Profiles</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                    {companies.map((company, idx) => (
                        <div key={idx} style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '24px',
                            boxShadow: 'var(--shadow-sm)',
                            border: '1px solid #E2E8F0'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>{company.name}</h3>
                                <span style={{
                                    fontSize: '0.75rem',
                                    padding: '4px 8px',
                                    borderRadius: '999px',
                                    background: company.type === 'Product-Based' ? '#E0E7FF' : '#DCFCE7',
                                    color: company.type === 'Product-Based' ? '#4338CA' : '#166534',
                                    fontWeight: '600'
                                }}>
                                    {company.type}
                                </span>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Required Skills</h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {company.skills.map(skill => (
                                        <span key={skill} style={{ fontSize: '0.8rem', background: '#F1F5F9', padding: '2px 8px', borderRadius: '4px' }}>{skill}</span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Recruitment Process</h4>
                                <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', marginBottom: '16px' }}>
                                    {company.process.map((step, i) => (
                                        <li key={i} style={{ marginBottom: '4px' }}>{step}</li>
                                    ))}
                                </ul>
                            </div>

                            {company.focusAreas && (
                                <div>
                                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Practice Focus Areas 🎯</h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {company.focusAreas.map((area, j) => (
                                            <a
                                                key={j}
                                                href={`/coding-platform?topic=${area.topic}`}
                                                style={{
                                                    textDecoration: 'none',
                                                    fontSize: '0.85rem',
                                                    background: 'var(--primary)',
                                                    color: 'white',
                                                    padding: '6px 12px',
                                                    borderRadius: '6px',
                                                    fontWeight: '500',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    transition: 'transform 0.2s'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                            >
                                                {area.name} ↗
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <section style={{ background: 'white', padding: '32px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '24px' }}>Preparation Strategy</h2>
                <div style={{ whiteSpace: 'pre-line', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                    {guide}
                </div>
            </section>
        </div>
    );
};

export default Companies;
