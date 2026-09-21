import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Sparkles } from "lucide-react";
import { Link } from "react-router";
import { dashboardIAApi } from "../../features/dashboard-ia/api/dashboardIA.api";
import { sidebarControlClassName } from "./sidebar-styles";

export default function AiConsumptionPopover() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const { data, isLoading, isError } = useQuery({ queryKey: ["dashboard-ia-total-tokens"], queryFn: dashboardIAApi.queries.getTotalTokens, enabled: open });
  return <Popover.Root open={open} onOpenChange={setOpen}>
    <Popover.Trigger asChild><button type="button" className={`${sidebarControlClassName} max-2xl:tooltip max-2xl:tooltip-right`} data-tip="Consommation IA" aria-label="Consommation IA"><Sparkles className="size-4 shrink-0" /><span className="2xl:block hidden">Consommation IA</span></button></Popover.Trigger>
    <Popover.Portal forceMount><AnimatePresence>{open && <Popover.Content asChild forceMount side="right" align="end" sideOffset={20} collisionPadding={12}>
      <motion.div initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96, x: reduceMotion ? 0 : -6 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.98, x: -4 }} transition={{ duration: reduceMotion ? 0.01 : 0.2 }} className="z-50 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-base-300 bg-base-100 p-4 text-base-content shadow-xl outline-none" aria-label="Consommation IA">
        <h2 className="font-semibold">Consommation IA</h2>
        {isLoading ? <p className="mt-3 text-sm">Chargement…</p> : isError ? <p role="alert" className="mt-3 text-sm">Impossible de charger la consommation.</p> : <div className="mt-3 rounded-lg bg-base-200 p-3"><p className="text-sm text-base-content/70">Tokens utilisés</p><p className="text-2xl font-bold">{(data?.totalTokens ?? 0).toLocaleString("fr-FR")}</p><p className="mt-1 text-xs text-base-content/60">Ce mois-ci : {(data?.totalCurrentMonthTokens ?? 0).toLocaleString("fr-FR")}</p></div>}
        <Link to="/admin/dashboard-ia" className="btn btn-primary btn-sm mt-4 w-full" onClick={() => setOpen(false)}>Voir le Dashboard IA</Link>
      </motion.div>
    </Popover.Content>}</AnimatePresence></Popover.Portal>
  </Popover.Root>;
}
