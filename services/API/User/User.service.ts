import { RequestClientClass } from '../../../utils/requestClient';
import API from '../../../constants/API';
import {
  LoginPayloadType,
  VerifyUserPayload,
  VerificationCodePayload,
  RegisterAccountPayload,
  ForgotPasswordResetPayload,
} from '../../../slice/user.slice';

const requestClient = () =>
  new RequestClientClass(process.env.NEXT_PUBLIC_API_SERVER);

const doLogin = async (payload: LoginPayloadType) => {
  const uri = API.login.post;
  const response = await requestClient()
    .setUri(uri)
    .setPayload(payload)
    .doPost();
  return response;
};

const doForgotPasswordSendVerificationCode = async (payload: {
  email: string;
}) => {
  const uri = API.forgotPassword.delete;
  const response = await requestClient()
    .setUri(uri)
    .setPayload(payload)
    .doDelete();
  return response;
};

const doForgotPasswordReset = async (payload: ForgotPasswordResetPayload) => {
  const uri = API.forgotPassword.put;
  const response = await requestClient()
    .setUri(uri)
    .setPayload(payload)
    .doPut();
  return response;
};

const doRegisterAccount = async (payload: RegisterAccountPayload) => {
  const uri = API.registerAccount.post;
  const response = await requestClient()
    .setUri(uri)
    .setPayload(payload)
    .doPost();
  return response;
};

const doLogout = async () => {
  const uri = API.logout.delete;
  const response = await requestClient()
    .setUri(uri)
    .setAuthorizationStatus()
    .doDelete();
  return response;
};

const doVerifyUser = async (payload: VerifyUserPayload) => {
  const uri = API.verifyUser.post;
  const response = await requestClient()
    .setUri(uri)
    .setPayload(payload)
    .doPost();
  return response;
};

const doVerificationCode = async (payload: VerificationCodePayload) => {
  const uri = API.verificationCode.post;
  const response = await requestClient()
    .setUri(uri)
    .setPayload(payload)
    .doPost();
  return response;
};

const checkApiMaintenance = async () => {
  const uri = API.apiMaintenance.get;
  const response = await requestClient().setUri(uri).doGet();
  return response;
};

const getUserGender = async () => {
  const uri = API.getUserGender.get;
  const response = await requestClient().setUri(uri).doGet();
  return response;
};

const doScannerLogin = async (payload: any) => {
  const uri = API.scannerLogin.post;
  const response = await requestClient()
    .setUri(uri)
    .setPayload(payload)
    .doPost();
  return response;
};

export default {
  doLogin,
  doLogout,
  doVerifyUser,
  doVerificationCode,
  checkApiMaintenance,
  doRegisterAccount,
  getUserGender,
  doForgotPasswordReset,
  doForgotPasswordSendVerificationCode,
  doScannerLogin,
};
