import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Order = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    item: '',
    quantity: '',
    amount: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!formData.email && !formData.phone) {
      alert('Please provide either email or phone number');
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          quantity: Number(formData.quantity),
          amount: Number(formData.amount)
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to add order");
      }

      alert("Order added successfully!");
      setFormData({
        email: '',
        phone: '',
        item: '',
        quantity: '',
        amount: ''
      });

    } catch (error) {
      console.error("Error adding order:", error);
      if (error.message === 'Customer does not exist in the system') {
        const shouldAddCustomer = window.confirm(
          'Customer not found. Would you like to add them now?'
        );
        if (shouldAddCustomer) {
          navigate('/add-customer'); // Adjust route as needed
        }
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="add-order-form">
      <h2>Create New Order</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Customer Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Customer Phone:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <small className="form-text">Provide at least one of email or phone</small>
        </div>
        <div className="form-group">
          <label>Item Name:</label>
          <input
            type="text"
            name="item"
            value={formData.item}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="1"
          />
        </div>
        <div className="form-group">
          <label>Amount:</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="0"
          />
        </div>
        <button type="submit" className="btn-submit">
          Create Order
        </button>
      </form>
    </div>
  );
};

export default Order;