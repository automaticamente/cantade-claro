import "dotenv/config.js";
import { parentPort } from "worker_threads";
import process from "process";
import { login } from "masto";

import { writeFile, readFile } from "fs/promises";

async function bot() {
  const masto = await login({
    url: process.env.INSTANCE,
    accessToken: process.env.TOKEN,
  });

  const items = JSON.parse(await readFile("./items.json"));

  let published;

  try {
    published = JSON.parse(await readFile("./published.json"));
  } catch {
    published = [];
  }

  const validItems = items.filter((item) => !published.includes(item[1]));

  if (validItems.length === 0) {
    throw new Error("No items remaining");
  }

  const [preposition, wikiName, visualName] =
    validItems[Math.floor(validItems.length * Math.random())];

  const status = {
    status: `
A ver, cantade claro, que opinades ${preposition} ${visualName || wikiName}

https://gl.wikipedia.org/wiki/${wikiName.replaceAll(" ", "_")}
    `,
    visibility: "public",
    poll: {
      expiresIn: 86400,
      options: ["A favor 👍", "En contra 👎"],
    },
  };

  const toot = await masto.statuses.create(status);

  published.unshift(wikiName);

  await writeFile("./published.json", JSON.stringify(published));

  return toot;
}

(async () => {
  const status = await bot();

  if (parentPort) {
    parentPort.postMessage(status.url);
  } else {
    process.exit(0);
  }
})();
