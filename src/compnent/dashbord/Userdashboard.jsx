import React from 'react'
import { persistor } from '../../store';
import { logout } from '../../features/Loginslice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
function Userdashboard() {
    const dispatch = useDispatch();  // Hook must be at the top level
    const navigate = useNavigate();
    const handleLogout =async () => {
    
    
  
        try {
          // Step 1: Purge persisted state
          await persistor.purge();
          console.log("Persisted state cleared!");
    
          // Step 2: Dispatch logout action to update Redux state
          dispatch(logout());
    
          // Step 3: Redirect to login page
          notification.success({
            message: 'Logout Successful',
            description: 'Welcome back! You are now logged in.',
            placement: 'topRight',
            duration: 1,  // Auto-close after 3 seconds
          });
         
            navigate('/login');
     
           
        
        } catch (error) {
          console.error("Error purging persisted state:", error);
        }
    
      };
  return (
    <div>
      <h1>User Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Userdashboard