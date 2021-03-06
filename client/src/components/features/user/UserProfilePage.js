import React from "react";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import {
  selectEmailOfUser,
  selectUsernameOfUser
} from "../../actions/userSelectors";
import UserProfile from "./UserProfile";

const UserProfilePage = () => {
  const username = useSelector(selectUsernameOfUser);
  const email = useSelector(selectEmailOfUser);

  const user = username || email || "User";

  return (
    <>
      <Helmet>
        <title>{`${user} | Palitras`}</title>
      </Helmet>
      <UserProfile />
    </>
  );
};

export default UserProfilePage;
