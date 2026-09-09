import { useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import apiClient from "../../../lib/axios";
import type Module from "../../../utils/interfaces/module";
import type CourseDates from "../../course/interfaces/course-dates";
import { calendarDay, shiftCalendarDate } from "../../calendar/components/planning-utils";

export type CalendarCourse = { id: number; dates: CourseDates[]; };
const EMPTY_COURSES: CalendarCourse[] = [];

export type CalendarSelection = { courseId: number; eventId: string; rect?: DOMRect; showDetails?: boolean; };

export const dateInputValue = (value: string) => value.slice(0, 10);
export const localCalendarDate = (value: string) => new Date(`${dateInputValue(value)}T00:00:00`);
export const calendarDateISO = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T00:00:00.000Z`;

export default function useModuleCalendar(module: Module | undefined, enabled: boolean) {
  const client = useQueryClient();
  const [selection, setSelection] = useState<CalendarSelection | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSaving, setIsSaving] = useState(false);
  const saving = useRef(false);
  const key = ["module-calendar", module?.id, module?.courses.map(course => course.id)];
  const query = useQuery({
    queryKey: key,
    enabled: enabled && Boolean(module?.id),
    queryFn: async (): Promise<CalendarCourse[]> => {
      const res = await apiClient.post(`/course/calendar/${module!.id}/initialize`);
      return res.data;
    },
    refetchOnWindowFocus: false,
  });
  const courses = query.data ?? EMPTY_COURSES;
  const datesByCourse = new Map(courses.map(course => [course.id, course.dates]));
  const events = useMemo(() => courses.flatMap(course => {
    const source = module?.courses.find(item => item.id === course.id);
    return course.dates.map((date, index) => ({
      id: `${course.id}:${index}`,
      title: source?.title ?? "Cours",
      startDate: localCalendarDate(date.minDate),
      endDate: localCalendarDate(date.maxDate),
    }));
  }), [courses, module?.courses]);

  const selectCourse = (courseId: number) => {
    if (isAdding || saving.current) return;
    const event = events
      .filter(item => item.id.startsWith(`${courseId}:`))
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())[0];
    if (!event) return;
    setCurrentDate(event.startDate);
    setSelection({ courseId, eventId: event.id, showDetails: false });
  };

  const saveDates = async (courseId: number, dates: CourseDates[]) => {
    if (saving.current) return false;
    saving.current = true;
    setIsSaving(true);
    await client.cancelQueries({ queryKey: key });
    const previous = client.getQueryData<CalendarCourse[]>(key);
    client.setQueryData<CalendarCourse[]>(key, previous?.map(course =>
      course.id === courseId ? { ...course, dates } : course,
    ));
    try {
      // Une seule écriture atomique, sans suppression puis recréation des plages.
      const response = await apiClient.put<CalendarCourse>(`/course/calendar/${courseId}/dates`, {
        dates: dates.map((date, index) => ({ ...date, id: date.id ?? index + 1 })),
      });
      client.setQueryData<CalendarCourse[]>(key, previous => previous?.map(course => course.id === courseId ? response.data : course));
      void client.invalidateQueries({ queryKey: ["course", String(courseId)] });
      void client.invalidateQueries({ queryKey: ["courses"] });
      void client.invalidateQueries({ queryKey: ["read-calendar"] });
      return true;
    } catch {
      client.setQueryData(key, previous);
      toast.error("Impossible d'enregistrer les dates du cours. Réessayez.");
      return false;
    } finally {
      saving.current = false;
      setIsSaving(false);
    }
  };

  const addCourse = async (courseId: number) => {
    if (!isAdding || isSaving || !datesByCourse.has(courseId) || datesByCourse.get(courseId)?.length) return;
    setIsAdding(false);
    const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const date = {
      id: 1,
      minDate: calendarDateISO(start),
      maxDate: calendarDateISO(shiftCalendarDate(start, 6)),
      synchroneDuration: 0,
      asynchroneDuration: 0
    };
    if (await saveDates(courseId, [date])) {
      setSelection({ courseId, eventId: `${courseId}:0` });
    }
  };

  const changeDates = async (id: number | string, start: Date, end: Date) => {
    const [courseId, index] = String(id).split(":").map(Number);
    const dates = datesByCourse.get(courseId);
    if (!dates || !dates[index] || calendarDay(start) > calendarDay(end)) return;
    await saveDates(courseId, dates.map((date, i) => i === index ? {
      ...date, minDate: calendarDateISO(start), maxDate: calendarDateISO(end),
    } : date));
  };

  return {
    ...query, events, datesByCourse, selection, setSelection, isAdding, setIsAdding,
    currentDate, setCurrentDate, isSaving, saveDates, addCourse, changeDates, selectCourse,
    orphanIds: courses.filter(course => course.dates.length === 0).map(course => course.id),
  };
}

export type ModuleCalendarStore = ReturnType<typeof useModuleCalendar>;
