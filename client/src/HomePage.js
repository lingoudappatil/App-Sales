import React, { useState, useEffect } from "react";
import "./HomePage.css";
import Lead from "./Components/Lead";
import Quotation from "./Components/Quotation";
import AddCustomerForm from "./Components/AddCustomerForm";
import Order from "./Components/Order";

const HomePage = ({ setCurrentPage }) => {
  const [activeContent, setActiveContent] = useState("Dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [customerCount, setCustomerCount] = useState(0);
  const [leadsCount, setLeadsCount] = useState(0);
  const [quotationsCount, setQuotationsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch customer count
  const fetchCustomerCount = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/customers");
      if (response.ok) {
        const customers = await response.json();
        setCustomerCount(customers.length);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  // Fetch leads count
  const fetchLeadsCount = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/leads");
      if (response.ok) {
        const leads = await response.json();
        setLeadsCount(leads.length);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  // Fetch quotations count
  const fetchQuotationsCount = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/quotations");
      if (response.ok) {
        const quotations = await response.json();
        setQuotationsCount(quotations.length);
      }
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  // Fetch orders count
  const fetchOrdersCount = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/orders");
      if (response.ok) {
        const orders = await response.json();
        setOrdersCount(orders.length);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Fetch all data when Dashboard is active
  useEffect(() => {
    if (activeContent === "Dashboard") {
      fetchCustomerCount();
      fetchLeadsCount();
      fetchQuotationsCount();
      fetchOrdersCount();
    }
  }, [activeContent]);

  // Handle logout
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      setCurrentPage("login");
    }
  };

  // Get icons for sidebar items
  const getIcon = (item) => {
    const icons = {
      Dashboard: "📊",
      Lead: "👤",
      Quotation: "⚙️",
      Order: "📞",
      "Add Customer": "➕",
      Logout: "🚪",
    };
    return <span>{icons[item]}</span>;
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeContent) {
      case "Dashboard":
        return (
          <div className="dashboard-content">
            <p>📊 Welcome to Lingouda's Dashboard! Here you can see an overview of your activities.</p>
            <div className="stats-container">
              <div className="stat-box">
                <h2>Sales Data Overview</h2>
                <h3>Total Customers</h3>
                <p>{customerCount}</p>
              </div>
              <div className="stat-box">
                <h3>Total Leads</h3>
                <p>{leadsCount}</p>
              </div>
              <div className="stat-box">
                <h3>Total Quotations</h3>
                <p>{quotationsCount}</p>
              </div>
              <div className="stat-box">
                <h3>Total Orders</h3>
                <p>{ordersCount}</p>
              </div>
            </div>
          </div>
        );
      case "Lead":
        return <Lead />;
      case "Quotation":
        return <Quotation />;
      case "Order":
        return <Order />;
      case "Add Customer":
        return <AddCustomerForm onCustomerAdded={fetchCustomerCount} />;
      default:
        return <div>Welcome to the Dashboard Lingouda, This includes Sales Operations</div>;
    }
  };

  return (
    <div className={`container ${darkMode ? "dark" : "light"}`}>
      <div className={`top-bar ${darkMode ? "dark" : "light"}`}>
        <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? "⬅️" : "➡️"}
        </button>
        <h2 className="top-bar-title">Welcome, Admin</h2>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />
        </div>

        <span style={{ marginLeft: "auto", color: "white" }}>
          {currentTime.toLocaleTimeString()}
        </span>
        <button className="dark-mode-button" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
        <span className="notification-bell">🔔</span>
      </div>

      <div className="content-wrapper">
        <div className={`sidebar ${sidebarOpen ? "expanded" : "collapsed"}`}>
          <h2 className="logo">{sidebarOpen ? "My Sale App" : "🔷"}</h2>
          <ul className="sidebar-list">
            {["Dashboard", "Add Customer", "Lead", "Quotation", "Order", "Logout"].map((item) => (
              <li
                key={item}
                className={`sidebar-list-item ${activeContent === item ? "active" : ""}`}
                onClick={() => (item === "Logout" ? handleLogout() : setActiveContent(item))}
              >
                {getIcon(item)}
                {sidebarOpen && <span style={{ marginLeft: "10px" }}>{item}</span>}
              </li>
            ))}
          </ul>
        </div>

        <div className="main-content">
          <h1>{activeContent}</h1>
          {activeContent === "Dashboard" && (
            <div className="marquee-wrapper">
              <marquee behavior="scroll" direction="left" className="marquee">
                📢 Welcome to Sales's Dashboard! Stay updated with the latest information here.
              </marquee>
            </div>
          )}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
