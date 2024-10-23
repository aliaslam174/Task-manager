// ReusableModal.js
import React from 'react';
import { Modal, Button } from 'antd';

const ReusableModal = ({ isVisible, onClose, modalContent, title }) => {
  return (
    <Modal
      title={title}
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      {modalContent}
    </Modal>
  );
};

export default ReusableModal;
