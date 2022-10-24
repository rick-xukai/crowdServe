import styled from 'styled-components';
import { Colors } from '../theme';

const ScanQrCodePageContainers = styled.div`
  height: 100%;
  width: 100%;
  background: ${Colors.backgorund};
  min-height: 100vh;
  .scan-back {
    position: absolute;
    top: 30px;
    left: 20px;
    font-size: 13px;
    color: ${Colors.grayScale10};
    z-index: 1;
    font-weight: 400;
  }
  .scan-container {
    margin: 0;
    position: absolute;
    width: 100%;
    text-align: center;
    top: 50%;
    transform: translate(0, -50%);
    z-index: 1;
  }
  .qr-reader {
    height: 100%;
    width: 100%;
    position: fixed;
    div {
      height: 100%;
      padding-top: 0 !important;
    }
    video {
      position: unset !important;
      object-fit:fill;
    }
  }
  .scan-result {
    min-height: 100vh;
    .result-detail {
      min-height: 100vh;
      padding: 20px;
      display: flex;
      align-items: center;
    }
    .result-logo {
      text-align: center;
      margin-bottom: 15px;
      img {
        width: 142px !important;
        height: 73px !important;
      }
    }
    .border-box {
      background: linear-gradient(180deg, ${Colors.grayScale80} -7.43%, rgba(213, 213, 213, 0) 100.99%);
      padding: 0.5px;
      border-radius: 2px;
      position: relative;
      .action-button,
      .button-text {
        position: absolute;
        bottom: -55px;
        width: 100%;
        text-align: center;
      }
      .action-button {
        img {
          width: 103px !important;
          height: 103px !important;
        }
        .button-text {
          top: 22px;
          font-size: 18px;
          color: ${Colors.white};
          font-weight: 700;
        }
      }
    }
    .result-container {
      padding-bottom: 94px !important;
      width: 100%;
      background: linear-gradient(180deg,rgba(39, 39, 42, 0.8) 0%,rgba(39, 39, 42, 0.8) 35.94%,rgba(39, 39, 42, 0.9) 100%);
      box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.25);
      backdrop-filter: blur(5px);
      border-radius: 2px;
      padding: 26px 20px;
    }
    .result-items {
      .items-title {
        font-size: 13px;
        color: ${Colors.grayScale40};
        margin-top: 0;
        margin-bottom: 0;
        font-weight: 300;
      }
      .items-value {
        font-size: 17px;
        color: ${Colors.white};
        margin-top: 5px;
        margin-bottom: 20px;
        word-wrap:break-word;
        font-weight: 400;
      }
      &.display-flex {
        display: flex;
        justify-content: space-between;
      }
    }
  }
  .scan-start {
    padding: 20px;
    width: 100%;
    position: fixed;
    height: 100%;
    background-image: url('../static/images/background.png');
    background-position: center;
	  background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    .scan-start-mask {
      width: 100%;
      height: 100%;
      top: 0;
      position: absolute;
      left: 0;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0.58) 0%, rgba(0, 0, 0, 0.7) 100%);
      z-index: -1;
    }
    p {
      text-align: center;
      margin-top: 0px;
      margin-bottom: 130px;
    }
    .scan-start-container {
      width: 100%;
    }
  }
  button {
    font-family: Heebo;
    border: none;
    width: 100%;
    height: 50px;
    box-shadow: 0px 2px 2px rgb(0 0 0 / 12%);
    background: ${Colors.branding};
    border-radius: 2px;
    font-weight: 700;
    font-size: 15px;
    color: ${Colors.grayScale10};
  }
  .verify-container {
    padding: 20px;
    width: 100%;
    position: fixed;
    height: 100%;
    display: flex;
    align-items: center;
    .verify-message {
      font-weight: 700;
      font-size: 22px;
      color: ${Colors.white};
      text-align: center;
      margin-top: 20px;
      margin-bottom: 69px;
    }
    .back-home {
      border: 1px solid #fff;
      background: unset;
      margin-top: 15px;
    }
  }
`;

export { ScanQrCodePageContainers };
