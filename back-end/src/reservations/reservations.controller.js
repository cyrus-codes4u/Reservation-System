const service = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

/**
 * GET handler for all reservation entries
 */
async function list(req, res) {
  const {date = null} = req.query
  const data = await service.list(date)
  res.status(200).json({ data: data });
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
      status: 404,
      message: `Reservation with ${reservation_id} not found.`
    }
  )
}

function hasData(req, res, next){
  if(req.body.data){
    res.locals.reservation = req.body.data
    return next()
  }
  next(
    {
      status: 400,
      message: "Request body does not have any data"
    }
  )
}

function hasRequiredProperties(req,res,next){
  const validKeys = ["first_name", "last_name", "mobile_number", "reservation_date", "reservation_time","people"]
  for(let i = 0; i< validKeys.length; i++){
    const key = validKeys[i]
    if(!res.locals.reservation[key]){
      next(
        {
          status: 400,
          message: `Request does not contain ${key} property.`
        }
      )
    }
  }
  next()
}
function datePropIsADate(req,res,next){
  
}
function timePropIsATime(req,res,next){
  
}
function hasNoEmptyProperties (req,res,next){
  Object.entries(res.locals.reservation).forEach(([key, value]) => {
    if(value === "" || value === null){
      next({
        status:400,
        message: `Request ${key} field must not be empty.`
      })
    }
  })
  next()
}

function peopleIsNonZeroInteger(req,res,next){
  if(Number.isInteger(res.locals.reservation.people) && res.locals.reservation.people !== 0){
    return next()
  }
  next(
    {
      status: 400,
      message: "New reservations must have people property that is an integer greater than 0"
    }
  )
}

async function create(req,res,next){
  const newReservation = res.locals.reservation
  const storedReservation = await service.create(newReservation)
  res.status(201).json({ data: storedReservation[0] })
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: asyncErrorBoundary(read),
  create: [asyncErrorBoundary(hasData), asyncErrorBoundary(hasRequiredProperties), asyncErrorBoundary(hasNoEmptyProperties), asyncErrorBoundary(peopleIsNonZeroInteger), asyncErrorBoundary(create)],
};
