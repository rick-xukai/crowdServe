import { RequestClientClass } from '../../../utils/requestClient';
import API from '../../../constants/API';
import { ScannerEventListPayload } from '@/slice/scanner.slice';

const requestClient = () =>
  new RequestClientClass(process.env.NEXT_PUBLIC_API_SERVER);

const getScannerEventList = async (payload: ScannerEventListPayload) => {
  const uri = API.getScannerEventList.get;
  const response = await requestClient()
    .setUri(uri)
    .setQueryParameter(payload)
    .setAuthorizationStatus()
    .doGet();
  return response;
};

const verifyScanCode = async (payload: {
  code: string;
  eventIds: string[];
}) => {
  const uri = API.verifyScanCode.post;
  const response = await requestClient()
    .setUri(uri)
    .setAuthorizationStatus()
    .setPayload(payload)
    .doPost();
  return response;
};

const redeemScanCode = async (payload: string) => {
  const uri = API.redeemScanCode.put.replace('{redeemCode}', payload);
  const response = await requestClient()
    .setUri(uri)
    .setAuthorizationStatus()
    .setHeaders({
      'Content-Type': 'application/json',
    })
    .doPut();
  return response;
};

export default {
  getScannerEventList,
  verifyScanCode,
  redeemScanCode,
};
