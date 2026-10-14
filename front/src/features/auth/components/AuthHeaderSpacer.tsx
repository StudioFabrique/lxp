/** Empty room of the login logo and caption, so loading placeholders sit where the login form does. */
export default function AuthHeaderSpacer() {
  return (
    <>
      <div aria-hidden="true" className="mt-20 aspect-[900/280] w-64 max-w-full" />
      <div aria-hidden="true" className="mt-2 h-8" />
    </>
  );
}
