import axios from "axios";
import colors from "colors";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
import delayHelper from "../helpers/delay.js";
import generatorHelper from "../helpers/generator.js";
import authService from "./auth.js";
dayjs.extend(utc);
dayjs.extend(timezone);

class GameService {
  constructor() {
    this.API_KEY = "";
    this.REMAINING_QUOTA = 99999;
  }

  setApiKey(apiKey) {
    this.API_KEY = apiKey;
  }

  setQuota(quota) {
    this.REMAINING_QUOTA = quota;
  }

  async playGame(user, delay) {
    try {
      const { data } = await user.http.post(5, "game/play", {});

      if (data) {
        user.log.log(
          `Starting game, finishing and claiming reward after: ${colors.blue(
            delay + "s"
          )}`
        );
        return data.gameId;
      } else {
        throw new Error(`Game play failed: ${data.message}`);
      }
    } catch (error) {
      if (error.response?.data?.message === "not enough play passes") {
        return 2;
      } else {
        user.log.logError(
          `Game play failed: ${error.response?.data?.message}`
        );
      }
      return null;
    }
  }

  async claimGame(user, gameId, eligibleDogs) {
    let points = generatorHelper.randomInt(180, 200);
    let dogs = 0;
    if (eligibleDogs) {
      points = generatorHelper.randomInt(90, 110);
      dogs = generatorHelper.randomInt(15, 20) * 5;
    }
    const payload = await this.createPlayload(user, gameId, points, dogs);

    if (!payload) return;

    const body = { payload };
    try {
      const { data } = await user.http.post(5, "game/claim", body);
      if (data) {
        user.log.log(
          `Game finished, reward: ${colors.green(
            points + user.currency
          )}${eligibleDogs ? ` - ${dogs} 🦴` : ""}`
        );
        return true;
      } else {
        throw new Error(`Claiming game reward failed: ${data.message}`);
      }
    } catch (error) {
      user.log.logError(
        `Claiming game reward failed: ${error.response?.data?.message}`
      );
      return false;
    }
  }

  async createPlayload(user, gameId, points, dogs) {
    let server = "";
    if (!this.API_KEY) {
      const servers =
        user?.database?.payloadServer?.filter(
          (server) => server.status === 1
        ) || [];
      if (servers.length) {
        const index = generatorHelper.randomInt(0, servers.length - 1);
        server = `https://${servers[index].id}.vercel.app/api/`;
      } else {
        console.log(colors.yellow(`No free servers available!`));
        return null;
      }
    } else {
      const isPro = this.API_KEY.includes("pro");
      if (isPro) {
        const servers =
          user?.database?.server?.pro?.filter(
            (server) => server.status === 1
          ) || [];

        if (servers.length) {
          server = servers[0].url;
        } else {
          return null;
        }
      } else {
        const servers =
          user?.database?.server?.free?.filter(
            (server) => server.status === 1
          ) || [];

        if (servers.length) {
          server = servers[0].url;
        } else {
          console.log(colors.yellow(`No free servers available!!`));
          return null;
        }
      }
    }

    try {
      let endpointPayload = `${server}blum/payload`;
      if (!this.API_KEY) {
        endpointPayload = `${server}blum`;
      }
      const { data } = await axios.post(
        endpointPayload,
        {
          game_id: gameId,
          points,
          dogs,
        },
        {
          headers: {
            "X-API-KEY": this.API_KEY,
          },
        }
      );
      let payload = data.payload;
      let remaining_quota = 999999;
      if (this.API_KEY) {
        payload = data.data.payload;
        remaining_quota = data.data.remaining_quota;
        this.setQuota(remaining_quota);
      }

      if (payload) {
        return payload;
      }
      throw new Error(`Creating payload failed: ${data?.error}`);
    } catch (error) {
      console.log(colors.red(error?.response?.data?.message));
      return null;
    }
  }

  async eligibilityDogs(user) {
    try {
      const { data } = await user.http.get(5, "game/eligibility/dogs_drop");
      return data.eligible;
    } catch (error) {
      return false;
    }
  }

  checkTimePlayGame(time) {
    // Get current hour in Vietnam timezone (UTC+7)
    const nowHour = dayjs().hour();
    return !time.includes(nowHour);
  }

  getMinutesUntilNextStart(times) {
    // Get current hour in Vietnam timezone (UTC+7)
    const currentHour = dayjs().hour();
    times.sort((a, b) => a - b);

    let nextHour = currentHour + 1;

    while (times.includes(nextHour)) {
      nextHour++;
    }

    const now = dayjs();

    const nextStartTime = now
      .set("hour", nextHour)
      .set("minute", 0)
      .set("second", 0);

    // Calculate minutes until the next start time
    return nextStartTime.diff(now, "minute");
  }

  async handleGame(user, playPasses, timePlayGame) {
    const isInTimeRange = this.checkTimePlayGame(timePlayGame);
    if (isInTimeRange) {
      const profile = await authService.getProfile(user);
      if (profile) playPasses = profile?.playPasses;
      const eligibleDogs = await this.eligibilityDogs(user);
      const textDropDogs =
        (eligibleDogs ? "can" : "cannot") + " collect DOGS 🦴";
      user.log.log(
        `Remaining ${colors.blue(playPasses + " play passes")} to play game ${colors.magenta(
          `[${textDropDogs}]`
        )}`
      );
      let gameCount = playPasses || 0;
      let errorCount = 0;
      while (gameCount > 0) {
        if (errorCount > 20) {
          gameCount = 0;
          continue;
        }
        if (this.REMAINING_QUOTA <= 0) {
          user.log.log(
            colors.yellow(
              `API KEY usage limit reached. Contact Telegram @zuydd to purchase more`
            )
          );
          gameCount = 0;
          continue;
        }
        await delayHelper.delay(2);
        const delay = 30 + generatorHelper.randomInt(5, 10);
        const gameId = await this.playGame(user, delay);
        if (gameId === 2) {
          gameCount = 0;
          continue;
        }
        if (gameId) {
          errorCount = 0;

          await delayHelper.delay(delay);
          const statusClaim = await this.claimGame(user, gameId, eligibleDogs);
          if (statusClaim) gameCount--;
        } else {
          errorCount++;
        }
      }
      if (playPasses > 0)
        user.log.log(colors.magenta("All play passes used up"));
      return -1;
    } else {
      const minutesUntilNextStart = this.getMinutesUntilNextStart(timePlayGame);
      user.log.log(
        colors.yellow(
          `Cannot play game during this time, next play available in: ${colors.blue(
            minutesUntilNextStart + " minutes"
          )}`
        )
      );
      return minutesUntilNextStart;
    }
  }
}

const gameService = new GameService();
export default gameService;
