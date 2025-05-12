import React, { useState, useEffect } from 'react';
import './AccountSettings.css';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const [passwordDetails, setPasswordDetails] = useState({
    oldPassword: '',
    newPassword: '',
  });
  const [authError, setAuthError] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check login status via any protected endpoint
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:3002/userdetails', {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();

        if (response.status === 401 || data.status === false) {
          setAuthError(true);
          toast.warning(data.message || "Please log in.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong while checking login.");
        setAuthError(true);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPasswordDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3002/userpassword`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordDetails),
      });

      const data = await response.json();

      if (response.status === 401 || data.status === false) {
        toast.warning(data.message || "Incorrect old password or not logged in.");
        return;
      }

      toast.success("🔒 Password updated successfully.");
      setPasswordDetails({ oldPassword: '', newPassword: '' });
      navigate("/profile");
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error("Failed to update password. Try again.");
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</p>;

  if (authError) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>🔐 Please log in to view this page.</h2>
        <a
          href="/login"
          style={{
            marginTop: "20px",
            display: "inline-block",
            fontSize: "18px",
            color: "#007bff",
            textDecoration: "underline",
          }}
        >
          👉 Login here
        </a>
      </div>
    );
  }

  return (
    <div className='accountsettings'>
      <h1 className='mainhead1'>Change Password</h1>
      <form onSubmit={handleSubmit} className='form'>
        <div className='form-group'>
          <label htmlFor='oldpass'>Old Password <span>*</span></label>
          <input
            type="password"
            name="oldPassword"
            value={passwordDetails.oldPassword}
            onChange={handleChange}
            id='oldpass'
            required
          />
        </div>

        <div className='form-group'>
          <label htmlFor='newpass'>New Password <span>*</span></label>
          <input
            type="password"
            name="newPassword"
            value={passwordDetails.newPassword}
            onChange={handleChange}
            id='newpass'
            required
          />
        </div>

        <button type='submit' className='mainbutton1'>Save Changes</button>
      </form>
    </div>
  );
};

export default ChangePassword;
