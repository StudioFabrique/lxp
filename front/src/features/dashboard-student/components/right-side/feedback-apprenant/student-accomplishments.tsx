import { useQuery } from "@tanstack/react-query";
import { dashboardStudentApi } from "../../../api/dashboard-student.api";
import Item from "./item";
import { Accomplishment } from "../../../interfaces/accomplishment";
import Loader from "../../../../../components/loaders/Loader";
import BoxWrapper from "../../../../../components/wrappers/BoxWrapper";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const StudentAccomplishments = () => {
  const [removedIds, setRemovedIds] = useState<number[]>([]);
  const reduceMotion = useReducedMotion();
  const { data: accomplishments, isLoading } = useQuery({
    queryKey: ["accomplishments"],
    queryFn: dashboardStudentApi.queries.getAccomplishments,
    select: (data) => data.data as Accomplishment[],
  });
  const visibleAccomplishments = accomplishments?.filter(
    (item) => !removedIds.includes(item.id),
  );

  const handleRemove = (id: number) => {
    setRemovedIds((current) => [...current, id]);
  };

  return (
    <BoxWrapper className="h-87.5 items-center gap-5">
      <p className="font-bold self-start">Derniers feedback des apprenants</p>
      <div className="flex flex-col w-full gap-5 carousel carousel-vertical">
        {isLoading ? (
          <Loader variant="rows" label="Chargement des feedbacks" />
        ) : (
          // Toujours monté : si la liste se vide, le dernier item joue sa
          // sortie avant que « Aucun feedback » n'apparaisse (mode "wait").
          <AnimatePresence mode="wait" initial={false}>
            {visibleAccomplishments && visibleAccomplishments.length > 0 ? (
              visibleAccomplishments.map((item) => (
                // Zoom arrière à la sortie.
                <motion.div
                  key={item.id}
                  layout="position"
                  exit={
                    reduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.8 }
                  }
                  transition={{
                    duration: reduceMotion ? 0.01 : 0.35,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  <Item accomplishment={item} onRemove={handleRemove} />
                </motion.div>
              ))
            ) : (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reduceMotion ? 0.01 : 0.25 }}
              >
                Aucun feedback
              </motion.p>
            )}
          </AnimatePresence>
        )}
      </div>
    </BoxWrapper>
  );
};

export default StudentAccomplishments;
