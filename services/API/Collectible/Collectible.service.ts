import { RequestClientClass } from '../../../utils/requestClient';
import API from '../../../constants/API';

const requestClient = () =>
  new RequestClientClass(process.env.NEXT_PUBLIC_API_SERVER);

const getCollectibleDetail = async (payload: string) => {
  const uri = API.getMyEventTicketDetail.get.replace('{userTicketId}', payload);
  const response = await requestClient()
    .setUri(uri)
    .setAuthorizationStatus()
    .doGet();
  return response;
};

const getConnectedEvents = async (payload: string) => {
  const uri = API.getConnectedEvents.get.replace('{userTicketUuid}', payload);
  const response = await requestClient()
    .setUri(uri)
    .setAuthorizationStatus()
    .doGet();
  return response;
};

const getPriceChartData = async (payload: string) => {
  const uri = API.getPriceChartData.get.replace('{userTicketUuid}', payload);
  const response = await requestClient()
    .setUri(uri)
    .setAuthorizationStatus()
    .doGet();
  return response;
};

const claimTransfer = async (payload: string) => {
  const uri = API.claimTransfer.post.replace('{code}', payload);
  const response = await requestClient()
    .setUri(uri)
    .setAuthorizationStatus()
    .setHeaders({
      'Content-Type': 'application/json',
    })
    .doPost();
  return response;
};

export default {
  getCollectibleDetail,
  getConnectedEvents,
  getPriceChartData,
  claimTransfer,
};
