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
  const authHeader = req.headers.Authorization;
  if(authHeader){
    if (authHeader) {
      const token = authHeader.split(' ')[1]; 
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          return res.sendStatus(403); n
        }
        req.user = decoded; 
        next(); 
      });
    } else {
      res.sendStatus(401); 
    }
  }
}

module.exports = {
  formatRoute,
  getTokenFrom,
  verifyToken
}