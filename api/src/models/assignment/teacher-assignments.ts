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

export type ExpectedAssignmentStudent = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  avatar?: string | null;
};

type PopulatedGroup = {
  _id: string | { toString(): string };
  users?: PopulatedStudent[];
};

const sortExpectedStudents = (students: ExpectedAssignmentStudent[]) =>
  students.sort((first, second) =>
    `${first.lastname} ${first.firstname}`.localeCompare(
      `${second.lastname} ${second.firstname}`,
      "fr",
      { sensitivity: "base" },
    ),
  );

function toExpectedAssignmentStudent(
  student: PopulatedStudent,
): ExpectedAssignmentStudent {
  return {
    id: String(student._id),
    firstname: student.firstname?.trim() ?? "",
    lastname: student.lastname?.trim() ?? "",
    email: student.email?.trim() ?? "",
    avatar: imageToDataUrl(student.avatar),
  };
}

export async function getExpectedAssignmentStudentsByGroup(
  groupIds: readonly string[],
): Promise<Map<string, ExpectedAssignmentStudent[]>> {
  const studentsByGroup = new Map<string, ExpectedAssignmentStudent[]>();
  if (groupIds.length === 0) return studentsByGroup;

  const groups = (await Group.find({ _id: { $in: groupIds } })
    .populate("users", {
      _id: 1,
      firstname: 1,
      lastname: 1,
      email: 1,
      avatar: 1,
    })
    .lean()) as unknown as PopulatedGroup[];
  groups.forEach((group) => {
    studentsByGroup.set(
      String(group._id),
      sortExpectedStudents(
        (group.users ?? []).map(toExpectedAssignmentStudent),
      ),
    );
  });

  return studentsByGroup;
}

export async function getExpectedAssignmentStudents(
  groupIds: readonly string[],
): Promise<ExpectedAssignmentStudent[]> {
  const studentsByGroup = await getExpectedAssignmentStudentsByGroup(groupIds);
  const students = new Map<string, ExpectedAssignmentStudent>();
  studentsByGroup.forEach((groupStudents) => {
    groupStudents.forEach((student) => students.set(student.id, student));
  });
  return sortExpectedStudents([...students.values()]);
}

/**
 * Liste les devoirs publiés dans les seuls modules affectés au
 * formateur, puis rapproche les groupes MongoDB des remises PostgreSQL.
 */
export async function getTeacherUpcomingAssignments(
  moduleIds: readonly number[],
) {
  const assignments = await prisma.courseAssignment.findMany({
    where: {
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
  const expectedStudentsByGroup =
    await getExpectedAssignmentStudentsByGroup(groupIds);

  return assignments.map((assignment) => {
    const submissionsByStudent = new Map(
      assignment.submissions.map(({ student, ...submission }) => [
        student.idMdb,
        submission,
      ]),
    );
    const { groups: _groups, ...parcours } =
      assignment.course.module.parcours;
    const { submissions: _submissions, ...assignmentData } = assignment;
    const expectedStudents = new Map<string, ExpectedAssignmentStudent>();
    assignment.course.module.parcours.groups.forEach(({ group }) => {
      expectedStudentsByGroup.get(group.idMdb)?.forEach((student) => {
        expectedStudents.set(student.id, student);
      });
    });

    return {
      ...assignmentData,
      course: {
        ...assignment.course,
        module: { ...assignment.course.module, parcours },
      },
      students: sortExpectedStudents([...expectedStudents.values()]).map((student) => ({
        ...student,
        submission: submissionsByStudent.get(student.id) ?? null,
      })),
    };
  });
}
