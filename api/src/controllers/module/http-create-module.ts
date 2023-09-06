import { Request, Response } from "express";
import createModule from "../../models/module/create-module";
import * as fs from "fs";

export default async function httpCreateModule(req: Request, res: Response) {
  const { module, parcoursId } = req.body;

  const moduleParsed = JSON.parse(module);

  console.log(parcoursId);

  console.log(moduleParsed);

  const image: any = req.file;

  const imageData = await fs.promises.readFile(image.path);
  const base64String = imageData.toString("base64");

  const response = await createModule(
    { ...moduleParsed },
    parseInt(parcoursId),
    base64String
  );

  await fs.promises.unlink(image.path);

  if (!response) {
    return res.status(500).send("problème serveur");
  }
  return res.status(201).send({ message: "ressource créée", module: response });
}
