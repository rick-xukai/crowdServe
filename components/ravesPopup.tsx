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
}) => (
  <PopUpContainer
    open={open}
    destroyOnClose
    onCancel={onClose}
    footer={null}
    closable={false}
    centered
    width={540}
  >
    <div className="content">
      <div className="container">{children}</div>
      <PopUpClose src={Images.PopupCloseIcon.src} onClick={onClose} />
    </div>
  </PopUpContainer>
);

export default RavesPopUp;
