const verificationApi = (response: any) => {
  let responseStatus = false;
  if (response.code === 200 && response.message === 'OK') {
    responseStatus = true;
  } else {
    responseStatus = false;
  }
  return responseStatus;
};

export { verificationApi };
