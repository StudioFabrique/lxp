import { useContext, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Brain } from "lucide-react";
import toast from "react-hot-toast";
import AndriaLogoLightMode from "../../../assets/andria-logo/logo-lightmode.svg";
import AndriaLogoDarkMode from "../../../assets/andria-logo/logo-darkmode.svg";
import { AuthContext } from "../../../store/AuthProvider";
import { ThemeContext } from "../../../store/ThemeProvider";
import OnboardingProgressPanel from "../../../components/UI/OnboardingProgressPanel";
import CursorGlowCard from "../../../components/UI/cursor-glow-card";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import ThemeSelectionStep from "../../learning-profile/ThemeSelectionStep";
import DropoutPreferencesForm from "../../dashboard-ia/components/DropoutPreferencesForm";
import { dashboardIAApi } from "../../dashboard-ia/api/dashboardIA.api";
import { staffOnboardingApi } from "../api/staff-onboarding.api";
import Loader from "../../../components/loaders/Loader";

export default function StaffOnboarding() {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const client = useQueryClient();
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const admin = user?.roles?.[0]?.rank === 1;
  const adminStatus = useQuery({ queryKey: ["staff-onboarding"], queryFn: staffOnboardingApi.get, enabled: admin });
  const teacherStatus = useQuery({ queryKey: ["dropout-preferences"], queryFn: dashboardIAApi.queries.getDropoutPreferences, enabled: !admin });
  const required = admin ? adminStatus.data?.required : teacherStatus.data?.onboardingRequired;

  if (admin ? adminStatus.isPending : teacherStatus.isPending) return <Loader />;
  if (admin ? adminStatus.isError : teacherStatus.isError) return <div role="alert" className="m-auto flex flex-col items-center gap-3">
    <p>Impossible de charger votre accueil.</p>
    <button type="button" className="btn btn-primary" onClick={() => void (admin ? adminStatus.refetch() : teacherStatus.refetch())}>Réessayer</button>
  </div>;
  if (!required) return <Navigate to="/admin/dashboard" replace />;

  const finishAdmin = async () => {
    setSaving(true);
    try {
      await staffOnboardingApi.complete();
      client.setQueryData(["staff-onboarding"], { required: false });
      navigate("/admin/dashboard", { replace: true });
    } catch {
      toast.error("Impossible d'enregistrer votre accueil.");
    } finally {
      setSaving(false);
    }
  };

  const teacherCompleted = () => navigate("/admin/dashboard", { replace: true });
  const isWelcome = step === 0;
  return <LayoutGroup>
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <motion.div layout transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={isWelcome ? "mb-12 mt-[clamp(5rem,15vh,10rem)] flex flex-col items-center gap-2 text-center" : "mb-10 mt-0 flex flex-col items-center gap-2 text-center"}>
        <img className="h-auto w-56" src={theme === "light" ? AndriaLogoLightMode : AndriaLogoDarkMode} alt="logo ANDRIA" />
        <span className="mt-2 max-w-xs text-xs font-semibold text-base-content">Apprentissage Numérique &amp; Développement Renforcé par Intelligence Artificielle</span>
      </motion.div>
      {isWelcome ? <motion.section className="flex w-full flex-1 flex-col text-center" initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl font-bold">Bienvenue sur ANDRIA</h1>
          <p className="mt-5 text-sm leading-6 text-base-content/70">{admin
            ? "Préparez votre espace d’administration en choisissant votre thème. Vous pourrez le modifier plus tard depuis votre profil."
            : "Personnalisez votre espace et choisissez si vous souhaitez activer l’analyse automatique du décrochage pour vos parcours."}</p>
        </div>
        <button type="button" className="btn btn-primary mt-9 w-full gap-2 rounded-lg" onClick={() => setStep(1)}>Commencer <ArrowRight className="size-4" /></button>
      </motion.section> : <motion.div className="flex min-h-0 flex-1 flex-col" initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.45 }}>
        <OnboardingProgressPanel contentKey={String(step)} currentStep={step} stepCount={admin ? 1 : 2}
          progressLabel="Progression de l’accueil" className="min-h-[600px] flex-none lg:min-h-0 lg:flex-1"
          footer={step === 1 ? <div className="mt-5 flex justify-between border-t border-base-300 pt-4">
            <button type="button" className="btn btn-ghost text-base normal-case" onClick={() => setStep(0)}>Précédent</button>
            <button type="button" className="btn btn-primary text-base normal-case" disabled={saving} onClick={() => admin ? void finishAdmin() : setStep(2)}>{admin ? "Terminer" : "Continuer"}</button>
          </div> : undefined}>
          {step === 1 ? <ThemeSelectionStep /> : <div className="flex flex-1 flex-col gap-5">
            <div><h1 className="text-2xl font-bold">Analyse automatique du décrochage</h1>
              <p className="mt-2 text-sm text-base-content/70">Choisissez si les apprenants de vos parcours doivent être analysés chaque semaine. Vous pouvez modifier ce choix à tout moment dans le tableau de bord IA.</p></div>
            <CursorGlowCard autoGlow glowColor="primary" className="rounded-lg"><BoxWrapper className="h-auto items-center text-center">
              <Brain className="size-10 text-primary" aria-hidden="true" />
              <p>Vous recevrez un récapitulatif uniquement lorsqu’un de vos groupes présente un cas critique.</p>
            </BoxWrapper></CursorGlowCard>
            {teacherStatus.data && <DropoutPreferencesForm initial={teacherStatus.data} onSaved={teacherCompleted} onBack={() => setStep(1)} submitLabel="Terminer" />}
          </div>}
        </OnboardingProgressPanel>
      </motion.div>}
    </div>
  </LayoutGroup>;
}
