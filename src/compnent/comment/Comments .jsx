import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { notification, Modal, Form, Input, Button, List, Spin } from 'antd';

import { EditOutlined, DeleteOutlined, MessageOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

const Comments = ({ tasskid, selectedProjectId }) => {
    const id = tasskid.split('-')[1]; // Extract task ID from tasskid
    const [comments, setComments] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const { token } = useSelector((state) => state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentCommentId, setCurrentCommentId] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null); // State for replying to a comment

    const fetchComments = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://task-manager.codionslab.com/api/v1/project/${selectedProjectId.id}/task/${id}/comment`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setComments(response.data.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
            notification.error({ message: 'Failed to fetch comments!' });
        } finally {
            setLoading(false);
        }
    };

    const addComment = async (values) => {
        // Adjust the API call for adding a comment
        try {
            await axios.post(`https://task-manager.codionslab.com/api/v1/project/${selectedProjectId.id}/task/${id}/comment`, {
                content: values.content,
                parent_id: replyingTo, // Pass parent_id for replies
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            notification.success({ message: 'Comment added successfully!' });
            form.resetFields();
            setIsModalVisible(false);
            setReplyingTo(null);
            fetchComments();
        } catch (error) {
            console.error('Error adding comment:', error);
            notification.error({ message: 'Failed to add comment!' });
        }
    };

    const deleteComment = async (commentId) => {
        try {
            await axios.delete(`https://task-manager.codionslab.com/api/v1/project/${selectedProjectId.id}/task/${id}/comment/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            notification.success({ message: 'Comment deleted successfully!' });
            fetchComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
            notification.error({ message: 'Failed to delete comment!' });
        }
    };

    const editComment = async (values) => {
        try {
            await axios.put(`https://task-manager.codionslab.com/api/v1/project/${selectedProjectId.id}/task/${id}/comment/${currentCommentId}`, {
                content: values.content,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            notification.success({ message: 'Comment updated successfully!' });
            form.resetFields();
            setIsModalVisible(false);
            fetchComments();
        } catch (error) {
            notification.error({ message: 'Failed to update comment!' });
        }
    };

    const openModal = (comment) => {
        if (comment) {
            setCurrentCommentId(comment.id);
            form.setFieldsValue({ content: comment.content });
            setIsEditing(true);
        } else {
            setCurrentCommentId(null);
            form.resetFields();
            setIsEditing(false);
        }
        setIsModalVisible(true);
    };

    const openReplyModal = (commentId) => {
        setReplyingTo(commentId);
        form.resetFields();
        setIsEditing(false);
        setIsModalVisible(true);
    };

    useEffect(() => {
        fetchComments();
    }, [id, selectedProjectId.id]);

    return (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', maxWidth: '800px', margin: 'auto' }}>
            <Button type="primary" onClick={() => openModal(null)} style={{ marginBottom: '16px' }}>
                Add Comment
            </Button>
            
            <Modal
                title={isEditing ? "Edit Comment" : "Add Comment"}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={isEditing ? editComment : addComment}>
                    <Form.Item
                        name="content"
                        rules={[{ required: true, message: 'Please input your comment!' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            
            <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Comments</h3>
            {loading ? (
                <Spin tip="Loading comments..." />
            ) : (
                <List
                    bordered
                    dataSource={comments}
                    renderItem={comment => (
                        <List.Item key={comment.id} style={{ marginBottom: '16px', borderRadius: '8px', backgroundColor: '#fff', padding: '16px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' ,flexDirection:"column"}}>
                            <div  className='flex items-center w-full justify-between'>
                                <p style={{ margin: 0, fontWeight: '600' }}>{comment.content}</p>
                                <div className='flex items-center' style={{ marginTop: '8px' }}>
                                    <Button type="link" icon={<EditOutlined />} onClick={() => openModal(comment)}>Edit</Button>
                                    <Button type="link" icon={<MessageOutlined />} onClick={() => openReplyModal(comment.id)}>Reply</Button>
                                    <Button type="link" danger icon={<DeleteOutlined />} onClick={() => deleteComment(comment.id)}>Delete</Button>
                                </div>
                            </div>
    
                            {/* Replies Section */}
                            {comment.replies && comment.replies.length > 0 && (
                                <div style={{ marginTop: '16px', paddingLeft: '20px', borderLeft: '2px solid #f0f0f0',width:"100%" }}>
                                    <h4 style={{ fontWeight: 'bold' }}>Replies</h4>
                                    <List
                                        dataSource={comment.replies}
                                        renderItem={reply => (
                                            <List.Item key={reply.id} style={{ padding: '10px 20px', backgroundColor: '#f9f9f9', margin: '8px 0', borderRadius: '4px' }}>
                                                <div className='w-full'  style={{flexDirection:"col",display:"flex",justifyContent:"space-between",alignItems:"center" ,}}>
                                                    <p style={{ margin: 0 }}>{reply.content}</p>
                                                    <div style={{ marginTop: '8px' }}>
                                                        <Button type="link" icon={<EditOutlined />} onClick={() => openModal(reply)}>Edit</Button>
                                                        <Button type="link" danger icon={<DeleteOutlined />} onClick={() => deleteComment(reply.id)}>Delete</Button>
                                                    </div>
                                                </div>
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            )}
                        </List.Item>
                    )}
                />
            )}
            
            {comments.length === 0 && !loading && (
                <p style={{ textAlign: 'center', color: '#888' }}>No comments available</p>
            )}
        </div>
    
    
    );
};

export default Comments;
