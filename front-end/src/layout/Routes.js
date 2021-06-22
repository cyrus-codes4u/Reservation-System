import React, { useEffect, useState } from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import ReservationsRouter from "../reservations/ReservationsRouter"
import CreateTable from "../forms/CreateTable"
import NotFound from "./NotFound";
import useQuery from "../utils/useQuery";
import { today } from "../utils/date-time"



/**
 * Defines all the routes for the application.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const queryParams = useQuery()
  const [date, setDate] = useState(today())
  
  useEffect( loadDate, [queryParams])

  function loadDate(){
    const urlDate = queryParams.get("date") ? queryParams.get("date") : today()
    setDate(urlDate)
  }

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/reservations">
        <ReservationsRouter />
      </Route>
      <Route exact={true} path="/tables/new">
        <CreateTable />
      </Route>
      <Route path="/dashboard">
        <Dashboard currentDate={date} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
