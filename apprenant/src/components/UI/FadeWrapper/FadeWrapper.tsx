import React, { FC } from "react";

import styles from "./FadeWrapper.module.css";

type Props = { children: React.ReactNode };

const FadeWrapper: FC<Props> = (props) => {
  return <div className={styles.content}>{props.children}</div>;
};

export default FadeWrapper;
