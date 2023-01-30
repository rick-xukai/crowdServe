import styled from 'styled-components';
import { Colors } from '../theme';

const LoginContainer = styled.div`
  height: 100%;
  background-color: rgb(243, 243, 251);
  padding: 16px;
  display: flex;
  background-image: url('../static/images/login-background.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  .login-form {
    margin: auto;
    .error-message {
      color: ${Colors.branding};
      margin-bottom: 20px;
      font-size: 14px;
      margin-top: -15px;
    }
    .form-title {
      margin-top: 0;
      margin-bottom: 24px;
      font-family: Oswald, sans-serif !important;
      font-weight: 700;
      font-size: 28px;
      color: ${Colors.white};
    }
    .form-input {
      margin-bottom: 20px;
      border-radius: 2px;
      input {
        width: 100%;
        height: 35px;
        border-radius: 2px;
        font-weight: 400;
        font-size: 15px;
        padding-left: 10px;
        border: none;
        background: ${Colors.white};
        color: ${Colors.black};
      }
      .ant-input-affix-wrapper {
        display: inline-flex;
        padding: 0 11px 0 0;
        width: 100%;
        height: 35px;
        background-color: #fff;
        border-radius: 2px;
        border: none;
        .ant-input-suffix {
          display: flex;
          align-items: center;
        }
      }
    }
    .form-checkbox {
      display: flex;
      margin-bottom: 16px;
      input {
        width: 18px;
        height: 18px;
      }
      input[type=checkbox] {
        accent-color: ${Colors.branding};
      }
      span {
        margin-top: 2px;
        padding-right: 8px;
        padding-left: 8px;
        color: ${Colors.white};
        font-weight: 400;
        font-size: 14px;
      }
    }
    button {
      width: 100%;
      height: 35px;
      font-weight: 400;
      font-size: 15px;
      border-radius: 2px;
      background: ${Colors.branding};
      border: none;
      color: ${Colors.white};
    }
    .error-message-invalid {
      color: ${Colors.branding};
      margin-bottom: 0px;
      font-size: 14px;
      text-align: center;
    }
    .input-password {
      position: relative;
      .password-icon {
        display: flex;
        top: 0;
        align-items: center;
        height: 100%;
        position: absolute;
        right: 5px;
        width: 20px;
        text-align: center;
      }
    }
  }
`;

export { LoginContainer };
