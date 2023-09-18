import { RequestClientClass } from '../../../utils/requestClient';
import API from '../../../constants/API';

const requestClient = () =>
  new RequestClientClass(process.env.NEXT_PUBLIC_API_SERVER);

const joinRave = async (payload: string) => {
  const uri = API.joinRave.post.replace('{eventId}', payload);
  const response = await requestClient()
    .setUri(uri)
    .setAuthorizationStatus()
    .doPost();
  return response;
};

const getRave = async (payload: string) => {
  const uri = API.getRave.get.replace('{eventId}', payload);
  const response = await requestClient()
    .setUri(uri)
    .setAuthorizationStatus()
    .doGet();
  return response;
};

export default {
  joinRave,
  getRave,
};
