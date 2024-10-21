import React from 'react';
import { Table, Spin } from 'antd';
import { useFetchProjectsQuery } from '../../api/projectApi';

const AssignedProjects = ({ userId }) => {
  // Fetch assigned projects
  const { data, error, isLoading } = useFetchProjectsQuery(); // Filtered server-side

  const projects = data?.data?.filter(project => project.assigned_user === userId) || [];

  if (isLoading) return <Spin size="large" />;

  if (error) return <div>Error loading assigned projects</div>;

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
  ];

  return (
    <div>
      <h2>Your Assigned Projects</h2>
      <Table columns={columns} dataSource={projects} rowKey={(record) => record.id} />
    </div>
  );
};

export default AssignedProjects;
