import { RequestClientClass } from '../../../utils/requestClient';
import API from '../../../constants/API';

const requestClient = () =>
  new RequestClientClass(process.env.NEXT_PUBLIC_API_SERVER);

const joinRave = async (payload: any) => {
  const uri = API.joinRave.post.replace('{eventId}', payload.id);
  const response = await requestClient()
    .setUri(uri)
    .setAuthorizationStatus()
    .setPayload(payload.data)
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

const redeemRaveReward = async (eventId: string, rewardId: string) => {
  const uri = API.redeemRaveReward.post
    .replace('{eventId}', eventId)
    .replace('{rewardId}', rewardId);
  const response = await requestClient()
    .setUri(uri)
    .setAuthorizationStatus()
    .setHeaders({
      'Content-Type': 'application/json'
    })
    .doPost();
  return response;
};

export default {
  joinRave,
  getRave,
  redeemRaveReward,
};
