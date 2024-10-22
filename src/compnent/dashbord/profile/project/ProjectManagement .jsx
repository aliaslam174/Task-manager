import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, notification, Spin, Select } from 'antd';
import { useFetchProjectsQuery, useCreateProjectMutation, useUpdateProjectMutation, useDeleteProjectMutation, useAssignProjectMutation } from '../../../api/projectApi';
import { useFetchUsersQuery } from '../../../api/Getalluserapi';

const ProjectManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [assigningProject, setAssigningProject] = useState(null)
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  const [userPage, setUserPage] = useState(1)
  const [form] = Form.useForm();
  const [assignForm] = Form.useForm(); // Form for assigning project
  const [allUsers, setAllUsers] = useState([])
  // RTK Query hooks
  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();
  console.log(userPage)

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data, error, isLoading, refetch } = useFetchProjectsQuery(currentPage); // Pass pagination parameters
  const { data: usersData } = useFetchUsersQuery(userPage); // Fetch users for the assignment
  const [searchTerm, setSearchTerm] = useState('')
  const projects = data?.data?.data || [];
  const totalProjects = data?.data?.total || 0; // Total number of projects
  const users = usersData?.data?.data || []; // Assuming API returns users arrays
  console.log(usersData)
  console.log(users)
  // Open modal for creating or updating project
  const openModal = (project = null) => {
    setEditingProject(project);
    setIsModalVisible(true);
    form.setFieldsValue({
      name: project?.name || '',
      description: project?.description || '',
    });
  };

  // Handle create or update project
  const handleCreateOrUpdate = async (values) => {
    try {
      if (editingProject) {

        const updatedData = {
          name: values.name,
          description: values.description,

          is_active: values.is_active !== undefined ? values.is_active : true, // default to true if not provided
        };
        await updateProject({ id: editingProject.id, data: updatedData }).unwrap();
        notification.success({ message: 'Project updated successfully!' });
      } else {
        await createProject(values).unwrap();
        notification.success({ message: 'Project created successfully!' });
      }
      setIsModalVisible(false);
      refetch();
      form.resetFields();
    } catch (error) {
      notification.error({ message: 'Error', description: 'Failed to save project.' });
    }
  };

  // Handle delete project
  const handleDelete = async (id) => {
    try {
      await deleteProject(id).unwrap();
      notification.success({ message: 'Project deleted successfully!' });
      refetch();
    } catch (error) {
      notification.error({ message: 'Error', description: 'Failed to delete project.' });
    }
  };
  // Open modal for assigning project to a user
  const openAssignModal = (project) => {
    setAssigningProject(project); // Set the project being assigned
    setIsAssignModalVisible(true); // Open assign modal
    assignForm.resetFields(); // Reset form fields
  };
  // Fetch more users when the user scrolls to the bottom of the user dropdown

  useEffect(() => {
    if (usersData && usersData.data) {
      setAllUsers((prevUsers) => [...prevUsers, ...usersData.data.data]); // Append new users to existing list
      setIsFetchingUsers(false); // Set fetching state to false after loading
    }
  }, [usersData]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop === clientHeight && !isFetchingUsers) {
      setIsFetchingUsers(true);
      setUserPage((prevPage) => prevPage + 1); // Increment user page to fetch next set
    }
  };

 // Handle user search input
 const handleSearch = (value) => {
  setSearchTerm(value); // Update search term
  setAllUsers([]); // Reset the user list
  setUserPage(1); // Reset the page number
  refetchUsers(); // Refetch users based on search term
};


  // Handle project assignment to a user
  const handleAssignProject = async (values) => {
    try {
      const { userId } = values;
      await useAssignProjectMutation({ projectId: assigningProject.id, userId }).unwrap(); // Assign project
      notification.success({ message: 'Project assigned successfully!' });
      setIsAssignModalVisible(false);
      refetch(); // Refetch projects after assignment
      assignForm.resetFields();
    } catch (error) {
      notification.error({ message: 'Error', description: 'Failed to assign project.' });
    }
  };

  // Handle table pagination
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination); // Update current page
    setPageSize(pagination.pageSize); // Update page size
  };

  if (isLoading) return <Spin size="large" />;

  if (error) return <div>Error loading projects</div>;

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button type="primary" onClick={() => openModal(record)}>Edit</Button>
          <Button type="danger" onClick={() => handleDelete(record.id)} style={{ marginLeft: '10px' }}>Delete</Button>
          <Button type="default" onClick={() => openAssignModal(record)} style={{ marginLeft: '10px' }}>Assign</Button> {/* Button to open assign modal */}
        </>
      ),
    },
  ];

  return (
    <div className="w-[80%] mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">Project Management</h2>
      <Button type="primary" onClick={() => openModal(null)} style={{ marginBottom: '20px' }}>Create Project</Button>
      <Table
        columns={columns}
        dataSource={projects}
        rowKey={(record) => record.id}
        pagination={{
          current: currentPage, // Current page
          pageSize: pageSize, // Page size
          total: totalProjects, // Total number of projects
          onChange: handleTableChange, // Handle page change
        }}
      />

      <Modal
        title={editingProject ? 'Edit Project' : 'Create Project'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateOrUpdate}>
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input project name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Save</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Assign Project"
        open={isAssignModalVisible}
        onCancel={() => setIsAssignModalVisible(false)}
        footer={null}
      >
        <Form form={assignForm} onFinish={handleAssignProject}>
          <Form.Item
            label="Assign to User"
            name="userId"
            rules={[{ required: true, message: 'Please select a user!' }]}
          >
            <Select placeholder="Select a user" mode="multiple"
              onSearch={handleSearch} // Handle search input
              onPopupScroll={handleScroll} allowClear >
              {users.map(user => (
                console.log(user),
                <Option key={user.id} value={user.id}>
                  {user.name} {/* Assuming user has a 'username' field */}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Assign</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectManagement;
