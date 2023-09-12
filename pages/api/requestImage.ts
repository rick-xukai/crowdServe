// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Buffer } from "buffer";
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

type ResponseData = {
  data: string | null;
};

async function getBinaryImage(url: any) {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
  });
  return response.data;
}

async function getImageAsBase64(url: any) {
  try {
    const binaryData = await getBinaryImage(url);
    return binaryData;
  } catch (error) {
    console.log(error);
  }
}
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const { method } = req;
  if (method === "GET") {
    const { image }: any = req.query;
    getImageAsBase64(image).then((response) => {
      console.log(response);
      const arraybuffer = new Int8Array(response.data);

      res.status(200).json(response);
    });
    // axios({
    //   method: "GET",
    //   url: image,
    //   responseType: "arraybuffer",
    // })
    //   .then((response) => {
    //     console.log(response.data);

    //     res.status(200).json(response.data);
    //   })
    //   .catch((err) => {
    //     res.status(200).json({ data: err });
    //   });
  }
};
export default handler;
