import Group from "../../utils/interfaces/db/group.ts";
import { prisma } from "../../utils/db.ts";
import { imageToDataUrl } from "../../utils/images/image-source.ts";

type PopulatedStudent = {
  _id: string | { toString(): string };
  firstname?: string;
  lastname?: string;
  email?: string;
  avatar?: Buffer | Uint8Array | string | null;
};

type PopulatedGroup = {
  _id: string | { toString(): string };
  users?: PopulatedStudent[];
};

/**
 * Liste les devoirs encore ouverts dans les seuls modules affectés au
 * formateur, puis rapproche les groupes MongoDB des remises PostgreSQL.
 */
export async function getTeacherUpcomingAssignments(
  moduleIds: readonly number[],
  now = new Date(),
) {
  const assignments = await prisma.courseAssignment.findMany({
    where: {
      dueAt: { gte: now },
      course: {
        isPublished: true,
        visibility: true,
        moduleId: { in: [...moduleIds] },
      },
    },
    orderBy: [{ dueAt: "asc" }, { id: "asc" }],
    select: {
      id: true,
      dueAt: true,
      maxScore: true,
      course: {
        select: {
          id: true,
          title: true,
          module: {
            select: {
              id: true,
              title: true,
              parcours: {
                select: {
                  id: true,
                  title: true,
                  groups: {
                    select: { group: { select: { idMdb: true } } },
                  },
                },
              },
            },
          },
        },
      },
      submissions: {
        select: {
          id: true,
          submittedAt: true,
          grade: true,
          gradedAt: true,
          student: { select: { idMdb: true } },
        },
      },
    },
  });

  const groupIds = [
    ...new Set(
      assignments.flatMap((assignment) =>
        assignment.course.module.parcours.groups.map(
          ({ group }) => group.idMdb,
        ),
      ),
    ),
  ];
  const groups =
    groupIds.length === 0
      ? []
      : ((await Group.find({ _id: { $in: groupIds } })
          .populate("users", {
            _id: 1,
            firstname: 1,
            lastname: 1,
            email: 1,
            avatar: 1,
          })
          .lean()) as unknown as PopulatedGroup[]);
  const studentsByGroup = new Map(
    groups.map((group) => [String(group._id), group.users ?? []]),
  );

  return assignments.map((assignment) => {
    const submissionsByStudent = new Map(
      assignment.submissions.map(({ student, ...submission }) => [
        student.idMdb,
        submission,
      ]),
    );
    const students = new Map<string, PopulatedStudent>();

    assignment.course.module.parcours.groups.forEach(({ group }) => {
      studentsByGroup.get(group.idMdb)?.forEach((student) => {
        students.set(String(student._id), student);
      });
    });

    const { groups: _groups, ...parcours } =
      assignment.course.module.parcours;
    const { submissions: _submissions, ...assignmentData } = assignment;

    return {
      ...assignmentData,
      course: {
        ...assignment.course,
        module: { ...assignment.course.module, parcours },
      },
      students: [...students.values()]
        .map((student) => {
          const id = String(student._id);
          return {
            id,
            firstname: student.firstname?.trim() ?? "",
            lastname: student.lastname?.trim() ?? "",
            email: student.email?.trim() ?? "",
            avatar: imageToDataUrl(student.avatar),
            submission: submissionsByStudent.get(id) ?? null,
          };
        })
        .sort((first, second) =>
          `${first.lastname} ${first.firstname}`.localeCompare(
            `${second.lastname} ${second.firstname}`,
            "fr",
            { sensitivity: "base" },
          ),
        ),
    };
  });
}
