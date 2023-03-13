import { RequestClientClass } from '../../../utils/requestClient';
import API from '../../../constants/API';
import { GetEventListPayloadType } from '../../../slice/event.slice';

const requestClient = () => new RequestClientClass(process.env.NEXT_PUBLIC_API_SERVER);

const getEventList = async (payload: GetEventListPayloadType) => {
  const uri = API.getEventList.get;
  const response = await requestClient()
    .setUri(uri)
    .setAuthorizationStatus()
    .setQueryParameter(payload)
    .doGet();
  return response;
};

const getEventDetail = async (payload: string) => {
  const uri = API.getEventDetail.get.replace(
    '{eventId}',
    payload,
  );
  const response = await requestClient()
    .setUri(uri)
    .setAuthorizationStatus()
    .setQueryParameter(payload)
    .doGet();
  return response;
};

const getEventTicketType = async (payload: string) => {
  const uri = API.getEventDetailTicketType.get.replace(
    '{eventId}',
    payload,
  );
  const response = await requestClient()
    .setUri(uri)
    .setAuthorizationStatus()
    .doGet();
  return response;
};

export default { getEventList, getEventTicketType, getEventDetail };
