import React, { ReactNode } from 'react';
import { Modal, Button } from 'antd';

const ClientModalComponent = ({
  title,
  modalShow,
  closable = true,
  maskClosable = false,
  okText = 'YES',
  cancelText = 'CANCEL',
  footer,
  handleOk,
  handleCancel,
  children,
}: {
  title: string;
  modalShow: boolean;
  handleOk?: () => void;
  handleCancel?: () => void;
  footer?: ReactNode[];
  children?: ReactNode;
  closable?: boolean;
  maskClosable?: boolean;
  okText?: string;
  cancelText?: string;
}) => (
  <Modal
    title={title}
    open={modalShow}
    closable={closable}
    maskClosable={maskClosable}
    okText={okText}
    cancelText={cancelText}
    onOk={handleOk}
    onCancel={handleCancel}
    centered
    footer={
      footer || [
        <Button key={cancelText} onClick={handleCancel}>
          {cancelText}
        </Button>,
        <Button key={okText} type="primary" onClick={handleOk}>
          {okText}
        </Button>,
      ]
    }
  >
    {children}
  </Modal>
);

export default ClientModalComponent;
