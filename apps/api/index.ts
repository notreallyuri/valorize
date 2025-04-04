import { app } from "@acme/utils";

import { templateRepository } from "@acme/repositories";
import { TemplateStructure } from "@acme/interfaces";
import { mongoClient } from "@acme/database";

async function createExampleTemplate() {
  const templateName = "exampleTemplate2";
  const templateVersion = "2.0.0";

  const structure: TemplateStructure = {
    name: "string",
    section1: {
      field1: "string",
      field2: "number",
    },
    section2: {
      field3: "boolean",
      field4: "array",
    },
    section3: {
      field5: "string",
      field6: "string",
      field7: "string",
    },
  };

  try {
    await mongoClient.connect();
    const createdTemplate = await templateRepository.create(
      templateName,
      templateVersion,
      structure
    );
    console.log("Example template created:", createdTemplate);
    return createdTemplate;
  } catch (error) {
    console.error("Failed to create example template:", error);
  }
}

async function getExampleTemplate() {
  const templateName = "exampleTemplate";
  const templateVersion = "1.0.0";

  try {
    await mongoClient.connect();
    const res = await templateRepository.get(templateName, templateVersion);

    console.log(res);
    return res;
  } catch (error) {
    console.error("Failed to get example template:", error);
  }
}

const start = async () => {
  try {
    const address = await app.listen({ port: 3333, host: "0.0.0.0" });
    app.log.info(`Server listening at ${address}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();
createExampleTemplate();
getExampleTemplate();
