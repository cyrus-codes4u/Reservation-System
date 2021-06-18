/**
 * Defines the router for table resources.
 *
 * @type {Router}
 */

const router = require("express").Router()
const controller = require("./tables.controller")
 
const methodNotAllowed = require("../errors/methodNotAllowed.js")

//Route that deals with seating and removing reservations from tabls
router.route("/:table_id/seat")
    .put(controller.update)
    .delete(controller.remove)
    .all(methodNotAllowed)

//Route to get specific table data
router.route("/:table_id")
    .get(controller.read)
    .all(methodNotAllowed)

//Route to see all tables or create a new table
router.route("/")
    .get(controller.list) 
    .post(controller.create)
    .all(methodNotAllowed)

module.exports = router;