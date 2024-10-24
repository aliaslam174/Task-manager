import { useState, useEffect } from 'react';
import axios from 'axios';
import { notification } from 'antd';
import { useSelector } from 'react-redux';

const useProjects = (selectedProjectId) => {

    const {  token } = useSelector((state) => state.auth);
  const [Showproject, setShowproject] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://task-manager.codionslab.com/api/v1/project/${selectedProjectId.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      setShowproject(response.data); // Store projects in state
      setError(null);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError(error.message || 'Failed to fetch projects.');
      notification.error({ message: 'Error', description: error.message || 'Failed to fetch projects.' });
    } finally {
      setLoading(false);
    }
  };

  // Fetch projects on component mount or when token changes
  useEffect(() => {
    if (token) {
      fetchProjects();
    }
  }, [token]);

  return { Showproject, loading, error, refetchProjects: fetchProjects };
};

export default useProjects;
