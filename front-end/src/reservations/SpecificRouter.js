import React, {useState, useEffect} from "react";

import { Route, Switch, useRouteMatch, useParams } from "react-router-dom";
import SeatReservation from "./SeatReservation";

/**
 * Defines routes beginning with '/reservation' for the application.
 *
 * @returns {JSX.Element}
 */

 function SpecificRouter() {
    const url = useRouteMatch().url
    const {reservation_id} = useParams()

    
    
    return (
        <React.Fragment>
            
            <Switch>
                <Route exact={true} path={`${url}/seat`}>
                    <SeatReservation reservation_id={reservation_id}/>
                </Route>
                <Route path={`${url}/status`}>
                    <p>TO BE COMPLETED</p>
                </Route>
            </Switch>
        </React.Fragment>
    )
}

export default SpecificRouter