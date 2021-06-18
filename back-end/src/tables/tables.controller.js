const service = require("./tables.service")
const readReservation = require("../reservations/reservations.service").read
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

//General Validation middleware
function hasData(req, res, next){
    //checks that the request body has any data
    if(req.body.data){
      res.locals.data = req.body.data
      return next()
    }
    //otherwise passes error to error handler
    next(
      {
        status: 400,
        message: "Request body does not have any data"
      }
    )
}
async function tableExists(req,res,next) {
    //hooks into the request url paramaters to get :table_id
    const {table_id} = req.params
    //if the request has :table_id find table with matching id in db
    res.locals.table = table_id ? await service.read(table_id) : null
    //checks such a table exits
    if(res.locals.table){
        return next()
    }
    //otherwise passes error to error handler
    next({
        status: 404,
        message: `Table with id: ${table_id} not found.`
    })
}

//POST Validation Middleware
function hasRequiredProperties(req,res,next){
    //ensures that a request to create a new table has the required keys
    // these are the required keys
    const validKeys = ["table_name", "capacity"]
    //cycles through these keys
    for(let i = 0; i< validKeys.length; i++){
      const key = validKeys[i]
      //checks that the request data contains these keys
      if(!res.locals.data[key]){
        // passes error to error handler if a key is not in the request data
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
function tableNameIsLongEnough (req,res,next){
    //checks that the new table has a table_name property that is at least 2 characters
    if( typeof(res.locals.data.table_name) === "string" && res.locals.data.table_name.length >= 2 ){
        return next()
    }
    //otherwise passes error to error handler
    next(
        {
            status: 400,
            message: `table_name: ${res.locals.data.table_name} must be at least 2 characters`
        }
    )
}
function capacityIsNonZero (req,res,next){
    //checks that the capacity of a new table is at least 1
    if ( Number.isInteger(res.locals.data.capacity) && res.locals.data.capacity > 0 ) {
        return next()
    }
    //otherwise passes error to error handler
    next(
        {
            status: 400,
            message: `capacity: ${res.locals.data.capacity} must be a non-zero integer`
        }
    )
}

//PUT Validation Middleware
function hasResId(req,res,next){
    //checks that there is a reservation_id property in the request body data
    if( res.locals.data.reservation_id ){
        return next()
    }
     //otherwise passes error to error handler
    next(
        {
            status:400,
            message: `PUT request must have reservation_id property`
        }
    )
}
async function resExists(req,res,next){
    //makes a call to the database to find a reservation with reservation_id provided by request body data
    const reservation = await readReservation(res.locals.data.reservation_id)
    //checks the response from database to see such a reservation exists
    if(reservation){
        res.locals.reservation = reservation
        return next()
    }
    //otherwise passes error to error handler
    next(
        {
            status: 404,
            message: `Reservation with reservation_id ${res.locals.data.reservation_id} not found`
        }
    )
    
}
function tableHasCapacity(req,res,next){
    //Checks that the table has sufficient capacity for the number of people in the reservation
    if( res.locals.table.capacity >= res.locals.reservation.people){
        return next()
    }
    //otherwise passes error to error handler
    next(
        {
            status: 400,
            message: `${res.locals.table.table_name} only has capacity ${res.locals.table.capacity} and cannot seat ${res.locals.reservation.people}.`
        }
    )
}
function tableUnoccupied (req,res,next) {
    //checks that the table is not already occupied by another reservation
    if(res.locals.table.reservation_id === null){
        return next()
    }
    //otherwise passes error to error handler
    next(
        {
            status: 400,
            message: `${res.locals.table.table_name} is currently occupied by reservation_id ${res.locals.table.reservation_id}`
        }
    )
}
function resNotSeated(req,res,next){
    //checks that the reservation with request reservation_id is not already seated or finished
    if(res.locals.reservation.status === "booked"){
        return next()
    }
    //otherwise passes error to error handler
    next(
        {
            status: 400,
            message: `Reservation status: ${res.locals.reservation.status} shows group already seated.`
        }
    )
}

//DELETE Validation Middleware
function tableOccupied (req,res,next){
    //ensures that the table to be cleared in fact has a reservation seated there currently
    if(res.locals.table.reservation_id !== null){
        return next()
    }
    //otherwise passes error to error handler
    next(
        {
            status: 400,
            message: `${res.locals.table.table_name} is currently not occupied.`
        }
    )
}

//Request handlers
async function read (req,res,next) {
    res.status(200).send({ data: res.locals.table })    
}
async function list (req,res,next) {
    const data = await service.list()
    res.status(200).send({ data: data })
}
async function create(req,res,next) {
    const storedTable = await service.create(res.locals.data)
    res.status(201).send({ data: storedTable[0] })
}
async function update(req,res,next) {
    const data = await service.update(res.locals.table.table_id, res.locals.data)
    res.status(200).send({data: data})
}
async function remove(req,res,next){
    const data = await service.remove(res.locals.table.table_id)
    res.status(200).send({data: data})
}

module.exports = {
    read: [asyncErrorBoundary(tableExists), asyncErrorBoundary(read)],
    list: asyncErrorBoundary(list),
    remove: [asyncErrorBoundary(tableExists), asyncErrorBoundary(tableOccupied), asyncErrorBoundary(remove)],
    create: [asyncErrorBoundary(hasData), asyncErrorBoundary(hasRequiredProperties), asyncErrorBoundary(tableNameIsLongEnough),
        asyncErrorBoundary(capacityIsNonZero), asyncErrorBoundary(create)],
    update: [ asyncErrorBoundary(hasData), asyncErrorBoundary(tableExists), asyncErrorBoundary(tableUnoccupied), 
        asyncErrorBoundary(hasResId), asyncErrorBoundary(resExists), asyncErrorBoundary(resNotSeated),
        asyncErrorBoundary(tableHasCapacity), asyncErrorBoundary(update)]
}