// src/App.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './index.css';
import { fetchErrors } from './redux/errorAction'; // Adjust this import based on your file structure
import ErrorManagement from './components/Error/Eror.jsx';
function App() {
  const [isBlack, setIsBlack] = useState(true); // State to manage background color
  const [page, setPage] = useState(1)
  const dispatch = useDispatch();
  const errors = useSelector(state => state.errors); // Adjust based on your Redux state structure
  useEffect(() => {
    dispatch(fetchErrors(page)); // Fetch errors on component mount
  }, [dispatch, page]);

  const toggleBackgroundColor = () => {
    setIsBlack(!isBlack); // Toggle between black and white
  };
 
  const nextPage = () => {
    setPage(prevPage => {
      if(errors.length > 0)
      return prevPage + 1; //   Increment page number and return the new state
      else 
      return prevPage
    });
  };
  
  const prevPage = () => {
    setPage(prevPage => {
      return prevPage > 1 ? prevPage - 1 : prevPage; // Decrement page number and return the new state, ensuring it doesn’t go below 1
    });
  };
  

  return (
    <div className={`relative ${isBlack ? 'bg-black text-white' : 'bg-white text-black'} min-h-screen`}>
      {/* Toggle button */}
      <button 
        onClick={toggleBackgroundColor} 
        className="absolute top-4 right-4 p-2 border rounded shadow-md hover:bg-gray-200 dark:hover:bg-gray-800">
        Mode
      </button>
      <button 
        onClick={nextPage}
        className="absolute bottom-4 right-4 p-2 border rounded shadow-md hover:bg-gray-200 dark:hover:bg-gray-800">
        Next {`(${page})`}
      </button>
      <button 
        onClick={prevPage}
        className="absolute bottom-4 right-17 p-2 border rounded shadow-md hover:bg-gray-200 dark:hover:bg-gray-800">
         Prev {`(${page})`}
      </button>
      <ErrorManagement />
    </div>
  );
}

export default App;
