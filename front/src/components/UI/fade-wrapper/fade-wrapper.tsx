import { PropsWithChildren } from "react";

import styles from "./fade-wrapper.module.scss";

const FadeWrapper = (props: PropsWithChildren) => {
  return <div className={styles.content}>{props.children}</div>;
};

export default FadeWrapper;
