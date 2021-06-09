const service = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

/**
 * GET handler for all reservation entries
 */
async function list(req, res) {
  const {date} = req.query
  const data = await service.list()
  res.status(200).send({
    data: data,
  });
}
/**
 * GET handler for specific reservation
 */
async function read(req, res, next) {
  const {reservation_id} = req.params
  const data = await service.read(reservation_id)
  if(data){
    res.status(200).send({ data: data});
  }
  next(
    {
      error: 404,
      message: `Reservation with ${reservation_id} not found.`
    }
  )
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: asyncErrorBoundary(read)
};
