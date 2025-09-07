import React, { useEffect, useState } from 'react';
import { RefreshCcw, CheckCircle, XCircle, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './admin.css';

const App = () => {

  // Admin page states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const nav = useNavigate();

  const getBookingData = async () => {
    try {
      const response = await fetch('https://hkgk-temple-server.onrender.com/trackAll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const result = await response.json();

      if (result.success) {
        setBookings(result.records);
        console.log(result.records)
      } else {
        setError(result.error || "Failed to fetch booking records.");
      }
    } catch (e) {
      console.error("Fetch error:", e);
      setError("Failed to connect to the server. Is it running on port 3001?");
    } finally {
      setLoading(false);
    }

  }

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn'); 
    if(!isLoggedIn) {
      nav("/");
    }

  }, []);

  useEffect(() => {
    getBookingData();
  }, [])


  const fetchBookings = async () => {
    if (!phoneNumber) {
      getBookingData();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://hkgk-temple-server.onrender.com/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phoneNumber })
      });
      const result = await response.json();

      if (result.success) {
        setBookings(result.records);
        console.log(result.records)
      } else {
        setError(result.error || "Failed to fetch booking records.");
      }
    } catch (e) {
      console.error("Fetch error:", e);
      setError("Failed to connect to the server. Is it running on port 3001?");
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (_id, newStatus) => {
    try {
      setLoading(true);
      const response = await fetch('https://hkgk-temple-server.onrender.com/updateBookingStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: _id, status: newStatus })
      });
      const result = await response.json();

      if (result.success) {
        // Update bookings state locally to reflect only the changed booking
        setBookings(prev => prev.map(booking =>
          booking._id === _id
            ? { ...booking, status: newStatus }
            : booking
        ));
      } else {
        setError(result.error || "Failed to update booking status.");
      }
    } catch (e) {
      console.error("Update error:", e);
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  console.log(bookings)

  // Render admin dashboard if logged in
  return (
    <div className="admin-page-container">
      <header className="admin-header">
        <h1 className="admin-title">Admin Dashboard</h1>
      </header>

      <main>
        <div className="search-container">
          <input
            type="text"
            placeholder="Enter phone number to search..."
            value={phoneNumber}
            onChange={(e) => {
              if (e.target.value === '')
                getBookingData();
              setPhoneNumber(e.target.value)
            }
            }
            className="search-input"
          />
          <button
            onClick={fetchBookings}
            className="search-button"
            disabled={loading}
          >
            {loading ? (
              <RefreshCcw className="icon loading-icon" />
            ) : (
              <Search className="icon" />
            )}
            Search
          </button>
        </div>

        {error && (
          <div className="error-message">
            <p className="error-title">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {bookings.length > 0 ? (
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Guide</th>
                <th>Dates</th>
                <th>Check-in</th>
                <th>Purpose</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, idx) => (
                <tr key={idx}>
                  <td data-label="Name">{booking.name}</td>
                  <td data-label="Phone">{booking.phoneNumber}</td>
                  <td data-label="Guide">{booking.folkGuidName || 'N/A'}</td>
                  <td data-label="Dates">{new Date(booking.fromDate).toDateString()} to {new Date(booking.toDate).toDateString()}</td>
                  <td data-label="Check-in">{booking.checkinTime}</td>
                  <td data-label="Purpose">{booking.purpose}</td>
                  <td data-label="Actions">
                    {booking.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => updateBookingStatus(booking._id, 'approved')}
                          className="approve-button"
                          disabled={loading}
                        >
                          <CheckCircle className="icon" /> Approve
                        </button>
                        <button
                          onClick={() => updateBookingStatus(booking._id, 'denied')}
                          className="deny-button"
                          disabled={loading}
                        >
                          <XCircle className="icon" /> Deny
                        </button>
                      </>
                    ) : booking.status === 'approved' ? (
                      <span className="status-approved">
                        <CheckCircle className="icon" /> Approved
                      </span>
                    ) : booking.status === 'denied' ? (
                      <span className="status-denied">
                        <XCircle className="icon" /> Denied
                      </span>
                    ) : null}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-records">
            <h3 className="no-records-title">No Booking Records</h3>
            <p className="no-records-text">Enter a phone number to search for bookings.</p>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
