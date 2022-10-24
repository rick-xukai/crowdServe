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

const doGetTicketToken = async () => {
  const uri = API.getTicketToken.get;
  const response = await requestClient()
    .setUri(uri)
    .setHeaders({
      'X-APP-PLATFORM': 'ios',
      'X-APP-VERSION': '1.0.0',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY2NjE2OTI4OH0.uP-49rKmxxXS5rMBvnkwI1g_uJODRfDy7VBsRIFM8vE',
    })
    .doGet();
  return response;
};

export default {
  doVerifyTicket,
  doRedeemTicket,
  doGetTicketToken,
};
