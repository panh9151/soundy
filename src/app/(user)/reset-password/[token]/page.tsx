"use client";
import { useEffect, useState } from "react";
import classes from "../../Form.module.scss";
import { useRouter } from "next/navigation";
import { ReactSVG } from "react-svg";
import clsx from "clsx";
import Validator from "@/utils/Validator";
import { login, resetPassword } from "@/services/AuthServices";
import GoogleLoginCustom from "../../../../components/GoogleLoginCustom";
import Toast from "@/utils/Toaster";

const Login = ({ params }: { params: { token: string } }) => {
  const router = useRouter();
  const [passwordEye, setPasswordEye] = useState(false);
  const [allowSubmit, setAllowSubmit] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: "",
    newPasswordError: "",
    rePassword: "",
    rePasswordError: "",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let isSend = true;

    if (!Validator.isPassword(formData.newPassword)) {
      setFormData((prev) => {
        return {
          ...prev,
          newPasswordError: "Password length must between 6 and 40 words",
        };
      });
      isSend = false;
    } else
      setFormData((prev) => {
        return { ...prev, passwordError: "" };
      });

    if (formData.newPassword !== formData.rePassword) {
      setFormData((prev) => {
        return {
          ...prev,
          rePasswordError: "Password do not match",
        };
      });
      isSend = false;
    } else {
      setFormData((prev) => {
        return {
          ...prev,
          rePasswordError: "",
        };
      });
    }

    if (isSend) {
      resetPassword(formData.newPassword, params.token)
        .then((data: any) => {
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const closeOverlayHandle = () => {
    router.push("/");
  };

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      router.push("/");
    }
  }, [localStorage.getItem("accessToken")]);

  return (
    <>
      <div className={classes.background} onClick={closeOverlayHandle}></div>
      <div className={classes.wrapper}>
        <button
          type="button"
          className={classes.closeBtn}
          onClick={closeOverlayHandle}
        >
          <ReactSVG src="/close.svg"></ReactSVG>
        </button>
        <button
          type="button"
          className={clsx(classes.closeBtn, classes.closeBtn__left)}
          onClick={() => router.push("/login")}
        >
          <ReactSVG src="/back-icon.svg"></ReactSVG>
        </button>
        <form action="" onSubmit={handleSubmit}>
          <div className={classes.logo}>
            <img src="/logo.gif" alt="logo" />
          </div>
          <h2 className={classes.hello}>Enter your new password!</h2>
          <div className={clsx("position-relative", classes.input)}>
            <input
              type={clsx({ password: !passwordEye, text: passwordEye })}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              autoComplete="off"
              placeholder="New password..."
            />
            <div
              className={classes.eye}
              onClick={() => setPasswordEye((prev) => !prev)}
            >
              {!passwordEye && <ReactSVG src="/close eye.svg"></ReactSVG>}
              {passwordEye && <ReactSVG src="/solid eye.svg"></ReactSVG>}
            </div>
            {formData.newPasswordError && (
              <div className={classes.error}>{formData.newPasswordError}</div>
            )}
          </div>
          <div className={clsx("position-relative", classes.input)}>
            <input
              type={clsx({ password: !passwordEye, text: passwordEye })}
              id="rePassword"
              name="rePassword"
              value={formData.rePassword}
              onChange={handleChange}
              autoComplete="off"
              placeholder="Re-password..."
            />
            <div
              className={classes.eye}
              onClick={() => setPasswordEye((prev) => !prev)}
            >
              {!passwordEye && <ReactSVG src="/close eye.svg"></ReactSVG>}
              {passwordEye && <ReactSVG src="/solid eye.svg"></ReactSVG>}
            </div>
            {formData.rePasswordError && (
              <div className={classes.error}>{formData.rePasswordError}</div>
            )}
          </div>
          <button type="submit" className={clsx(classes.submitBtn)}>
            Change password
          </button>
          {/* <div className={classes.orLabel}>or</div> */}
          <GoogleLoginCustom></GoogleLoginCustom>
        </form>
      </div>
    </>
  );
};

export default Login;
