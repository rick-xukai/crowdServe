import { RequestClientClass } from '../../../utils/requestClient';
import API from '../../../constants/API';
import { LoginPayloadType } from '../../../slice/login.slice';

const requestClient = () => new RequestClientClass(process.env.NEXT_PUBLIC_API_SERVER);

const doLogin = async (payload: LoginPayloadType) => {
  const uri = API.login.post;
  const response = await requestClient()
    .setUri(uri)
    .setPayload(payload)
    .doPost();
  return response;
};

export default { doLogin };
