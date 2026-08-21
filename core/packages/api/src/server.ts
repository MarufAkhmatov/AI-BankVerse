import { buildApp } from "./app.js";
import { buildContainer } from "./container.js";

const port = Number(process.env.PORT ?? 4000);
const app = buildApp(buildContainer());

app
  .listen({ port, host: "0.0.0.0" })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log(`AI BankVerse mock API listening on http://localhost:${port}`);
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  });
