import React from 'react';
import { Switch } from 'react-router-dom';

import { ROUTE } from 'app/app.route-path';
import { PrivateRoute } from 'app/app.routes';
import FindTutorView from './view/find-tutor.view';
import AppointmentsView from './view/appointment.view';
import NearbyEventsView from './view/nearby-events.view';
import TutorDetailView from './view/tutor-detail.view';
import AppointmentRequestView from './view/appointment-request.view';

const InstitutionRoute = () => (
  <Switch>
    <PrivateRoute exact path={ROUTE.FIND_TUTOR} component={FindTutorView} />
    <PrivateRoute
      exact
      path={ROUTE.TUTOR_DETAILS}
      component={TutorDetailView}
    />
    <PrivateRoute
      exact
      path={ROUTE.INSTITUTION_APPOINTMENTS}
      component={AppointmentsView}
    />
    <PrivateRoute
      exact
      path={ROUTE.NEARBY_EVENTS}
      component={NearbyEventsView}
    />
    <PrivateRoute
      exact
      path={ROUTE.BOOK_TUTOR}
      component={AppointmentRequestView}
    />
  </Switch>
);

export default InstitutionRoute;
