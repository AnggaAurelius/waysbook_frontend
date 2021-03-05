import React, { useContext, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { AppContext } from "../../component/context/Global";

export const Loading = () => {
  const history = useHistory();
  const [state] = useContext(AppContext);
  const { back } = useParams();
  useEffect(() => {
    if (state.isLogin) {
      history.push(`/${back}`);
    }
  }, []);
  return (
    <div>
      <p className="text-center">Loading . . . </p>
    </div>
  );
};
