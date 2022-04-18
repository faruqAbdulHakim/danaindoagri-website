import jwt from 'jsonwebtoken';

// use this to avoid callback hell
const JwtVerify = (token, secret) => {
  const verify = {
    decoded: undefined,
    error: undefined,
  };

  jwt.verify(token, secret, (error, decoded) => {
    if (error) verify.error = error;
    else verify.decoded = decoded;
  })

  return verify;
}

export default JwtVerify;