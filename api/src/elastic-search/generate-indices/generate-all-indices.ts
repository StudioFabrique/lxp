import { exit } from "process";
import mongoConnect from "../../utils/services/db/mongo-connect";
import elasticSearchClient from "../elastic-search";
import { generateBonusSkillsDataIntoIndex } from "./bonus-skills-index";
import { generateContactsDataIntoIndex } from "./contacts-index";
import { generateCoursesDataIntoIndex } from "./courses-index";
import { generateModulesDataIntoIndex } from "./modules-index";
import { generateTagsDataIntoIndex } from "./tags-index";
import { generateObjectivesDataIntoIndex } from "./objectives-index";

async function clearAllIndices() {
  console.log("Cleanup all indices...");
  await elasticSearchClient.cluster.putSettings({
    persistent: { "action.destructive_requires_name": false },
  });
  await elasticSearchClient.indices.delete({ index: "*" });
  console.log("Cleanup done !");
}

export async function generateAllIndices(withExit: boolean = false) {
  await mongoConnect();
  await clearAllIndices();
  await generateTagsDataIntoIndex();
  await generateCoursesDataIntoIndex();
  await generateModulesDataIntoIndex();
  await generateBonusSkillsDataIntoIndex();
  await generateObjectivesDataIntoIndex();
  await generateContactsDataIntoIndex();
  exit();
}

generateAllIndices(true);
