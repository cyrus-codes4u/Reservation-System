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
  const data = await service.read( parseInt(reservation_id) )
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
  const dateRegex = new RegExp('^[12][0-9]{3}-0[1-9]|1[0-2]-0[1-9]|[12][0-9]|3[01]$')
  if(dateRegex.test(res.locals.reservation.reservation_date)){
    return next()
  }
  next(
    {
      status:400,
      message: `reservation_date: ${res.locals.reservation.reservation_date} is not a date`
    }
  )
}
function timePropIsATime(req,res,next){
  const timeRegex = new RegExp('^([2][0-3]|[01][0-9]):[0-5][0-9]$')
  
  if(timeRegex.test(res.locals.reservation.reservation_time)){
    return next()
  }
  next(
    {
      status: 400,
      message: `reservation_time: ${res.locals.reservation.reservation_time} is not a time`
    }
  )
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
  // res.locals.reservation.people = parseInt(res.locals.reservation.people)
  if( Number.isInteger(res.locals.reservation.people) && res.locals.reservation.people !== 0){
    return next()
  }
  next(
    {
      status: 400,
      message: `New reservations must have people property that is an integer greater than 0`
    }
  )
}
function dateTimeIsInFuture(req,res,next){
  const today = new Date()
  const [year, month, day] = res.locals.reservation.reservation_date.split("-")
  const [hour, minute] = res.locals.reservation.reservation_time.split(":")
  res.locals.reservationDateObject = new Date(year, month-1, day, hour, minute)
  if(res.locals.reservationDateObject - today > 0){
    return next()
  }
  next(
    {
      status:400,
      message: "Reservation date must be placed for a future time."
    }
  )
}
function dateIsNotTuesday(req,res,next){
  if( res.locals.reservationDateObject.getDay() !== 2){
    return next()
  }
  next(
    {
      status: 400,
      message: "The restaurant is closed on Tuesdays."
    }
  )
}
// function timeIsInFuture(req,res,next){
//   const today = new Date()
//   const [hour, minute] = res.locals.reservation.reservation_time.split(":")
//   res.locals.reservationDateObject = new Date(year, month-1, day)
//   if(res.locals.reservationDateObject - today > 0){
//     return next()
//   }
//   next(
//     {
//       status:400,
//       message: "Reservation date must be placed for a future time."
//     }
//   )
// }
function restaurantIsOpen(req,res,next){
  const hour = res.locals.reservationDateObject.getHours()
  const minute = res.locals.reservationDateObject.getMinutes()
  if( (hour > 10 && hour < 21)
    || (hour === 10 && minute >= 30)
    || (hour === 21 && minute <=30) ){
    return next()
  }
  next(
    {
      status: 400,
      message: `Reservation_time: ${res.locals.reservation.reservation_time} is not during opening hours or is less than an hour before closing.`
    }
  )
  
}

async function create(req,res,next){
  const storedReservation = await service.create(res.locals.reservation)
  res.status(201).json({ data: storedReservation[0] })
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: asyncErrorBoundary(read),
  create: [asyncErrorBoundary(hasData), asyncErrorBoundary(hasRequiredProperties), asyncErrorBoundary(hasNoEmptyProperties),
    asyncErrorBoundary(datePropIsADate), asyncErrorBoundary(timePropIsATime), asyncErrorBoundary(peopleIsNonZeroInteger), 
    asyncErrorBoundary(dateTimeIsInFuture), asyncErrorBoundary(dateIsNotTuesday), asyncErrorBoundary(restaurantIsOpen), 
    asyncErrorBoundary(create)],
};
