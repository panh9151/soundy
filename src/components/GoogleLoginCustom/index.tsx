import { GoogleLogin } from "@react-oauth/google";
import classes from "./LoginGoogle.module.scss";

const GoogleLoginCustom = () => {
  const handleLoginSuccess = (response: any) => {
    console.log("Login Success:", response);
  };

  const handleLoginFailure = (error: any) => {
    console.error("Login Failed:", error);
  };

  return (
    <div className={classes.loginGoogleWrapper}>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        // onError={handleLoginFailure}
        useOneTap
      />
    </div>
  );
};

export default GoogleLoginCustom;
