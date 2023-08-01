import React from "react"
import { Route, Redirect, RouteComponentProps } from "react-router-dom"
import { auth } from "../firebase";

type PrivateRouteProps = {
  path: string;
  exact?: boolean;
  component: React.VFC<RouteComponentProps>;
};

const PrivateRoute = ({ component: Component, path, ...rest }: PrivateRouteProps) => {
  const { currentUser } = auth;
  return (
    <Route
      path={path}
      {...rest}
      render={props => {
        return currentUser ? <Component {...props} /> : <Redirect to="/login" />
      }}
    />
  )
}

export default PrivateRoute;