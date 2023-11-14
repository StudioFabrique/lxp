import React, { FC } from "react";

import styles from "./fade-wrapper.module.scss";

type Props = { children: React.ReactNode };

const FadeWrapper: FC<Props> = (props) => {
  return <div className={styles.content}>{props.children}</div>;
};

export default FadeWrapper;
