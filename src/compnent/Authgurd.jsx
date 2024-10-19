
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';


const Authgurd = ({ children }) => {

  const { token } = useSelector((state) => state.auth); // Redux state for authentication
console.log(token)
  // If not authenticated, redirect to login page
 
 
  if(!token) {
    return <Navigate to='/login' replace />
}
return children
 
    
  


  
};

export default Authgurd;
