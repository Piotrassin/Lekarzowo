import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import AuthService from './authentication/AuthService.js';

export const AuthorizedRoute = ({ component: Component, roles, ...rest }) => (
    <Route {...rest} render={props => {
        const currentUser = AuthService.getUser();
        if (currentUser && currentUser.status == 401) {
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }
        if (roles && roles.indexOf(currentUser.currentRole) === -1) {
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
        return <Component {...props} />
    }} />
)
