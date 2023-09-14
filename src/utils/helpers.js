const { db_info } = require("../config");
const jwt = require('jsonwebtoken');

const formatRoute = (str) => {
  return str.toLowerCase().replace(/[,_\/\s-]/g, '');
}

const getTokenFrom = request => {
  const authorization = request.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7) // After 'bearer '
  }

  return null
}

const verifyToken = (req, res, next) => {
  const authorization = req.headers.authorization
  let token;
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    token = authorization.substring(7)
  }
  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }
  try {
    const decodedToken = jwt.verify(token, db_info.secret_key);
    if (!decodedToken) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return next()
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

module.exports = {
  formatRoute,
  getTokenFrom,
  verifyToken
}