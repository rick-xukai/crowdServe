import { useEffect } from "react";
import { PopUpClose, PopUpContainer } from "@/styles/raves.style";
import { Images } from "@/theme";

const RavesPopUp = ({
  children,
  onClose,
  open,
}: {
  children: React.ReactNode;
  onClose: () => void;
  open: boolean;
  }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  },[open]);
  return (
    <PopUpContainer
      open={open}
      destroyOnClose
      onCancel={onClose}
      footer={null}
      closable={false}
      centered
      width={540}
      getContainer={false}
      keyboard={false}
      maskClosable={false}
    >
      <div className='content'>
        <div className='container'>{children}</div>
        <PopUpClose src={Images.PopupCloseIcon.src} onClick={onClose} />
      </div>
    </PopUpContainer>
  );
};

export default RavesPopUp;
