import { RequestClientClass } from '../../../utils/requestClient';
import API from '../../../constants/API';

const requestClient = () =>
  new RequestClientClass(process.env.NEXT_PUBLIC_API_SERVER);

const getMyTicketsListUserEventsList = async (payload: any) => {
  const uri = API.getMyTicketsListUserEventsList.get;
  const response = await requestClient()
    .setUri(uri)
    .setAuthorizationStatus()
    .setQueryParameter(payload)
    .doGet();
  return response;
};

const getMyTicketUserEventDetail = async (payload: string) => {
  const uri = API.getEventDetail.get.replace('{eventId}', payload);
  const response = await requestClient()
    .setUri(uri)
    .setAuthorizationStatus()
    .setQueryParameter(payload)
    .doGet();
  return response;
};

const getMyEventTicketList = async (payload: string) => {
  const uri = API.getMyEventTicketList.get.replace('{eventId}', payload);
  const response = await requestClient()
    .setUri(uri)
    .setAuthorizationStatus()
    .setQueryParameter(payload)
    .doGet();
  return response;
};

const getMyEventTicketDetail = async (payload: string) => {
  const uri = API.getMyEventTicketDetail.get.replace('{userTicketId}', payload);
  const response = await requestClient()
    .setUri(uri)
    .setAuthorizationStatus()
    .setQueryParameter(payload)
    .doGet();
  return response;
};

export default {
  getMyTicketsListUserEventsList,
  getMyTicketUserEventDetail,
  getMyEventTicketList,
  getMyEventTicketDetail,
};
