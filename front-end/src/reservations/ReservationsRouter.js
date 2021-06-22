import React from "react";

import { Route, Switch, useRouteMatch } from "react-router-dom";
import CreateReservation from "./CreateReservation";
import SeatReservation from "./SeatReservation";
/**
 * Defines routes beginning with '/reservation' for the application.
 *
 * @returns {JSX.Element}
 */

 function ReservationsRouter() {
    const url = useRouteMatch().url
    return (
        <Switch>
            <Route path={`${url}/new`}>
                <CreateReservation />
            </Route>
            <Route path={`${url}/:reservation_id/seat`}>
                <SeatReservation />
            </Route>
        </Switch>
    )
}

export default ReservationsRouter