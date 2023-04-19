import Form from "./form";
const Login = () => {
  return (
    <div className="h-full flex flex-row justify-between font-inter text-pink bg-gradient-to-b from-[#76284e] to-[#202237]">
      <div className="w-[73.5%] flex flex-col text-pink-900 justify-between bg-white rounded-r-[50px] p-20 pl-15 max-sm:p-2">
        <div className="text-[14pt] font-bold flex flex-col">
          <h1 className="text-[80pt] -mb-8 -m-2">LXP</h1>
          <h2>LEARNING EXPERIENCE PLATFORM</h2>
        </div>
        <Form />
        <div className="flex flex-row gap-x-2">
          <img className="h-8" src="connexion/info.svg" alt="" />
          <button className="text-[10pt]">Besoin d'aide?</button>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 max-w-[47%] max-md:max-w-[80%] max-md:-right-[20%] max-sm:-right-[19%] max-sm:max-w-[80%] pointer-events-none">
        <img src="connexion/BG-side.png" alt="" />
      </div>
    </div>
  );
};
export default Login;