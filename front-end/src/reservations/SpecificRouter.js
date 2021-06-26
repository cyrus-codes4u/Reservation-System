import React from "react";

import { Route, Switch, useRouteMatch, useParams } from "react-router-dom";
import SeatReservation from "./SeatReservation";
import EditReservation from "./EditReservation";

/**
 * Defines routes beginning with '/reservation' for the application.
 *
 * @returns {JSX.Element}
 */

 function SpecificRouter() {
    const url = useRouteMatch().url
    const {reservation_id} = useParams()

    
    
    return (
        <Switch>
            <Route exact={true} path={`${url}/seat`}>
                <SeatReservation reservation_id={reservation_id} />
            </Route>
            <Route path={`${url}/edit`}>
                <EditReservation reservation_id={reservation_id} />
            </Route>
        </Switch>
    )
}

export default SpecificRouter