import { RequestClientClass } from '../../../utils/requestClient';
import API from '../../../constants/API';
import { GetMyCollectiblesListPayloadType } from '../../../slice/myCollectibles.slice';

const requestClient = () =>
  new RequestClientClass(process.env.NEXT_PUBLIC_API_SERVER);

const getMyCollectiblesList = async (
  payload: GetMyCollectiblesListPayloadType
) => {
  const uri = API.getMyCollectiblesList.get;
  const response = await requestClient()
    .setUri(uri)
    .setAuthorizationStatus()
    .setQueryParameter(payload)
    .doGet();
  return response;
};

const getMyCollectiblesOrganizerInfo = async (payload: string) => {
  const uri = API.getMyCollectiblesOrganizerInfo.get.replace(
    '{organizerId}',
    payload
  );
  const response = await requestClient()
    .setUri(uri)
    .setAuthorizationStatus()
    .doGet();
  return response;
};

const getMyCollectiblesOrganizerTicketList = async (
  requestId: string,
  payload: GetMyCollectiblesListPayloadType
) => {
  const uri = API.getMyCollectiblesOrganizerTicketList.get.replace(
    '{organizerId}',
    requestId
  );
  const response = await requestClient()
    .setUri(uri)
    .setAuthorizationStatus()
    .setQueryParameter(payload)
    .doGet();
  return response;
};

const getTransferDetailsByCode = async (payload: string) => {
  const uri = API.getTransferDetailsByCode.get.replace('{code}', payload);
  const response = await requestClient()
    .setUri(uri)
    .setAuthorizationStatus()
    .doGet();
  return response;
};

export default {
  getMyCollectiblesList,
  getMyCollectiblesOrganizerInfo,
  getMyCollectiblesOrganizerTicketList,
  getTransferDetailsByCode,
};
