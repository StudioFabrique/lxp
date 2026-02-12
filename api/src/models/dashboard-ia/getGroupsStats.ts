import Group from "../../utils/interfaces/db/group";
import PromptStats from "../../utils/interfaces/db/prompt-stats";
import GroupStats from "../../utils/interfaces/db/groups-stats";

export default async function getGroupStats(
  groupId: string,
  date: string = `${new Date().getFullYear()}-${new Date().getMonth()}`,
) {
  const now = new Date();

  const searchDate = new Date(
    Date.UTC(+date.split("-")[0], +date.split("-")[1], 1),
  );

  if (searchDate > now)
    throw { message: "Date cannot be in the future", statusCode: 400 };

  console.log({ searchDate });

  const startOfMonth = new Date(
    Date.UTC(searchDate.getFullYear(), searchDate.getMonth(), 1, 0, 0, 0, 0),
  );
  const endOfMonth = new Date(
    Date.UTC(
      searchDate.getFullYear(),
      searchDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    ),
  );

  const existingDocument = await GroupStats.findOne({
    groupId,
    date: {
      $gte: startOfMonth,
      $lte: endOfMonth,
    },
  });

  if (!existingDocument)
    return await _compileGroupStat(groupId, startOfMonth, endOfMonth);

  return {
    groupStats: existingDocument,
  };
}

async function _compileGroupStat(
  groupId: string,
  startOfMonth: Date,
  endOfMonth: Date,
) {
  const group = await Group.findOne({ _id: groupId }).populate("users", {
    _id: 1,
    firstname: 1,
    lastname: 1,
    promptCount: 1,
  });

  const usersIds = group?.users.map((u: any) => u._id) || [];
  const actualMonth = new Date().getMonth();

  console.log({ startOfMonth, endOfMonth });

  const expenses = await PromptStats.find({
    userId: { $in: usersIds },
    date: {
      $gte: startOfMonth,
      $lte: endOfMonth,
    },
  });

  let expensesByUser:
    | {
        _id: string;
        fullname: string;
        tokensUsed: number;
        promptCount: number;
      }[]
    | null = null;

  for (const u of group?.users || []) {
    const userExpenses = expenses.filter((e) => e.userId === u._id.toString());
    const tokensUsed = userExpenses.reduce((sum, e) => sum + e.tokensUsed, 0);
    const promptCount = userExpenses.reduce((sum, e) => sum + u.promptCount, 0);
    const result = {
      _id: u._id,
      fullname: `${u.firstname} ${u.lastname}`,
      tokensUsed,
      promptCount: u.promptCount as number,
    };
    expensesByUser = [...(expensesByUser ? expensesByUser : []), result];
  }
  console.log({ expensesByUser });

  console.log("ENDOFMONTH", endOfMonth.getMonth());
  console.log("ACTUAL MONTH", actualMonth);

  if (
    endOfMonth.getMonth() !== actualMonth + 1 &&
    expensesByUser &&
    expensesByUser?.length > 0
  ) {
    const newStats = await GroupStats.create({
      groupId,
      name: group?.name || "Unknown Group",
      tokensUsed: expensesByUser.reduce((sum, e) => sum + e.tokensUsed, 0),
      date: startOfMonth,
      users: expensesByUser.map((e) => ({
        userId: e._id,
        fullname: e.fullname,
        tokensUsed: e.tokensUsed,
        promptCount: e.promptCount,
      })),
    });
    return newStats;
  }

  return {
    message: "No new stats compiled",
    groupStats: {
      groupId,
      name: group?.name || "Unknown Group",
      tokensUsed: expensesByUser?.reduce((sum, e) => sum + e.tokensUsed, 0),
      date: startOfMonth,
      users: expensesByUser?.map((e) => ({
        userId: e._id,
        fullname: e.fullname,
        tokensUsed: e.tokensUsed,
        promptCount: e.promptCount,
      })),
    },
  };
}
