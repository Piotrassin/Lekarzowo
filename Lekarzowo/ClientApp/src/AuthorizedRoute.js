import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import AuthService from './authentication/AuthService.js';

export const AuthorizedRoute = ({ component: Component, roles, ...rest }) => (
    <Route {...rest} render={props => {
        const currentUser = AuthService.getUser();
        if (currentUser && currentUser.status == 401) {
            // not logged in so redirect to login page with the return url
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }

        // check if route is restricted by role
        if (roles && roles.indexOf(currentUser.currentRole) === -1) {
            // role not authorised so redirect to home page
            switch(currentUser.currentRole){
              case 'patient':
                return <Redirect to={{ pathname: '/'}} />
                break;
              case 'doctor':
                return <Redirect to={{ pathname: '/dashboardDoctor'}} />
                break;
              case 'admin':
                return <Redirect to={{ pathname: '/adminPanel'}} />
                break;
            }
            return <Redirect to={{ pathname: '/'}} />
        }
        if(props.render){
          return props.render;

        }
        // authorised so return component
        return <Component {...props} />
    }} />
)
