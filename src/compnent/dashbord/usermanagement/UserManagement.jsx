// src/components/UserManagement.js
import React from 'react';
import { useSelector } from 'react-redux';

const UserManagement = () => {

    const { isAuthenticated, loading, error,user } = useSelector((state) => state.auth);
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Email</th>
            <th className="py-2">Role</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        {/* <tbody>
          {user.map((user) => (
            <tr key={user.id}>
              <td className="py-2">{user.name}</td>
              <td className="py-2">{user.email}</td>
              <td className="py-2">{user.role}</td>
              <td className="py-2">
                <button className="bg-blue-500 text-white px-4 py-1 rounded">Edit</button>
                <button className="bg-red-500 text-white px-4 py-1 rounded ml-2">Delete</button>
              </td>
            </tr>
          ))}
        </tbody> */}
      </table>
      {/* Add form for adding new users */}
    </div>
  );
};

export default UserManagement;
