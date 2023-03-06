import React, { ReactNode } from 'react';
import { Modal } from 'antd';

const ClientModalComponent = ({
  title,
  modalShow,
  closable = true,
  okText = 'YES',
  cancelText = 'CANCEL',
  handleOk,
  handleCancel,
  children
}: {
  title: string;
  modalShow: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  children?: ReactNode;
  closable?: boolean;
  okText?: string;
  cancelText?: string;
}) => (
  <Modal
    title={title}
    open={modalShow}
    closable={closable}
    okText={okText}
    cancelText={cancelText}
    onOk={handleOk}
    onCancel={handleCancel}
    centered
  >
    {children}
  </Modal>
);

export default ClientModalComponent;
