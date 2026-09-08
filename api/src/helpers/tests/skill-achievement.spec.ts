import {
  isModuleCompleted,
  skillAchievementSelect,
  withSkillAchievement,
} from "../skill-achievement.ts";

const done = { lessonsRead: [{ finishedAt: new Date() }] };
const unfinished = { lessonsRead: [{ finishedAt: null }] };
const moduleWith = (...lessons: typeof unfinished[]) => ({ id: 2, title: "Module 2", courses: [{ lessons }] });

describe("Obtention des badges", () => {
  it("attend la fin de tous les modules liés", () => {
    const skill = {
      id: 1,
      modules: [
        { module: { id: 1, title: "Module 1", courses: [{ lessons: [done] }] } },
        { module: moduleWith(unfinished) },
      ],
    };
    expect(withSkillAchievement(skill).isEarned).toBe(false);
    expect(withSkillAchievement(skill)).toMatchObject({
      totalModules: 2,
      completedModules: 1,
      modules: [
        { id: 1, title: "Module 1", progress: 100, isCompleted: true },
        { id: 2, title: "Module 2", progress: 0, isCompleted: false },
      ],
    });
    skill.modules[1] = { module: { id: 2, title: "Module 2", courses: [{ lessons: [done] }] } };
    expect(withSkillAchievement(skill)).toMatchObject({ id: 1, isEarned: true, completedModules: 2, totalModules: 2 });
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
