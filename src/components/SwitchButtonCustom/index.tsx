import clsx from "clsx";
import classes from "./SwitchButtonCustom.module.scss";
import { useState } from "react";

const SwitchButtonCustom = ({
  value = true,
  onchange,
  leftIcon,
  rightIcon,
  leftBackground = "#ccc",
  rightBackground = "blue",
  height = "3.2rem",
  width = "5.6rem",
  thumbSize = "2.4rem",
  leftThumbColor = "#fff",
  rightThumbColor = leftThumbColor,
  thumbMargin,
  id,
  type = "double",
  itemList,
}: any) => {
  if (!thumbMargin) thumbMargin = `calc((${height} - ${thumbSize}) / 2)`;

  if (type === "double") {
    return (
      <label
        className={classes.switchBtn}
        style={
          {
            "--width": width,
            "--height": height,
            "--left-background": leftBackground,
            "--right-background": rightBackground,
            "--thumb-size": thumbSize,
            "--left-thumb-color": leftThumbColor,
            "--right-thumb-color": rightThumbColor,
            "--thumb-margin": thumbMargin,
          } as any
        }
        htmlFor={id}
      >
        <div
          className={clsx(classes.base, {
            [classes.left]: !value,
            [classes.right]: value,
          })}
        >
          <input
            className={classes.checkbox}
            hidden
            type="checkbox"
            value={value as any}
            id={id}
            onChange={onchange}
          />
          <span className={classes.icons}>
            <div className={clsx(classes.icon, classes.icon__left)}>
              {leftIcon}
            </div>
            <div className={clsx(classes.icon, classes.icon__right)}>
              {rightIcon}
            </div>
          </span>
          <span className={classes.thumb}></span>
        </div>
      </label>
    );
  }

  if (type === "multi") {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (itemList) {
      return (
        <div
          className={classes.multiSwitchWrapper}
          style={
            {
              "--width": width,
              "--height": height,
              "--background": itemList[currentIndex].background,
              // "--index":
            } as any
          }
        >
          <div className={classes.multiItemWrapper}>
            {itemList.map((item: any, index: number) => {
              return (
                <div className={classes.multiItem} key={index}>
                  {item.icon}
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  }
};

export default SwitchButtonCustom;
