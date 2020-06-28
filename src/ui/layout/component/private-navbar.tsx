import React, {
  useRef,
  useMemo,
  useState,
  Fragment,
  useEffect,
  useContext,
  useReducer,
} from 'react';

import { Flex, FlexRow } from './flex';
import * as auth from 'auth/auth.state';
import { Action } from 'auth/auth.type';
import { history } from 'app/app.history';
import { signOut } from 'api/resource.api';
import { ROUTE } from 'app/app.route-path';
import { AuthContext } from 'auth/auth.context';
import { USER_ROLES } from 'app/app.user-type';
import {
  pictures,
  persons,
  notifications,
  getRandomNumber,
} from 'data/mock.data';

const handleSignOut = async (
  dispatch: (props: Action) => void,
  setIsSignedOut: (prop: boolean) => void
) => {
  dispatch({ type: auth.AUTH_ACTION_PENDING });
  const { error } = await signOut();

  if (error) {
    return dispatch({ type: auth.AUTH_ACTION_STOPPED });
  }

  dispatch({ type: auth.SIGN_OUT_SUCCESS });
  setIsSignedOut(true);
};

const PrivateNavBar = () => {
  const { user, roles, isHandlingAuth, setCurrentAuth } = useContext(
    AuthContext
  );
  const [isSignedOut, setIsSignedOut] = useState(false);
  const [notificationCount, setNotificationCount] = useState<number>();
  const [authState, dispatch] = useReducer(auth.reducer, auth.initialState);

  useMemo(() => {
    if (isSignedOut) {
      setCurrentAuth(authState);
    }
  }, [isSignedOut, authState, setCurrentAuth]);

  useEffect(() => {
    setNotificationCount(getRandomNumber(6));
  }, []);

  return (
    <Fragment>
      <section className="col-12 p-4 mt-1">
        <Flex className="justify-content-between text-primary pr-md-3 pl-md-3">
          <div className="col-md-3 p-0">
            <div className="d-flex">
              <i className="icon ion-md-school h3 mr-2 m-0" />
              <span className="p pt-1">
                Edu<span className="bold">Cere</span>
              </span>
            </div>
          </div>
          <div className="col-md-6 p-0 d-none d-md-block">
            <div className="d-flex ">
              {/* <span className="bold lead page-title">{getPageName()}</span> */}
            </div>
          </div>
          <div className="col-md-3 p-0 d-flex">
            <div className="user-tool">
              <div className="notification p-relative pr-3">
                <button
                  className="bold p pt-1 notification-btn"
                  onClick={() => setNotificationCount(0)}
                >
                  <span className="notification-count">
                    {notificationCount ? notificationCount : ''}
                  </span>
                  <i className="icon ion-md-notifications-outline h3 m-0 text-muted" />
                  <div className="dropdown text-muted">
                    <ul className="list-unstyled">
                      {Array.from(Array(5)).map((key) => (
                        <li className="p-2">
                          <FlexRow>
                            <img
                              src={pictures.getRandomPicture()}
                              className="col-md-3 pr-0 pl-1 notification-picture"
                              alt="img"
                            />
                            <span className="col-md-9 notification-message pr-0">
                              <strong className="text-primary bold">
                                {persons.getRandomName()}
                              </strong>
                              {roles.includes(USER_ROLES.TUTOR)
                                ? notifications.getRandomTutorMessage()
                                : notifications.getRandomInstitutionMessage()}
                            </span>
                          </FlexRow>
                        </li>
                      ))}
                    </ul>
                  </div>
                </button>
              </div>

              {user.photo ? (
                <div className="dp">
                  <img src={user.photo} alt="dp" />
                </div>
              ) : (
                <i className="icon ion-md-contact h3 mr-2 m-0 text-muted" />
              )}
              <button className="bold p user-tool-btn">
                <span className="d-none d-md-inline text-muted">
                  {user.name}
                </span>
                <i className="icon ion-ios-arrow-down ml-2 text-primary" />
                <div className="dropdown text-muted">
                  <div className="list shake">
                    <i className="icon ion-md-contact mr-2 m-0 d-inline-block" />
                    Profile
                  </div>

                  {isHandlingAuth ? (
                    <div className="list shake text-muted">
                      <i className="icon ion-md-power mr-2 m-0 d-inline-block" />
                      Signing out...
                    </div>
                  ) : (
                    <div
                      className="list shake"
                      onClick={() => handleSignOut(dispatch, setIsSignedOut)}
                    >
                      <i className="icon ion-md-power mr-2 m-0 d-inline-block" />
                      Sign Out
                    </div>
                  )}
                </div>
              </button>
            </div>
          </div>
        </Flex>
      </section>

      {!!!roles.includes(USER_ROLES.GUEST) && <MenuBar roles={roles} />}
    </Fragment>
  );
};

interface MenuProps {
  name: string;
  icon?: string;
  route?: string;
}

const TOP_MENU = {
  MENU: 'menu',
  ACTIVE_MENU: 'Overview',

  setActiveMenu(menu: string) {
    return (this.ACTIVE_MENU = menu);
  },

  isActive(menu: string) {
    return this.ACTIVE_MENU === menu;
  },
};

const redirectTo = (route: string) => history.push(route);

const handleRoute = (route: string = '', menuId: string) => {
  redirectTo(route);
  TOP_MENU.setActiveMenu(menuId);
};

const Menu = ({ name, icon, route }: MenuProps) => (
  <div className="menu">
    <input
      id={name}
      type="radio"
      name="top-menu"
      className="menu-input"
      checked={TOP_MENU.isActive(name)}
      onChange={() => handleRoute(route, name)}
    />
    <label className="menu-label" htmlFor={name}>
      <span className="shake p text-primary">
        <i className={`icon ion-${icon} p mr-2 m-0 d-inline-block`} />
        {name}
      </span>
    </label>
  </div>
);

const showLogo = (ref: any) => {
  window.addEventListener('scroll', function () {
    console.log();
    if (window.scrollY > 300 && !ref.current?.classList?.contains('show')) {
      ref.current?.classList?.add('show');
    }

    if (window.scrollY < 300 && ref.current?.classList?.contains('show')) {
      ref.current?.classList?.remove('show');
    }
  });
};

const MenuBar = ({ roles }: { roles: Array<string> }) => {
  const ref = useRef() as React.MutableRefObject<HTMLInputElement>;
  showLogo(ref);

  return (
    <section className="row menu-bar text-primary p-0">
      <div className="col-md-3">
        <div ref={ref} className="d-flex pt-2 pl-5 hide">
          <i className="icon ion-md-school h3 mr-2 m-0" />
          <span className="p pt-1">
            Edu<span className="bold">Cere</span>
          </span>
        </div>
      </div>
      <div className="col-md-9 pl-5">
        {roles.includes(USER_ROLES.TUTOR) && (
          <>
            <Menu icon="md-clipboard" route="/overview" name="Overview" />
            <Menu
              icon="md-paper-plane"
              route={ROUTE.TUTOR_APPOINTMENTS}
              name="Appointments"
            />
            <Menu
              icon="md-calendar"
              route={ROUTE.ADD_AVAILABILITY}
              name="Schedule"
            />
            <Menu
              icon="md-calendar"
              route={ROUTE.ADD_EXPERTISE}
              name="Expertise"
            />
          </>
        )}

        {roles.includes(USER_ROLES.INSTITUTION) && (
          <>
            <Menu icon="md-clipboard" route="/overview" name="Overview" />
            <Menu
              icon="md-paper-plane"
              route={ROUTE.INSTITUTION_APPOINTMENTS}
              name="Appointments"
            />
            <Menu
              icon="md-search"
              route={ROUTE.FIND_TUTOR}
              name="Find Tutors"
            />
            <Menu icon="md-pin" route={ROUTE.NEARBY_EVENTS} name="Nearby" />
          </>
        )}
      </div>
    </section>
  );
};
export default PrivateNavBar;
