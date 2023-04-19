export const setLoginFormClasses = (value: boolean) => {
  return value
    ? "rounded-l-[15px] bg-red-500/30 p-[20px] pl-[30px] w-full placeholder:text-purple-discrete"
    : "rounded-l-[15px] bg-purple-light p-[20px] pl-[30px] w-full placeholder:text-purple-discrete";
};
