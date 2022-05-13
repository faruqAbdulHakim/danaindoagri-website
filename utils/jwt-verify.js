import jwt from 'jsonwebtoken';

// use this to avoid callback hell
const JwtVerify = (token, secret) => {
  const returnValue = {
    decoded: undefined, error: undefined
  }

  jwt.verify(token, secret, (error, decoded) => {
    if (error) returnValue.error = error.message;
    else returnValue.decoded = decoded;
  })

  return returnValue;
}

export default JwtVerify;