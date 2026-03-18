import React from 'react';
import './Profile.css';

const Profile = ({ user }) => {
    const mockHistory = [
        { id: 1, name: 'Customer_Churn.csv', date: '2024-03-10', quality: 85 },
        { id: 2, name: 'Sales_Data_Q1.pdf', date: '2024-03-08', quality: 92 },
        { id: 3, name: 'Inventory_Audit.csv', date: '2024-03-05', quality: 78 },
    ];

    return (
        <div className="profile-page">
            <header className="page-header">
                <h1>User Profile</h1>
                <p>Manage your account and view cleaning history</p>
            </header>

            <div className="profile-grid">
                <div className="profile-card glass-card">
                    <div className="card-header">Account Details</div>
                    <div className="profile-info">
                        <div className="profile-avatar-large">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="info-group">
                            <label>Full Name</label>
                            <div className="info-value">{user?.name || 'Sriram Siddartha'}</div>
                        </div>
                        <div className="info-group">
                            <label>Email Address</label>
                            <div className="info-value">{user?.email || '23211a0523@bvrit.ac.in'}</div>
                        </div>
                        <div className="info-group">
                            <label>Role</label>
                            <div className="info-value">Data Scientist</div>
                        </div>
                    </div>
                </div>

                <div className="profile-card glass-card">
                    <div className="card-header">Activity History</div>
                    <div className="history-list">
                        {mockHistory.map(item => (
                            <div key={item.id} className="history-item">
                                <div className="history-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                                        <polyline points="13 2 13 9 20 9"></polyline>
                                    </svg>
                                </div>
                                <div className="history-details">
                                    <div className="file-name">{item.name}</div>
                                    <div className="file-date">{item.date}</div>
                                </div>
                                <div className="quality-badge" style={{
                                    color: item.quality > 80 ? '#00ff88' : '#ffaa00',
                                    borderColor: item.quality > 80 ? '#00ff8844' : '#ffaa0044'
                                }}>
                                    {item.quality}% Score
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
