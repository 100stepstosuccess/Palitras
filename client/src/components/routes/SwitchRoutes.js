import React, { lazy, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const Login = lazy(() =>
  import(/*webpackChunkName: "Login"*/ "../pages/Login")
);

const SignUp = lazy(() =>
  import(/*webpackChunkName: "SignUp"*/ "../pages/SignUp")
);

const ResetPassword = lazy(() =>
  import(/*webpackChunkName: "ResetPassword"*/ "../pages/ResetPassword")
);

const Picture = lazy(() =>
  import(/*webpackChunkName: "Picture"*/ "../pages/Picture")
);

const Home = lazy(() =>
  import(/*webpackChunkName: "Home"*/ "../features/home/Home")
);

const AddPicture = lazy(() =>
  import(
    /*webpackChunkName: "AddPicture"*/ "../features/adding-picture/AddPicture"
  )
);

const NotFound = lazy(() =>
  import(/*webpackChunkName: "NotFound"*/ "../pages/NotFound")
);

const Favorites = lazy(() =>
  import(/*webpackChunkName: "Favorites"*/ "../features/favorites/Favorites")
);

const UserProfilePage = lazy(() =>
  import(
    /*webpackChunkName: "UserProfilePage"*/ "../features/user/UserProfilePage"
  )
);

const MyPictures = lazy(() =>
  import(/*webpackChunkName: "MyPictures"*/ "../pages/MyPictures")
);

const EditPicturePage = lazy(() =>
  import(
    /*webpackChunkName: "EditPicturePage"*/ "../features/editting-picture/EditPicturePage"
  )
);

const NotificationsPage = lazy(() =>
  import(
    /*webpackChunkName: "NotificationsPage"*/ "../features/notifications/NotificationsPage"
  )
);

const SwitchRoutes = () => {
  return (
    <Suspense fallback={<div>...loading</div>}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/pictures/:id" component={Picture} />
        <Route path="/users/:id" component={UserProfilePage} />
        <ProtectedRoute path="/notifications" component={NotificationsPage} />
        <ProtectedRoute exact path="/account/upload" component={AddPicture} />
        <ProtectedRoute
          exact
          path="/account/my-pictures"
          component={MyPictures}
        />
        <ProtectedRoute exact path="/account/favorites" component={Favorites} />
        <ProtectedRoute
          exact
          path="/edit-picture/:id"
          component={EditPicturePage}
        />
        <ProtectedRoute
          path="/login"
          protectAuth="true"
          component={Login}
          exact
        />
        <ProtectedRoute
          path="/sign-up"
          protectAuth="true"
          component={SignUp}
          exact
        />
        <ProtectedRoute
          path="/forgot-password"
          protectAuth="true"
          component={ResetPassword}
          exact
        />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
};

export default SwitchRoutes;
