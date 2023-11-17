import React, { ReactNode } from 'react';
import { Modal } from 'antd';

const PopupEditer = ({
  open,
  children,
  setShowEditer,
}: {
  open: boolean;
  children: ReactNode;
  setShowEditer: (status: boolean) => void;
}) => (
  <Modal
    open={open}
    title=""
    centered
    closable={false}
    footer={null}
    destroyOnClose
    getContainer={false}
    onCancel={() => setShowEditer(false)}
  >
    {children}
  </Modal>
);

export default PopupEditer;
