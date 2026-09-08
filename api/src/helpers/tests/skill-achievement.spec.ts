import {
  isModuleCompleted,
  skillAchievementSelect,
  withSkillAchievement,
} from "../skill-achievement.ts";

const done = { lessonsRead: [{ finishedAt: new Date() }] };
const unfinished = { lessonsRead: [{ finishedAt: null }] };
const moduleWith = (...lessons: typeof unfinished[]) => ({ courses: [{ lessons }] });

describe("Obtention des badges", () => {
  it("attend la fin de tous les modules liés", () => {
    const skill = {
      id: 1,
      modules: [
        { module: { courses: [{ lessons: [done] }] } },
        { module: moduleWith(unfinished) },
      ],
    };
    expect(withSkillAchievement(skill).isEarned).toBe(false);
    skill.modules[1] = { module: { courses: [{ lessons: [done] }] } };
    expect(withSkillAchievement(skill)).toEqual({ id: 1, isEarned: true });
  });

  it("ne valide pas une compétence sans module ou avec un module vide", () => {
    expect(withSkillAchievement({ modules: [] }).isEarned).toBe(false);
    expect(withSkillAchievement({ modules: [{ module: moduleWith() }] }).isEarned).toBe(false);
  });

  it("n'assimile pas une progression arrondie à 100 % à une complétion", () => {
    expect(isModuleCompleted({
      courses: [{ lessons: [...Array.from({ length: 200 }, () => done), unfinished] }],
    })).toBe(false);
  });

  it("filtre les lectures par étudiant et ne compte que les cours accessibles", () => {
    const courses = skillAchievementSelect("student-42").modules.select.module.select.courses;
    expect(courses.where).toEqual({ visibility: true, isPublished: true });
    expect(courses.select.lessons.select.lessonsRead.where).toEqual({
      student: { idMdb: "student-42" },
    });
  });
});
