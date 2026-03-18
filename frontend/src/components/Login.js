import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onLogin({ email, name: email.split('@')[0] });
        }, 1000);
    };

    return (
        <div className="login-page">
            <div className="login-backdrop-glow"></div>
            <div className="login-card-premium">
                <div className="login-header">
                    <div className="premium-logo">IDCAS <span>PRO</span></div>
                    <h3>Intelligent Data Cleaning & Analysis</h3>
                    <p>Login to your professional workspace</p>
                </div>

                <form className="login-form-premium" onSubmit={handleSubmit}>
                    <div className="input-field">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-field">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-login-premium" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
                    </button>
                </form>

                <div className="login-footer-premium">
                    New to IDCAS? <a href="#">Request Access</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
