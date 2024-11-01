"use client";
import { useEffect, useState } from "react";
import classes from "../Form.module.scss";
import { useRouter } from "next/navigation";
import { ReactSVG } from "react-svg";
import clsx from "clsx";
import Validator from "@/utils/Validator";
import { forgotPassword, login } from "@/services/AuthServices";
import GoogleLoginCustom from "@/components/GoogleLoginCustom";
import Toast from "@/utils/Toaster";

const ForgotPassword = () => {
  const router = useRouter();
  const [passwordEye, setPasswordEye] = useState(false);
  const [allowSubmit, setAllowSubmit] = useState(false);
  const [isSendCode, setIsSendCode] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    emailError: "",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let isSend = true;

    if (!formData.email) {
      alert("Please fill in all fields");
      return;
    }

    if (!Validator.isEmail(formData.email)) {
      setFormData((prev) => {
        return { ...prev, emailError: "Invalid email format" };
      });
      isSend = false;
    } else {
      setFormData((prev) => {
        return { ...prev, emailError: "" };
      });
    }

    if (isSend) {
      await forgotPassword(formData.email).then((res: any) => {
        console.log(res);

        if (res.status === 200) {
          setIsSendCode(true);
        }
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

      {!isSendCode && (
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
            onClick={() => router.back()}
          >
            <ReactSVG src="/back-icon.svg"></ReactSVG>
          </button>
          <form action="" onSubmit={handleSubmit}>
            <div className={classes.logo}>
              <img src="/logo.gif" alt="logo" />
            </div>
            <h2 className={classes.hello}>Enter Email Address!</h2>
            <div className={clsx("position-relative", classes.input)}>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="off"
                placeholder="yourmail@gmail.com..."
              />
              {formData.emailError && (
                <div className={classes.error}>{formData.emailError}</div>
              )}
            </div>
            <button type="submit" className={clsx(classes.submitBtn)}>
              Send
            </button>
          </form>
        </div>
      )}

      {isSendCode && (
        <div className={clsx(classes.wrapper, classes.checkWrapper)}>
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
            onClick={() => router.back()}
          >
            <ReactSVG src="/back-icon.svg"></ReactSVG>
          </button>
          <div className={classes.checkLogo}>
            <ReactSVG src="/check.svg" />
          </div>
          <h2 className={classes.checkLabel}>Check your inbox!</h2>
          <button
            className={classes.backToLogin}
            onClick={() => router.push("/login")}
          >
            Back to login
          </button>
        </div>
      )}
    </>
  );
};

export default ForgotPassword;
