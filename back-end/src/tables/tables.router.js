/**
 * Defines the router for table resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./tables.controller");
 
const methodNotAllowed = require("../errors/methodNotAllowed.js")

router.route("/:table_id/seat")
    .put(controller.update)
    .all(methodNotAllowed)

router.route("/table_id")
    .get(controller.read)
    .all(methodNotAllowed)

router.route("/")
    .get(controller.list) 
    .post(controller.create)
    .all(methodNotAllowed)

module.exports = router;