const service = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

//General Validation
async function reservationExists(req,res,next){
  const {reservation_id} = req.params
  const reservation = await service.read( parseInt(reservation_id) )
  if(reservation){
    res.locals.reservation = reservation
    return next()
  }
  next(
    {
      status: 404,
      message: `Reservation with id ${reservation_id} not found.`
    }
  )
}

//PUT Status Update Validation Middleware
function statusIsValid (req,res,next){
  const statuses = ["booked", "seated", "finished", "cancelled"]
  res.locals.updates = req.body.data
  if( statuses.includes(res.locals.updates.status)){
    return next()
  }
  next(
    {
      status: 400,
      message: `New reservation status: ${res.locals.updates.status} is invalid.`
    }
  )
}
function reservationUnfinished(req,res,next){
  if(res.locals.reservation.status === "finished"){
    next(
      {
        status: 400,
        message: "A finished reservation cannot have its status updated"
      }
    )
  }
  if(res.locals.reservation.status !== "booked" && res.locals.updates.status === "cancelled"){
    next(
      {
        status: 400,
        message: "A seated reservation cannot be cancelled"
      }
    )
  }
  next()
}

//POST and General PUT Validation Middleware
function hasData(req, res, next){
  if(req.body.data){
    res.locals.newReservation = req.body.data
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
  const validKeys = ["first_name", "last_name", "mobile_number", "reservation_date", "reservation_time", "people"]
  for(let i = 0; i< validKeys.length; i++){
    const key = validKeys[i]
    if(!res.locals.newReservation[key]){
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
  if(dateRegex.test(res.locals.newReservation.reservation_date)){
    return next()
  }
  next(
    {
      status:400,
      message: `reservation_date: ${res.locals.newReservation.reservation_date} is not a date`
    }
  )
}
function timePropIsATime(req,res,next){
  const timeRegex = new RegExp('^([2][0-3]|[01][0-9]):[0-5][0-9]$')
  
  if(timeRegex.test(res.locals.newReservation.reservation_time)){
    return next()
  }
  next(
    {
      status: 400,
      message: `reservation_time: ${res.locals.newReservation.reservation_time} is not a time`
    }
  )
}
function hasNoEmptyProperties (req,res,next){
  Object.entries(res.locals.newReservation).forEach(([key, value]) => {
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
  const people = parseInt(res.locals.newReservation.people)
  if( !Number.isNaN(people) && people !== 0){
    res.locals.newReservation.people = people
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
  const [year, month, day] = res.locals.newReservation.reservation_date.split("-")
  const [hour, minute] = res.locals.newReservation.reservation_time.split(":")
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
      message: `Reservation_time: ${res.locals.newReservation.reservation_time} is not during opening hours or is less than an hour before closing.`
    }
  )
  
}
function statusIsBooked(req,res,next){
  
  if(!res.locals.newReservation.status || res.locals.newReservation.status === "booked"){
    res.locals.newReservation.status= "booked"
    return next()
  }
  next(
    {
      status: 400,
      message: `Status property: ${res.locals.newReservation.status} invalid; must be 'booked'.`
    }
  )
}


async function list(req, res) {
  const {date, mobile_number} = req.query
  if(date){
    const data = await service.list(date)
    res.status(200).send({ data: data });
  }
  if(mobile_number){
    const data = await service.search(mobile_number)
    res.status(200).send({ data: data })
  }
}
async function read(req, res) {
  res.status(200).send({ data: res.locals.reservation});
}
async function create(req,res){
  const storedReservation = await service.create(res.locals.newReservation)
  res.status(201).send({ data: storedReservation[0] })
}
async function update(req,res){
  if(res.locals.newReservation){
    res.locals.updates = res.locals.newReservation
  }
  const data = await service.update(res.locals.reservation.reservation_id, res.locals.updates)
  res.status(200).json({ data: data })
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  create: [asyncErrorBoundary(hasData), asyncErrorBoundary(hasRequiredProperties), asyncErrorBoundary(hasNoEmptyProperties),
    asyncErrorBoundary(datePropIsADate), asyncErrorBoundary(timePropIsATime), asyncErrorBoundary(peopleIsNonZeroInteger), 
    asyncErrorBoundary(dateTimeIsInFuture), asyncErrorBoundary(dateIsNotTuesday), asyncErrorBoundary(restaurantIsOpen), 
    asyncErrorBoundary(statusIsBooked) , asyncErrorBoundary(create)],
  status: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(statusIsValid), asyncErrorBoundary(reservationUnfinished),
    asyncErrorBoundary(update)],
  update: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(hasData), asyncErrorBoundary(hasRequiredProperties),
    asyncErrorBoundary(hasNoEmptyProperties), asyncErrorBoundary(datePropIsADate), asyncErrorBoundary(timePropIsATime), 
    asyncErrorBoundary(peopleIsNonZeroInteger), asyncErrorBoundary(dateTimeIsInFuture), asyncErrorBoundary(dateIsNotTuesday), 
    asyncErrorBoundary(restaurantIsOpen), asyncErrorBoundary(update)]
};
