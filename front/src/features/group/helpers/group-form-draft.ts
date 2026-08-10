import type { GroupFormValues } from "../group.schema";

const DRAFT_KEYS = {
  name: "groupName",
  description: "groupDescription",
  formationId: "groupFormation",
  parcoursId: "groupParcours",
  studentIds: "groupStudents",
  activeStudentIds: "groupActiveStudents",
} as const;

const parsePositiveInteger = (value: string | null) => {
  if (!value) return undefined;
  const parsedValue = Number(value);
  return Number.isInteger(parsedValue) && parsedValue > 0
    ? parsedValue
    : undefined;
};

export type GroupFormDraft = {
  values: Partial<GroupFormValues>;
  studentIds?: string[];
  activeStudentIds?: string[];
};

export const readGroupFormDraft = (
  searchParams: URLSearchParams,
): GroupFormDraft => {
  const values: Partial<GroupFormValues> = {};

  if (searchParams.has(DRAFT_KEYS.name)) {
    values.name = searchParams.get(DRAFT_KEYS.name) ?? "";
  }
  if (searchParams.has(DRAFT_KEYS.description)) {
    values.desc = searchParams.get(DRAFT_KEYS.description) ?? "";
  }

  const formationId = parsePositiveInteger(
    searchParams.get(DRAFT_KEYS.formationId),
  );
  const parcoursId = parsePositiveInteger(
    searchParams.get(DRAFT_KEYS.parcoursId),
  );
  if (formationId) values.formationId = formationId;
  if (parcoursId) values.parcoursId = parcoursId;

  const studentIds = searchParams.has(DRAFT_KEYS.studentIds)
    ? (searchParams.get(DRAFT_KEYS.studentIds) ?? "")
        .split(",")
        .filter(Boolean)
    : undefined;
  const activeStudentIds = searchParams.has(DRAFT_KEYS.activeStudentIds)
    ? (searchParams.get(DRAFT_KEYS.activeStudentIds) ?? "")
        .split(",")
        .filter(Boolean)
    : undefined;

  return { values, studentIds, activeStudentIds };
};

type CreateStudentUrlOptions = {
  pathname: string;
  currentSearchParams: URLSearchParams;
  values: GroupFormValues;
  students: Array<{ id: string; isActive: boolean }>;
};

export const createStudentUrlFromGroup = ({
  pathname,
  currentSearchParams,
  values,
  students,
}: CreateStudentUrlOptions) => {
  const returnSearchParams = new URLSearchParams();
  const sourceParcoursId = currentSearchParams.get("parcours");

  if (sourceParcoursId) {
    returnSearchParams.set("parcours", sourceParcoursId);
  }
  returnSearchParams.set(DRAFT_KEYS.name, values.name);
  returnSearchParams.set(DRAFT_KEYS.description, values.desc);
  if (values.formationId > 0) {
    returnSearchParams.set(DRAFT_KEYS.formationId, String(values.formationId));
  }
  if (values.parcoursId > 0) {
    returnSearchParams.set(DRAFT_KEYS.parcoursId, String(values.parcoursId));
  }
  returnSearchParams.set(
    DRAFT_KEYS.studentIds,
    students.map(({ id }) => id).join(","),
  );
  returnSearchParams.set(
    DRAFT_KEYS.activeStudentIds,
    students
      .filter(({ isActive }) => isActive)
      .map(({ id }) => id)
      .join(","),
  );

  const returnTo = `${pathname}?${returnSearchParams.toString()}`;
  const userSearchParams = new URLSearchParams({
    returnTo,
    roleRank: "3",
  });

  return `/admin/user/add?${userSearchParams.toString()}`;
};

const isGroupPath = (pathname: string) =>
  pathname === "/admin/group/add" ||
  /^\/admin\/group\/edit\/[^/]+$/.test(pathname);

export const getSafeGroupReturnPath = (returnTo: string | null) => {
  if (!returnTo || !returnTo.startsWith("/")) return null;

  const url = new URL(returnTo, "http://lxp.local");
  if (url.origin !== "http://lxp.local" || !isGroupPath(url.pathname)) {
    return null;
  }

  return `${url.pathname}${url.search}`;
};

export const addStudentToGroupReturnPath = (
  returnTo: string | null,
  studentId: string,
) => {
  const safeReturnTo = getSafeGroupReturnPath(returnTo);
  if (!safeReturnTo) return null;

  const url = new URL(safeReturnTo, "http://lxp.local");

  const studentIds = new Set(
    (url.searchParams.get(DRAFT_KEYS.studentIds) ?? "")
      .split(",")
      .filter(Boolean),
  );
  studentIds.add(studentId);
  url.searchParams.set(DRAFT_KEYS.studentIds, [...studentIds].join(","));

  return `${url.pathname}?${url.searchParams.toString()}`;
};
