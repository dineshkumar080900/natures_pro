import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FooterDetails from '../Componests/UserPageComponet.jsx/Foooter/Foooterdesign';
import UnifiedNavbar from '../Componests/Navebar/Navbardesignhomepage';

export default function MyWishlist() {
  // State variables to handle watchlist data, loading, and errors
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get userId from localStorage (this assumes the userId is stored in localStorage)
  const userId = localStorage.getItem('userId'); // Assuming userId is stored as 'userId'

  // If no userId is found in localStorage, you can handle it accordingly (e.g., show an error or redirect)
  if (!userId) {
    return (
      <div>
        <p>Error: User is not logged in. Please log in to view your wishlist.</p>
      </div>
    );
  }

  // Fetch watchlist when the component mounts or userId changes
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        // Make API request to fetch watchlist, passing the userId as a query parameter
        const response = await axios.get(`/getwatchlist?userId=${userId}`);

        // Check if response data and watchlistItems exist before setting state
        if (response.data && Array.isArray(response.data.watchlistItems)) {
          setWatchlist(response.data.watchlistItems);
        } else {
          setWatchlist([]); // Ensure that watchlist is set to an empty array if no items are found
        }
      } catch (err) {
        setError('Failed to fetch watchlist');
      } finally {
        setLoading(false); // Stop loading after the request completes
      }
    };

    fetchWatchlist(); // Trigger the fetch request
  }, [userId]); // Dependency array ensures fetch happens when userId changes

  // Render the component UI based on loading, error, or success
  return (
    <>
      <UnifiedNavbar />

      <div className="container mt-5">
        {/* Display loading indicator if data is still being fetched */}
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          // Display error message if fetching failed
          <div className="alert alert-danger">{error}</div>
        ) : watchlist.length === 0 ? (
          // Display message if the watchlist is empty
          <div>No products in your wishlist.</div>
        ) : (
          // Display the list of products in the watchlist
          <div>
            <h3>Your Wishlist</h3>
            <div className="list-group">
              {watchlist.map((item) => (
                <div key={item.productId} className="list-group-item">
                  <div className="d-flex justify-content-between">
                    <span>{item.name}</span>
                    <span>${item.price}</span>
                  </div>
                  <div>{item.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-dark">
        <FooterDetails />
      </div>
    </>
  );
}