import colors from "colors";
import dayjs from "dayjs";
import datetimeHelper from "../helpers/datetime.js";
import delayHelper from "../helpers/delay.js";
import fileHelper from "../helpers/file.js";
import generatorHelper from "../helpers/generator.js";
import authService from "../services/auth.js";
import dailyService from "../services/daily.js";
import farmingClass from "../services/farming.js";
import gameService from "../services/game.js";
import inviteClass from "../services/invite.js";
import keyService from "../services/key.js";
import server from "../services/server.js";
import taskService from "../services/task.js";
import tribeService from "../services/tribe.js";
import userService from "../services/user.js";

const VERSION = "v0.2.0";
// Adjust the time delay for the first loop between threads to avoid spamming requests (in seconds)
const DELAY_ACC = 10;
// Set the maximum number of retry attempts when the proxy fails. If it exceeds the set number of retries, the account will stop and log the error.
const MAX_RETRY_PROXY = 20;
// Set the maximum number of retry attempts when login fails. If it exceeds the set number of retries, the account will stop and log the error.
const MAX_RETRY_LOGIN = 20;
// Set times NOT to play games to avoid server error periods. For example, entering [1, 2, 3, 8, 20] will prevent playing games during the hours of 1, 2, 3, 8, and 20.
const TIME_PLAY_GAME = [];
// Set countdown to the next run
const IS_SHOW_COUNTDOWN = true;
const countdownList = [];

let database = {};
setInterval(async () => {
  const data = await server.getData();
  if (data) {
    database = data;
    server.checkVersion(VERSION, data);
  }
}, generatorHelper.randomInt(20, 40) * 60 * 1000);

const run = async (user, index) => {
  let countRetryProxy = 0;
  let countRetryLogin = 0;
  await delayHelper.delay((user.index - 1) * DELAY_ACC);
  while (true) {
    // Fetch data from the zuydd server
    if (database?.ref) {
      user.database = database;
    }

    countdownList[index].running = true;
    // Check proxy connection
    let isProxyConnected = false;
    while (!isProxyConnected) {
      const ip = await user.http.checkProxyIP();
      if (ip === -1) {
        user.log.logError(
          "Proxy error, please check the proxy connection. Will retry after 30s"
        );
        countRetryProxy++;
        if (countRetryProxy >= MAX_RETRY_PROXY) {
          break;
        } else {
          await delayHelper.delay(30);
        }
      } else {
        countRetryProxy = 0;
        isProxyConnected = true;
      }
    }
    try {
      if (countRetryProxy >= MAX_RETRY_PROXY) {
        const dataLog = `[No ${user.index} _ ID: ${
          user.info.id
        } _ Time: ${dayjs().format(
          "YYYY-MM-DDTHH:mm:ssZ[Z]"
        )}] Proxy connection failed - ${user.proxy}`;
        fileHelper.writeLog("log.error.txt", dataLog);
        break;
      }

      if (countRetryLogin >= MAX_RETRY_LOGIN) {
        const dataLog = `[No ${user.index} _ ID: ${
          user.info.id
        } _ Time: ${dayjs().format(
          "YYYY-MM-DDTHH:mm:ssZ[Z]"
        )}] Login failed too many times (over ${MAX_RETRY_LOGIN})`;
        fileHelper.writeLog("log.error.txt", dataLog);
        break;
      }
    } catch (error) {
      user.log.logError("Failed to log error");
    }

    // Login to the account
    const login = await authService.handleLogin(user);
    if (!login.status) {
      countRetryLogin++;
      await delayHelper.delay(60);
      continue;
    } else {
      countRetryLogin = 0;
    }

    await dailyService.checkin(user);
    await tribeService.handleTribe(user);
    if (user.database?.skipHandleTask) {
      user.log.log(
        colors.yellow(
          `Skipping task due to server error (will resume automatically when the server stabilizes)`
        )
      );
    } else {
      await taskService.handleTask(user);
    }

    await inviteClass.handleInvite(user);
    let awaitTime = await farmingClass.handleFarming(
      user,
      login.profile?.farming
    );
    countdownList[index].time = (awaitTime + 1) * 60;
    countdownList[index].created = dayjs().unix();
    const minutesUntilNextGameStart = await gameService.handleGame(
      user,
      login.profile?.playPasses,
      TIME_PLAY_GAME
    );
    if (minutesUntilNextGameStart !== -1) {
      const offset = dayjs().unix() - countdownList[index].created;
      const countdown = countdownList[index].time - offset;
      if (minutesUntilNextGameStart * 60 < countdown) {
        countdownList[index].time = (minutesUntilNextGameStart + 1) * 60;
        countdownList[index].created = dayjs().unix();
      }
    }
    countdownList[index].running = false;
    await delayHelper.delay((awaitTime + 1) * 60);
  }
};

console.log(
  colors.yellow.bold(
    `=============  Tool developed and shared for free by ZuyDD  =============`
  )
);
console.log(
  "Any commercial use or sale of this tool in any form is not permitted!"
);
console.log(
  `Telegram: ${colors.green(
    "https://t.me/zuydd"
  )}  ___  Facebook: ${colors.blue("https://www.facebook.com/zuy.dd")}`
);
console.log(
  `🚀 Get the latest tools here: 👉 ${colors.gray(
    "https://github.com/zuydd"
  )} 👈`
);
console.log("");
console.log(
  `Buy or get free API KEY at: 👉 ${colors.blue(
    "https://zuy-web.vercel.app/blum"
  )}`
);
console.log("");
console.log("");

await server.checkVersion(VERSION);
await server.showNoti();
console.log("");
const users = await userService.loadUser();

await keyService.handleApiKey();

for (const [index, user] of users.entries()) {
  countdownList.push({
    running: true,
    time: 480 * 60,
    created: dayjs().unix(),
  });
  run(user, index);
}

if (IS_SHOW_COUNTDOWN && users.length) {
  let isLog = false;
  setInterval(async () => {
    const isPauseAll = !countdownList.some((item) => item.running === true);

    if (isPauseAll) {
      await delayHelper.delay(1);
      if (!isLog) {
        console.log(
          "========================================================================================="
        );
        isLog = true;
      }
      const minTimeCountdown = countdownList.reduce((minItem, currentItem) => {
        // Adjust for offset
        const currentOffset = dayjs().unix() - currentItem.created;
        const minOffset = dayjs().unix() - minItem.created;
        return currentItem.time - currentOffset < minItem.time - minOffset
          ? currentItem
          : minItem;
      }, countdownList[0]);
      const offset = dayjs().unix() - minTimeCountdown.created;
      const countdown = minTimeCountdown.time - offset;
      process.stdout.write("\x1b[K");
      process.stdout.write(
        colors.white(
          `[${dayjs().format(
            "DD-MM-YYYY HH:mm:ss"
          )}] All threads finished, waiting: ${colors.blue(
            datetimeHelper.formatTime(countdown)
          )}     \r`
        )
      );
    } else {
      isLog = false;
    }
  }, 1000);

  process.on("SIGINT", () => {
    console.log("");
    process.stdout.write("\x1b[K"); // Clear current line from cursor to the end
    process.exit(); // Exit process
  });
}

setInterval(() => {}, 1000); // Keep the script running
