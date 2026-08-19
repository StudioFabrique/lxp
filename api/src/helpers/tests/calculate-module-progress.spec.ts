import {
  calculateCourseProgress,
  calculateModuleProgress,
  countCourseProgress,
  countLessonProgress,
  toProgressPercentage,
} from "../calculate-module-progress.ts";

const done = { lessonsRead: [{ finishedAt: new Date() }] };
const started = { lessonsRead: [{ finishedAt: null }] };
const untouched = { lessonsRead: [] };

describe("calculateCourseProgress", () => {
  it("compte les leçons terminées", () => {
    expect(
      calculateCourseProgress({ lessons: [done, done, started, untouched] }),
    ).toBe(50);
  });

  it("rend 0 pour un cours sans leçon plutôt que NaN", () => {
    expect(calculateCourseProgress({ lessons: [] })).toBe(0);
    expect(calculateCourseProgress({})).toBe(0);
  });

  it("ne dépasse jamais 100 % même avec plusieurs lectures", () => {
    // Avant la contrainte d'unicité (lessonId, studentId), une leçon pouvait
    // porter plusieurs LessonRead : les compter faisait déborder le total.
    const readTwice = {
      lessonsRead: [{ finishedAt: new Date() }, { finishedAt: new Date() }],
    };
    expect(calculateCourseProgress({ lessons: [readTwice, started] })).toBe(50);
  });
});

describe("calculateModuleProgress", () => {
  it("pondère par leçon et non par cours", () => {
    // Le cours court est fini, le long ne l'est pas : 2 leçons sur 20.
    const shortCourse = { lessons: [done, done] };
    const longCourse = { lessons: Array.from({ length: 18 }, () => started) };

    expect(calculateModuleProgress({ courses: [longCourse, shortCourse] })).toBe(
      10,
    );
  });

  it("ignore les cours vides sans fausser le total", () => {
    expect(
      calculateModuleProgress({
        courses: [{ lessons: [] }, { lessons: [done, started] }],
      }),
    ).toBe(50);
  });

  it("rend 0 pour un module sans cours", () => {
    expect(calculateModuleProgress({ courses: [] })).toBe(0);
    expect(calculateModuleProgress({})).toBe(0);
  });

  it("rend 100 quand tout est terminé", () => {
    expect(
      calculateModuleProgress({
        courses: [{ lessons: [done] }, { lessons: [done, done] }],
      }),
    ).toBe(100);
  });
});

describe("comptages intermédiaires", () => {
  it("expose le détail utilisé par les indicateurs", () => {
    expect(countLessonProgress([done, started])).toEqual({
      total: 2,
      completed: 1,
    });
    expect(
      countCourseProgress([{ lessons: [done] }, { lessons: [started, done] }]),
    ).toEqual({ total: 3, completed: 2 });
  });

  it("arrondit à l'entier le plus proche", () => {
    expect(toProgressPercentage({ total: 3, completed: 1 })).toBe(33);
    expect(toProgressPercentage({ total: 3, completed: 2 })).toBe(67);
  });
});
