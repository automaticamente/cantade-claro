import Bree from "bree";

const cron = new Bree({
  jobs: [
    {
      name: "bot",
      interval: "every day at 9:00 am",
    },
  ],
});

(async function () {
  await cron.start();
})();
