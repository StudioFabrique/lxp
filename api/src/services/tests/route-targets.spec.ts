import { extractTargets } from "../../utils/services/observability/route-targets.ts";

const ID = "6b0442fd94346451f219a8fd";

describe("contenus désignés par un chemin d'API", () => {
  it.each([
    ["/v1/lesson/42", [{ kind: "lesson", id: "42" }]],
    ["/v1/lesson/rate/42", [{ kind: "lesson", id: "42" }]],
    ["/v1/content-read/lesson/42/heartbeat", [{ kind: "lesson", id: "42" }]],
    ["/v1/content-read/activity/7/begin", [{ kind: "activity", id: "7" }]],
    ["/v1/activity/text/19", [{ kind: "activity", id: "19" }]],
    ["/v1/activity/resource/34", [{ kind: "activity", id: "34" }]],
    ["/v1/course/12", [{ kind: "course", id: "12" }]],
    ["/v1/course/publish/12", [{ kind: "course", id: "12" }]],
    ["/v1/modules/14", [{ kind: "module", id: "14" }]],
    ["/v1/modules/detail/limited/41", [{ kind: "module", id: "41" }]],
    ["/v1/modules/image/5", [{ kind: "module", id: "5" }]],
    ["/v1/parcours/parcours-by-id/35", [{ kind: "parcours", id: "35" }]],
    ["/v1/parcours/publish/3", [{ kind: "parcours", id: "3" }]],
    ["/v1/stats/parcours/15", [{ kind: "parcours", id: "15" }]],
    ["/v1/parcours/parcours-by-formation/3", [{ kind: "formation", id: "3" }]],
    ["/v1/resources/5", [{ kind: "resource", id: "5" }]],
    [`/v1/group/${ID}`, [{ kind: "group", id: ID }]],
    [`/v1/indicators/${ID}/prediction`, [{ kind: "user", id: ID }]],
    [`/v1/user/data/${ID}`, [{ kind: "user", id: ID }]],
  ])("reconnaît %s", (path, expected) => {
    expect(extractTargets(path)).toEqual(expected);
  });

  it("ignore un identifiant du mauvais format pour son type", () => {
    expect(extractTargets(`/v1/lesson/${ID}`)).toEqual([]);
    expect(extractTargets("/v1/group/42")).toEqual([]);
    expect(extractTargets("/v1/lesson/0")).toEqual([]);
    expect(extractTargets("/v1/lesson/12345678901")).toEqual([]);
  });

  it("ignore les identifiants dont on ne connaît pas le contenu", () => {
    expect(extractTargets("/v1/quiz/attempt/9/answer")).toEqual([]);
    expect(extractTargets("/v1/permission/resources/id/4")).toEqual([]);
    expect(extractTargets("/v1/lesson/last-read")).toEqual([]);
  });

  it("ne renvoie chaque contenu qu'une fois et ignore la query string", () => {
    expect(extractTargets("/v1/lesson/42?x=1")).toEqual([{ kind: "lesson", id: "42" }]);
    expect(
      extractTargets(`/v1/indicators/${ID}/analyses/3/feedback`),
    ).toEqual([{ kind: "user", id: ID }]);
  });
});
