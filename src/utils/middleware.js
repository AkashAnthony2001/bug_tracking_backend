const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" })
}

const errorHandler = (error, req, res, next) => {
  res.json({ error: error.message })
}



module.exports = {
  unknownEndpoint,
  errorHandler
}