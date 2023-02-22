import { RequestClientClass } from '../../../utils/requestClient';
import API from '../../../constants/API';

const requestClient = () => new RequestClientClass(process.env.NEXT_PUBLIC_API_SERVER);

const doVerifyTicket = async (payload: { code: string, eventId: string }) => {
  const uri = API.verifyTicket.post.replace('{eventId}', payload.eventId);
  const response = await requestClient()
    .setUri(uri)
    .setPayload({ code: payload.code })
    .doPost();
  return response;
};

const doRedeemTicket = async (payload: any) => {
  const uri = API.redeemTicket.delete.replace('{redeem_code}', payload.code);
  const response = await requestClient()
    .setUri(uri)
    .doDelete();
  return response;
};

const getTicketsList = async (payload: any) => {
  const uri = API.getTicketsList.get;
  const response = await requestClient()
    .setUri(uri)
    .setAuthorizationStatus()
    .setQueryParameter(payload)
    .doGet();
  return response;
};

const getTicketDetail = async (payload: string) => {
  const uri = API.getTicketDetail.get.replace('{ticketId}', payload);
  const response = await requestClient()
    .setUri(uri)
    .setAuthorizationStatus()
    .doGet();
  return response;
};

const getTicketQrcode = async (payload: string) => {
  const uri = API.getTicketQrcode.get.replace('{ticketId}', payload);
  const response = await requestClient()
    .setUri(uri)
    .setAuthorizationStatus()
    .doGet();
  return response;
};

export default {
  doVerifyTicket,
  doRedeemTicket,
  getTicketsList,
  getTicketDetail,
  getTicketQrcode,
};
