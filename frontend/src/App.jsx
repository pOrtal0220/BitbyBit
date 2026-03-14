// frontend/src/App.jsx (Updated)
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Auth from './components/Auth';
import EmployerSection from './components/EmployerSection';
import FreelancerSection from './components/FreelancerSection';

// Note: You can add an "AuditDetail" route if you want to link to specific projects
function App() {
  return (
    <div className="w-full overflow-x-hidden">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />
          <Route path="/employer" element={<EmployerSection />} />
          <Route path="/freelancer" element={<FreelancerSection />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;