import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaRocket, FaCode, FaLaptopCode, FaChartLine, FaBrain, FaUsers } from 'react-icons/fa';

const Home = () => {
    return (
        <div style={{ minHeight: 'calc(100vh - var(--nav-height))', color: 'white' }}>

            {/* Hero Section */}
            <section style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '100px 20px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Abstract Background Elements */}
                <div style={{ position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px', background: 'var(--primary)', filter: 'blur(150px)', opacity: '0.2', zIndex: -1 }}></div>
                <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: '300px', height: '300px', background: 'var(--secondary)', filter: 'blur(150px)', opacity: '0.2', zIndex: -1 }}></div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span style={{
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: 'var(--primary)',
                        padding: '8px 16px',
                        borderRadius: '99px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        marginBottom: '24px',
                        display: 'inline-block'
                    }}>
                        🚀 Revolutionizing Computer Science Education
                    </span>
                    <h1 style={{
                        fontSize: '4.5rem',
                        fontWeight: '800',
                        lineHeight: '1.1',
                        marginBottom: '24px',
                        maxWidth: '900px'
                    }}>
                        Master Algorithms <br />
                        <span className="gradient-text">The Visual Way</span>
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        color: 'var(--text-secondary)',
                        maxWidth: '650px',
                        margin: '0 auto 40px',
                        lineHeight: '1.8'
                    }}>
                        AlgoVerse is the ultimate platform where code meets clarity. Visualize complex algorithms, practice coding, and prepare for your dream company.
                    </p>

                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/algorithms" style={{ textDecoration: 'none' }}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    background: 'var(--primary)',
                                    color: 'white',
                                    padding: '16px 36px',
                                    borderRadius: '12px',
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    boxShadow: '0 20px 40px -10px var(--primary-glow)',
                                    border: 'none', cursor: 'pointer'
                                }}
                            >
                                Start Visualizing
                            </motion.button>
                        </Link>
                        <Link to="/contests" style={{ textDecoration: 'none' }}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                    color: 'white',
                                    padding: '16px 36px',
                                    borderRadius: '12px',
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    boxShadow: '0 20px 40px -10px rgba(245, 158, 11, 0.4)',
                                    border: 'none', cursor: 'pointer'
                                }}
                            >
                                Join Contest 🏆
                            </motion.button>
                        </Link>
                        <Link to="/coding-platform" style={{ textDecoration: 'none' }}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    color: 'white',
                                    padding: '16px 36px',
                                    borderRadius: '12px',
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(10px)',
                                    cursor: 'pointer'
                                }}
                            >
                                Practice IDE
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section style={{
                padding: '40px 0',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                background: 'rgba(255,255,255,0.01)'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '40px', textAlign: 'center' }}>
                    <StatItem number="50+" label="Algorithms" />
                    <StatItem number="1000+" label="Practice Problems" />
                    <StatItem number="500+" label="Company Guides" />
                    <StatItem number="10k+" label="Community Members" />
                </div>
            </section>

            {/* Feature Grid */}
            <section style={{ maxWidth: '1200px', margin: '100px auto', padding: '0 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '16px' }}>Everything You Need to Excel</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>From visualization to execution, we cover the entire learning lifecycle.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
                    <FeatureCard
                        icon={<FaBrain size={32} color="var(--primary)" />}
                        title="Step-by-Step Logic"
                        desc="Don't just watch. Understand WHY comparisons and swaps happen with our intelligent explanation engine."
                    />
                    <FeatureCard
                        icon={<FaCode size={32} color="var(--secondary)" />}
                        title="Integrated IDE"
                        desc="Write, run, and debug code in 4+ languages directly in the browser with our powerful coding platform."
                    />
                    <FeatureCard
                        icon={<FaLaptopCode size={32} color="var(--accent)" />}
                        title="Company Simulations"
                        desc="Practice with real interview questions from top tech giants like Google, Amazon, and TCS."
                    />
                    <FeatureCard
                        icon={<FaChartLine size={32} color="#10B981" />}
                        title="Smart Analytics"
                        desc="Track your progress, visualize complexity, and optimize your learning curve with detailed metrics."
                    />
                    <FeatureCard
                        icon={<FaRocket size={32} color="#F59E0B" />}
                        title="Gamified Learning"
                        desc="Earn badges, complete daily streaks, and compete on the global leaderboard."
                    />
                    <FeatureCard
                        icon={<FaUsers size={32} color="#3B82F6" />}
                        title="Global Community"
                        desc="Connect with 10,000+ developers, share solutions, and get help in real-time."
                    />
                </div>
            </section>

            {/* Call to Action */}
            <section style={{ maxWidth: '1000px', margin: '0 auto 100px', padding: '0 24px', textAlign: 'center' }}>
                <div className="glass-panel" style={{ padding: '60px', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 60%)', zIndex: -1 }}></div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '24px' }}>Ready to Boost Your Coding Skills?</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1.2rem' }}>Join AlgoVerse today and start your journey towards mastering Data Structures and Algorithms.</p>
                    <button style={{
                        background: 'white',
                        color: 'black',
                        padding: '16px 48px',
                        borderRadius: '99px',
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        boxShadow: '0 10px 30px rgba(255,255,255,0.2)'
                    }}>
                        Get Started for Free
                    </button>
                </div>
            </section>
        </div>
    );
};

// Components
const StatItem = ({ number, label }) => (
    <div>
        <h3 className="gradient-text" style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '8px' }}>{number}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{label}</p>
    </div>
);

const FeatureCard = ({ icon, title, desc }) => (
    <motion.div
        whileHover={{ y: -10 }}
        className="glass-panel"
        style={{ padding: '32px', borderRadius: '16px', background: 'rgba(30, 41, 59, 0.4)' }}
    >
        <div style={{ marginBottom: '24px', background: 'rgba(255,255,255,0.05)', width: '64px', height: '64px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '12px' }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>{desc}</p>
    </motion.div>
);

export default Home;
