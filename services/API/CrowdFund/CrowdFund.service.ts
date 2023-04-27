import { RequestClientClass } from '../../../utils/requestClient';
import API from '../../../constants/API';
import { GetCrowdFundListPayloadType } from '../../../slice/crowdFund.slice';

const requestClient = () =>
  new RequestClientClass(process.env.NEXT_PUBLIC_API_SERVER);

const getCrowdFundList = async (payload: GetCrowdFundListPayloadType) => {
  const uri = API.getCrowdFundList.get;
  const response = await requestClient()
    .setUri(uri)
    .setAuthorizationStatus()
    .setQueryParameter(payload)
    .doGet();
  return response;
};

const getCrowdFundDetail = async (payload: string) => {
  const uri = API.getCrowdFundDetail.get.replace('{id}', payload);
  const response = await requestClient()
    .setUri(uri)
    .setAuthorizationStatus()
    .setQueryParameter(payload)
    .doGet();
  return response;
};

export default {
  getCrowdFundList,
  getCrowdFundDetail,
};
