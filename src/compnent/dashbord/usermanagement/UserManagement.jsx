import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, notification, Spin, Switch } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchUsersQuery, useUpdateUserMutation, useDeleteUserMutation, useAddUserMutation } from '../../api/Getalluserapi';
import { totaluser } from '../../../features/loginSlice';

const UserManagement = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Use RTK Query hooks
  const { data, error, isLoading, refetch } = useFetchUsersQuery(currentPage);
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [addNewUser] = useAddUserMutation();

  const users = data?.data?.data || [];
  const totalUsers = data?.data?.total || 0;
  dispatch(totaluser(totalUsers));

  // Update user
  const handleEdit = (user) => {
    setEditingUser(user);
    setIsUpdateModalVisible(true);
    form.setFieldsValue({ name: user.name, email: user.email, role: user.role });
  };

  // Delete user
  const handleDelete = async (id) => {
    try {
      await deleteUser(id).unwrap();
      notification.success({ message: 'User Deleted', description: `User ID ${id} has been deleted.` });
      refetch();
    } catch (error) {
      notification.error({ message: 'Error', description: 'Failed to delete user.' });
    }
  };

  // Handle add user
  const handleAddUser = async (values) => {
    try {
      await addNewUser(values).unwrap();
      notification.success({
        message: 'User Added',
        description: `User ${values.name} has been added successfully.`,
      });
      setIsModalVisible(false);
      form.resetFields(); // Reset fields after adding a user
      refetch(); // Optionally refetch to get the latest users
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error?.data?.message || 'Failed to add user.',
      });
    }
  };

  // Form submission handler for updating user
  const handleUpdateForm = async (values) => {
    const updatedData = {
      name: values.name,
      email: values.email,
      role: values.role,
      is_active: values.is_active !== undefined ? values.is_active : true,
    };

    try {
      await updateUser({ id: editingUser.id, data: updatedData }).unwrap();
      notification.success({
        message: 'User Updated',
        description: `User ${values.name} has been updated successfully.`,
      });
      setIsUpdateModalVisible(false); // Close the update modal
      setEditingUser(null); // Reset the editing user
      form.resetFields(); // Reset form fields after update
      refetch();
    } catch (error) {
      notification.error({ message: 'Error', description: 'Failed to update user.' });
    }
  };

  // Handle table pagination
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  if (isLoading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <div>Error loading users</div>;
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <div>
          <Button type="primary" onClick={() => handleEdit(record)}>Edit</Button>
          <Button className="bg-red-600 text-white" type="danger" onClick={() => handleDelete(record.id)} style={{ marginLeft: '10px' }}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-[80%] mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">User List</h2>

      <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: '20px' }}>
        Add User
      </Button>

      <Table
        columns={columns}
        dataSource={users} // Use users directly for the table data
        rowKey={(record) => record.id}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalUsers,
          onChange: handleTableChange,
        }}
      />

      {/* Update Modal */}
      <Modal title="Edit User" open={isUpdateModalVisible} onCancel={() => setIsUpdateModalVisible(false)} footer={null}>
        {editingUser && (
          <Form form={form} onFinish={handleUpdateForm}>
            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input name!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input email!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Please input role!' }]}>
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Update</Button>
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* Add User Modal */}
      <Modal
        title="Add User"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={500}
        bodyStyle={{ padding: '20px' }}
        centered
      >
        <Form form={form} onFinish={handleAddUser} layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input email!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Please input role!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input password!' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item label="Is Active" name="is_active" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Add
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
