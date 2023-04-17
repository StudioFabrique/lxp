import styles from "./login.module.css";
const Login = () => (
  <div
    className={`h-full flex flex-row justify-between ${styles.bgapprenant} ${styles.font}`}
  >
    <div className="flex flex-col text-pink-900 justify-between w-[80%] bg-white rounded-r-[50px] p-20 pl-15">
      <div className="text-[14pt] font-bold flex flex-col">
        <h1 className="text-[80pt] -mb-8 -m-2">LXP</h1>
        <h2>LEARNING EXPERIENCE PLATFORM</h2>
      </div>
      <div className="w-[70%] flex flex-col gap-y-4">
        <p className="text-[14pt] font-bold">Se connecter</p>
        <input className={styles.input} type="text" placeholder="Identifiant" />
        <input
          className={styles.input}
          type="text"
          placeholder="Mot de passe"
        />
        <div className="flex flex-row justify-between mt-3">
          <button className="text-[8pt]">Mot de passe oublié?</button>
          <button className="bg-pink-900 p-3 rounded-md pr-6 pl-6 text-white text-[8pt]">
            Je me connecte
          </button>
        </div>
      </div>
      <div className="flex flex-row gap-x-2">
        <img className="h-8" src="connexion/info.svg" alt="" />
        <button className="text-[10pt]">Besoin d'aide?</button>
      </div>
    </div>
    <div className="fixed bottom-0 2xl:-right-[10%] max-2xl:-right-[8%] max-2xl:max-w-[50%] max-xl:max-w-[60%] max-xl:-right-[14%] max-md:max-w-[80%] max-md:-right-[25%] max-sm:-right-[25%] max-sm:max-w-[80%]">
      <img src="connexion/BG-side.png" alt="" />
    </div>
  </div>
);
export default Login;
