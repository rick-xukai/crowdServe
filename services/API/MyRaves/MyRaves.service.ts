import { RequestClientClass } from '../../../utils/requestClient';
import API from '../../../constants/API';

const requestClient = () =>
  new RequestClientClass(process.env.NEXT_PUBLIC_API_SERVER);

const getMyRaves = async (params: { page: number; size: number }) => {
  const uri = API.myRaves.get;
  const response = await requestClient()
    .setUri(uri)
    .setQueryParameter(params)
    .setAuthorizationStatus()
    .doGet();
  return response;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getMyRaves,
};
