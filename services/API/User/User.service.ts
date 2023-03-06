import { RequestClientClass } from '../../../utils/requestClient';
import API from '../../../constants/API';
import { LoginPayloadType, VerifyUserPayload, VerificationCodePayload } from '../../../slice/login.slice';

const requestClient = () => new RequestClientClass(process.env.NEXT_PUBLIC_API_SERVER);

const doLogin = async (payload: LoginPayloadType) => {
  const uri = API.login.post;
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
  const response = await requestClient()
    .setUri(uri)
    .doGet();
  return response;
};

export default {
  doLogin,
  doLogout,
  doVerifyUser,
  doVerificationCode,
  checkApiMaintenance,
};
