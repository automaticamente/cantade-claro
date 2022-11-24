import Bree from "bree";

const cron = new Bree({
  jobs: [
    {
      name: "bot",
      interval: "at 9:05 am",
    },
  ],
});

(async function () {
  await cron.start();
})();
