import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navigation/Navbar';
import { Toaster } from 'react-hot-toast';

// Pages
import Home from './pages/Home';
import Algorithms from './pages/Algorithms';
import BubbleSortVisualizer from './visualizer/BubbleSortVisualizer';
import GenericVisualizer from './visualizer/GenericVisualizer';
import ComparisonVisualizer from './visualizer/ComparisonVisualizer';
import AlgorithmSpecsComparison from './pages/AlgorithmSpecsComparison';
import Companies from './pages/Companies';
import Visualize from './pages/Visualize';
import CodingPlatform from './pages/CodingPlatform';
import ProblemWorkspace from './pages/ProblemWorkspace';
import LearningPath from './pages/LearningPath';
import Community from './pages/Community';
import Profile from './pages/Profile';
import Contests from './pages/Contests';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Leaderboard from './pages/Leaderboard';

import { loadUser } from './redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Router>
      <div className="app-container">
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Algorithms */}
            <Route path="/algorithms" element={<Algorithms />} />
            <Route path="/algorithms/sorting/bubble" element={<BubbleSortVisualizer />} />

            {/* Generic Route for other algorithms */}
            <Route path="/algorithms/:category/:algorithm" element={<GenericVisualizer />} />

            <Route path="/companies" element={<Companies />} />

            {/* New Routes */}
            <Route path="/compare" element={<AlgorithmSpecsComparison />} />
            <Route path="/visualize" element={<Visualize />} />
            <Route path="/coding-platform" element={<CodingPlatform />} />
            <Route path="/coding-platform/:id" element={<ProblemWorkspace />} />
            <Route path="/learning-path" element={<LearningPath />} />
            <Route path="/community" element={<Community />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contests" element={<Contests />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/leaderboard" element={<Leaderboard />} />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AppContent />
  );
}

export default App;
