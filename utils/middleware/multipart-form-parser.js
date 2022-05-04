import formidable from 'formidable';

const form = formidable();

export default async function multipartFormParser(req, res, next) {
  const contentType = req.headers['content-type'];
  if (contentType && contentType.indexOf('multipart/form-data') !== -1) {
    form.parse(req, (err, fields, files) => {
      if (!err) {
        req.body = fields;
        req.files = files;
      } 
      next();
    })
  } else {
    next();
  }
}
