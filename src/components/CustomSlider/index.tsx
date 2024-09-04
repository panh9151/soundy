import clsx from "clsx";
import classes from "./CustomSlider.module.scss";
import { ReactSVG } from "react-svg";

const CustomSlider = ({
  value = 0,
  thumbSize = "1.2rem",
  height = ".8rem",
  width = "100%",
  maxValue = 1,
  minValue = 0,
  step = 0.02,
  onChange,
  color = "#ccc",
  leftColor = "var(--primary-color)",
  thumbColor = "#f9f9f9",
  // thumbColorActive = "var(--primary-color)",
  disableOption = false,
  thumbIcon,
  ...props
}: any) => {
  if (typeof value !== "number") value = maxValue / 2;

  return (
    <div
      className={clsx(classes.sliderWrapper, {
        // [classes.sliderWrapper__disable]: disableOption,
      })}
      style={
        {
          "--thumb-size": thumbSize,
          "--height": height,
          "--width": width,
          "--max-value": maxValue,
          "--min-value": minValue,
          "--value": value,
          "--step": step,
          "--color": color,
          "--thumb-color": thumbColor,
          "--left-color": leftColor,
        } as any
      }
    >
      <input
        type="range"
        min={minValue}
        max={maxValue}
        step={step}
        value={Math.max(value || 0)}
        onChange={onChange}
        className={clsx(classes.volumnTracker, props?.className)}
        {...props}
      />
      <div className={classes.leftLayer}></div>
      {thumbIcon && (
        <ReactSVG
          className={clsx(classes.thumbIcon, classes.fill)}
          src={thumbIcon}
        />
      )}
    </div>
  );
};

export default CustomSlider;
