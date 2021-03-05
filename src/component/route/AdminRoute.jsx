import { Route, Redirect } from "react-router-dom";
import React, { useContext } from "react";
import { AppContext } from "../context/Global";

export const AdminRoute = ({ component: Component, ...rest }) => {
  const [state] = useContext(AppContext);
  const isAdmin = state.isAdmin;

  return (
    <Route
      {...rest}
      render={(props) =>
        isAdmin ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

export default AdminRoute;
