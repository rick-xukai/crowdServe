import { RequestClientClass } from '../../../utils/requestClient';
import API from '../../../constants/API';

const requestClient = () => new RequestClientClass(process.env.NEXT_PUBLIC_API_SERVER);

const getEventList = async (payload: any) => {
  const uri = API.getEventList.get;
  const response = await requestClient()
    .setUri(uri)
    .setAuthorizationStatus()
    .setQueryParameter(payload)
    .doGet();
  return response;
};

export default { getEventList };
