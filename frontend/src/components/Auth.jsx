import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, ShieldCheck, AlertCircle } from 'lucide-react';

export default function Auth({ mode }) {
  const navigate = useNavigate();
  const [role, setRole] = useState('employer');
  const [formData, setFormData] = useState({ email: '', password: '', fullName: '' });
  const [error, setError] = useState('');

  // 3. PASSWORD CONSTRAINTS LOGIC
  const validatePassword = (pass) => {
    const minLength = pass.length >= 8;
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    const hasNumber = /\d/.test(pass);
    return minLength && hasSymbol && hasNumber;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // --- SIGN UP LOGIC ---
    if (mode === 'signup') {
      if (!validatePassword(formData.password)) {
        setError("Security Weak: Password must be 8+ chars with a number and symbol (!@#).");
        return;
      }
      
      // Save user to "LocalDB" (Simulating a real database save)
      const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
      if (users.find(u => u.email === formData.email)) {
        setError("This email is already registered.");
        return;
      }

      users.push({ ...formData, role });
      localStorage.setItem('registered_users', JSON.stringify(users));
      alert("Account Created! Please Login.");
      navigate('/login');
    } 

    // --- 1 & 2. LOGIN LOGIC ---
    else {
      const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const user = users.find(u => u.email === formData.email);

      if (!user) {
        setError("No account found with this email. Please sign up first."); // Requirement 2
        return;
      }

      if (user.password !== formData.password) {
        setError("Invalid password. Please try again."); // Requirement 1
        return;
      }

      // Success
      localStorage.setItem('currentUser', JSON.stringify(user));
      navigate(user.role === 'employer' ? '/employer' : '/freelancer');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-50 overflow-hidden px-6">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/30 blur-[120px]"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-white">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-slate-900">
              {mode === 'login' ? 'Secure Login' : 'Create Identity'}
            </h2>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl flex items-center gap-2 animate-shake">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <Input 
                icon={<User size={18}/>} 
                type="text" 
                placeholder="Full Name" 
                required
                onChange={e => setFormData({...formData, fullName: e.target.value})}
              />
            )}
            <Input 
              icon={<Mail size={18}/>} 
              type="email" 
              placeholder="Email Address" 
              required
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
            <Input 
              icon={<Lock size={18}/>} 
              type="password" 
              placeholder="Password" 
              required
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
            
            {mode === 'signup' && (
              <div className="p-1.5 bg-slate-100 rounded-2xl flex gap-1">
                {['employer', 'freelancer'].map(r => (
                  <button 
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 py-2 text-[10px] font-black rounded-xl transition-all ${role === r ? 'bg-white shadow text-blue-600' : 'text-slate-400'}`}
                  >
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
            )}

            <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/20">
              {mode === 'login' ? 'Verify & Enter' : 'Register Agent'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-slate-500">
            <Link to={mode === 'login' ? "/signup" : "/login"} className="text-blue-600 font-bold hover:underline">
              {mode === 'login' ? "Create an account" : "Already have an account?"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ icon, ...props }) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">{icon}</div>
      <input {...props} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-900" />
    </div>
  );
}