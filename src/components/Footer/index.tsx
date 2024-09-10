import { AppContext } from "@/app/layout";
import { useContext } from "react";
import classes from "./Footer.module.scss";

const Footer = () => {
  const { state, dispatch } = useContext(AppContext);
  console.log(state.playingMusic);

  return (
    <div className={classes.footer}>
      {/* <div className={classes.musicWrapper}>
        <div className={classes.thumbnail}>
          <img src={state.playingMusic.author.thumbnail} alt="" />
        </div>
        <div className={classes.title}>{state.playingMusic.title}</div>
      </div> */}
    </div>
  );
};

export default Footer;
