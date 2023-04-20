export const setLoginFormClasses = (value: boolean) => {
  return value
    ? "rounded-xs bg-red-500/30 p-[20px] pl-[30px] w-full placeholder:text-purple-discrete"
    : "rounded-xs bg-purple-light p-[20px] pl-[30px] w-full placeholder:text-purple-discrete";
};
