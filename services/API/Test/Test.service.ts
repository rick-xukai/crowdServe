import { RequestClientClass } from '../../../utils/requestClient';
import API from '../../../constants/API';

const requestClient = () => new RequestClientClass(process.env.NEXT_PUBLIC_API_SERVER);

const doTest = async () => {
  const uri = API.test.get;
  const response = await requestClient()
    .setUri(uri)
    .doGet();
  return response;
};

export default {
  doTest,
};
