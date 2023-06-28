import React from 'react';
import { Drawer, Modal } from 'antd';
import Image from 'next/image';

import { Images } from '../theme';

const ShowQRCodeElementComponent = ({
  showDrawer,
  showModal,
  children,
  setShowDrawer,
  setShowModal,
}: {
  showDrawer: boolean;
  showModal: boolean;
  children?: React.ReactElement;
  setShowDrawer: (status: boolean) => void;
  setShowModal: (status: boolean) => void;
}) => (
  <>
    <Drawer
      placement="bottom"
      open={showDrawer}
      closable={false}
      keyboard={false}
      destroyOnClose
      onClose={() => setShowDrawer(false)}
    >
      {children}
    </Drawer>
    <Modal
      title=""
      centered
      closable={false}
      footer={null}
      open={showModal}
      className="qrCodeModal"
      destroyOnClose
      onCancel={() => setShowModal(false)}
    >
      {children}
      <div className="close-modal">
        <Image
          src={Images.CloseIcon}
          alt=""
          onClick={() => setShowModal(false)}
        />
      </div>
    </Modal>
  </>
);

export default ShowQRCodeElementComponent;
