import React, { useState, useEffect } from 'react';
import './AccountSettings.css';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const AccountSettings = () => {
  const [userDetails, setUserDetails] = useState({ userName: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const navigate = useNavigate();

  const fetchDetails = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/userdetails`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.status === 401 || data.status === false) {
        setAuthError(true);
        toast.warning(data.message || "Please log in to view your profile.");
        return;
      }

      if (data && data.user) {
        setUserDetails({
          userName: data.user.username,
          email: data.user.email,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load user details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/userdetails`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetails),
      });

      const data = await response.json();

      if (response.status === 401 || data.status === false) {
        toast.warning(data.message || "Please log in to update your details.");
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      toast.success("✅ Your details have been updated.");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</p>;

  if (authError) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>🔐 Please log in to view your account settings.</h2>
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
      <h1 className='mainhead1'>Personal Information</h1>
      <div className='form'>
        <div className='form-group'>
          <label htmlFor='name'>Your Name <span>*</span></label>
          <input type='text' name='userName' id='name' onChange={handleChange} value={userDetails.userName || ''} />
        </div>
        <div className='form-group'>
          <label htmlFor='email'>Email <span>*</span></label>
          <input type='email' name='email' id='email' onChange={handleChange} value={userDetails.email || ''} />
        </div>
      </div>
      <button className='mainbutton1' onClick={handleSubmit}>Save Changes</button>
    </div>
  );
};

export default AccountSettings;
