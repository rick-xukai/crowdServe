import { RequestClientClass } from '../../../utils/requestClient';
import API from '../../../constants/API';

import { UpdateProfileProps } from '@/slice/profile.slice';

const requestClient = () =>
  new RequestClientClass(process.env.NEXT_PUBLIC_API_SERVER);

const getLoginUserDetail = async () => {
  const uri = API.getLoginUserDetail.get;
  const response = await requestClient()
    .setUri(uri)
    .setAuthorizationStatus()
    .doGet();
  return response;
};

const updateLoginUserDetail = async (payload: FormData) => {
  const uri = API.updateLoginUserDetail.put;
  const response = await requestClient()
    .setUri(uri)
    .setAuthorizationStatus()
    .setPayload(payload)
    .doPut();
  return response;
};

export default {
  getLoginUserDetail,
  updateLoginUserDetail,
};
