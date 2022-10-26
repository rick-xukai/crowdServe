import { RequestClientClass } from '../../../utils/requestClient';
import API from '../../../constants/API';

const requestClient = () => new RequestClientClass(process.env.NEXT_PUBLIC_API_SERVER);

const doVerifyTicket = async (payload: { code: string }) => {
  const uri = API.verifyTicket.post;
  const response = await requestClient()
    .setUri(uri)
    .setPayload(payload)
    .doPost();
  return response;
};

const doRedeemTicket = async (payload: any) => {
  const uri = API.redeemTicket.delete
    .replace('{userId}', payload.user_id)
    .replace('{ticketId}', payload.ticket_id);
  const response = await requestClient()
    .setUri(uri)
    .doDelete();
  return response;
};

export default {
  doVerifyTicket,
  doRedeemTicket,
};
