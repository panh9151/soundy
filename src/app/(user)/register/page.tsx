"use client";
import { useEffect, useState } from "react";
import classes from "../Form.module.scss";
import { useRouter } from "next/navigation";
import { ReactSVG } from "react-svg";
import clsx from "clsx";
import Validator from "@/utils/Validator";
import { login } from "@/services/AuthServices";
import GoogleLoginCustom from "@/components/GoogleLoginCustom";
import Toast from "@/utils/Toaster";

const Register = () => {
  const router = useRouter();
  const [passwordEye, setPasswordEye] = useState(false);
  const [allowSubmit, setAllowSubmit] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    emailError: "",
    password: "",
    passwordError: "",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let isSend = true;

    if (!formData.email || !formData.password) {
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

    if (!Validator.isPassword(formData.password)) {
      setFormData((prev) => {
        return {
          ...prev,
          passwordError: "Password length must between 6 and 40 words",
        };
      });
      isSend = false;
    } else
      setFormData((prev) => {
        return { ...prev, passwordError: "" };
      });

    if (isSend) {
      login(formData.email, formData.password)
        .then((data: any) => {
          console.log(data);

          if (data.status === 200) {
            localStorage.setItem(
              "accessToken",
              JSON.stringify(data?.result?.accessToken) || ""
            );
            // notifySuccess("Login successful");
            Toast.success("Login successful");
          } else if (data.status === 401) {
            Toast.error("Login failed");
          }
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
          <h2 className={classes.hello}>Let's start!</h2>
          <div className={clsx("position-relative", classes.input)}>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="off"
              placeholder="Email..."
            />
            {formData.emailError && (
              <div className={classes.error}>{formData.emailError}</div>
            )}
          </div>
          <div className={clsx("position-relative", classes.input)}>
            <input
              type={clsx({ password: !passwordEye, text: passwordEye })}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="off"
              placeholder="Password..."
            />
            <div
              className={classes.eye}
              onClick={() => setPasswordEye((prev) => !prev)}
            >
              {!passwordEye && <ReactSVG src="/close eye.svg"></ReactSVG>}
              {passwordEye && <ReactSVG src="/solid eye.svg"></ReactSVG>}
            </div>
            {formData.passwordError && (
              <div className={classes.error}>{formData.passwordError}</div>
            )}
          </div>
          <div className={clsx("position-relative", classes.input)}>
            <input
              type={clsx({ password: !passwordEye, text: passwordEye })}
              id="resetPassword"
              name="resetPassword"
              value={(formData as any).resetPassword}
              onChange={handleChange}
              autoComplete="off"
              placeholder="Repeat password..."
            />
            <div
              className={classes.eye}
              onClick={() => setPasswordEye((prev) => !prev)}
            >
              {!passwordEye && <ReactSVG src="/close eye.svg"></ReactSVG>}
              {passwordEye && <ReactSVG src="/solid eye.svg"></ReactSVG>}
            </div>
            {formData.passwordError && (
              <div className={classes.error}>{formData.passwordError}</div>
            )}
          </div>
          <div className={classes.loginOption}>
            <button type="button" onClick={() => router.push("/login")}>
              Already have an account?
            </button>
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
            >
              Forgot password?
            </button>
          </div>
          <button type="submit" className={clsx(classes.submitBtn)}>
            Create Account
          </button>
          {/* <div className={classes.orLabel}>or</div> */}
          <GoogleLoginCustom></GoogleLoginCustom>
        </form>
      </div>
    </>
  );
};

export default Register;
