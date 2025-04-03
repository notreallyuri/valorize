import { app } from "@acme/utils";

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
