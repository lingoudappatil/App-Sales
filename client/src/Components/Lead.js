import React, { useState } from "react";

const Lead = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    state: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to add lead");
      }

      alert("Lead added successfully!");
      setFormData({ name: '', email: '', phone: '', address: '', state: '' }); // Reset form
    } catch (error) {
      console.error("Error adding lead:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="add-customer-form">
      <h2>New Lead Registration for Sale</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <textarea name="address" value={formData.address} onChange={handleChange} rows="3" />
        </div>
        <div className="form-group">
          <label>State:</label>
          <input type="text" name="state" value={formData.state} onChange={handleChange} required />
        </div>
        <button type="submit" className="submit-button">
          Add Lead
        </button>
      </form>
    </div>
  );
};

export default Lead;