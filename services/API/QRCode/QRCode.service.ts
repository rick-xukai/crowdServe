import { RequestClientClass } from '../../../utils/requestClient';
import API from '../../../constants/API';

const requestClient = () =>
  new RequestClientClass(process.env.NEXT_PUBLIC_API_SERVER);

const getQRcodeData = async (payload: {
  ticket: string;
  event: string | null;
}) => {
  const uri = API.getQRcodeData.get.replace('{userTicketUuid}', payload.ticket);
  const response = await requestClient()
    .setUri(uri)
    .setAuthorizationStatus()
    .setQueryParameter({ eventId: payload.event })
    .doGet();
  return response;
};

export default {
  getQRcodeData,
};
