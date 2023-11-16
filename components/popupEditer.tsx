import React, { ReactNode } from 'react';
import { Modal } from 'antd';

const PopupEditer = ({
  open,
  children,
}: {
  open: boolean;
  children: ReactNode;
}) => (
  <Modal
    open={open}
    title=""
    centered
    closable={false}
    footer={null}
    destroyOnClose
    getContainer={false}
  >
    {children}
  </Modal>
);

export default PopupEditer;
