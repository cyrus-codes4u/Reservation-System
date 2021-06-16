const service = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")


function hasData(req, res, next){
    if(req.body.data){
      res.locals.table = req.body.data
      return next()
    }
    next(
      {
        status: 400,
        message: "Request body does not have any data"
      }
    )
  }

async function list (req,res,next) {
    const data = await service.list()
    res.status(200).json({ data: data });
}
async function create(req,res,next) {
    const storedTable = await service.create(res.locals.table)
    res.status(201).json({ data: storedTable[0] })
}

module.exports = {
    list: asyncErrorBoundary(list),
    create: [asyncErrorBoundary(hasData), asyncErrorBoundary(create)],
}