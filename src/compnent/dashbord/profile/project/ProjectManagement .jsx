import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, notification, Spin, Select } from 'antd';
import { useFetchProjectsQuery, useCreateProjectMutation, useUpdateProjectMutation, useDeleteProjectMutation, useAssignProjectMutation } from '../../../api/projectApi';

const { Option } = Select;

const ProjectManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form] = Form.useForm();

  // RTK Query hooks
  const { data, error, isLoading, refetch } = useFetchProjectsQuery();
  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();
  const [assignProject] = useAssignProjectMutation();
console.log(data)
  const projects = data?.data?.data || [];

  // Open modal for creating or updating project
  const openModal = (project = null) => {
    setEditingProject(project);
    setIsModalVisible(true);
    form.setFieldsValue({
      name: project?.name || '',
      description: project?.description || '',
    });
  };

  const handleCreateOrUpdate = async (values) => {
    try {
      if (editingProject) {
        await updateProject({ id: editingProject.id, data: values }).unwrap();
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

  const handleDelete = async (id) => {
    try {
      await deleteProject(id).unwrap();
      notification.success({ message: 'Project deleted successfully!' });
      refetch();
    } catch (error) {
      notification.error({ message: 'Error', description: 'Failed to delete project.' });
    }
  };

  const handleAssignProject = async (projectId, userId) => {
    try {
      await assignProject({ projectId, userId }).unwrap();
      notification.success({ message: 'Project assigned successfully!' });
      refetch();
    } catch (error) {
      notification.error({ message: 'Error', description: 'Failed to assign project.' });
    }
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
        </>
      ),
    },
  ];

  return (
    <div className="w-[80%] mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">Project Management</h2>
      <Button type="primary" onClick={() => openModal(null)} style={{ marginBottom: '20px' }}>Create Project</Button>
      <Table columns={columns} dataSource={projects} rowKey={(record) => record.id} />
      
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
    </div>
  );
};

export default ProjectManagement;
