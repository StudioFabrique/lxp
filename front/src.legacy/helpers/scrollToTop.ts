/**
 * Scrolls the window to the top of the page with a smooth animation.
 *
 * @remarks
 * This function uses the native `window.scrollTo` method with smooth scrolling behavior.
 * The scroll animation is handled by the browser.
 *
 * @returns void
 */
export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
