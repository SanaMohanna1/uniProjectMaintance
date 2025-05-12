import React, { useState, useEffect } from 'react';
import './UserAddress.css';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const UserAddress = () => {
  const [userAddress, setUserAddress] = useState({ address: '', postalcode: '' });
  const [authError, setAuthError] = useState(false);
  const [loading, setLoading] = useState(true);
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
        toast.warning(data.message || "Please log in to view your address.");
        return;
      }

      if (data && data.user) {
        setUserAddress({
          address: data.user.address,
          postalcode: data.user.postalcode,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load address details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/userAddress`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userAddress),
      });

      const data = await response.json();

      if (response.status === 401 || data.status === false) {
        toast.warning(data.message || "Please log in to update your address.");
        setAuthError(true);
        return;
      }

      toast.success("📦 Address updated successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update address.");
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</p>;

  if (authError) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>🔐 Please log in to view your address details.</h2>
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
    <div className='Address_settings'>
      <h1 className='mainhead_address'>Address Information</h1>
      <div className='form_address'>
        <div className='form-group_address'>
          <label htmlFor='address'>Your Address <span>*</span></label>
          <input
            type='text'
            name='address'
            id='address'
            onChange={handleChange}
            value={userAddress.address || ''}
          />
        </div>
        <div className='form-group_address'>
          <label htmlFor='postalcode'>Your PostalCode <span>*</span></label>
          <input
            type='text'
            name='postalcode'
            id='postalcode'
            onChange={handleChange}
            value={userAddress.postalcode || ''}
          />
        </div>
      </div>
      <button className='mainbutton1' onClick={handleSubmit}>Save Changes</button>
    </div>
  );
};

export default UserAddress;
