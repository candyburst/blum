import colors from "colors";
import delayHelper from "../helpers/delay.js";

class TribeService {
  constructor() {}

  async getInfo(user) {
    try {
      const { data } = await user.http.get(2, "tribe/my");
      if (data) {
        return data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      if (error.response?.data?.message === "NOT_FOUND") {
        return false;
      } else {
        return null;
      }
    }
  }

  async getLeaderboard(user) {
    try {
      const { data } = await user.http.get(2, "tribe/leaderboard");
      if (data) {
        const top100 = data.items.slice(0, 100);
        const tribeSkip = user?.database?.tribeSkip || [
          "e7d71ab5-5e2f-4b2d-b00a-78d014a93ff6",
        ];
        return top100
          .filter((tribe) => !tribeSkip.includes(tribe.id))
          .map((tribe) => tribe.id);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      return [];
    }
  }

  async joinTribe(
    user,
    lang,
    tribeId = "e7d71ab5-5e2f-4b2d-b00a-78d014a93ff6",
    skipLog = false
  ) {
    const endpoint = `tribe/${tribeId}/join`;
    try {
      const { data } = await user.http.post(2, endpoint, {});
      if (data) {
        if (!skipLog) {
          user.log.log(
            lang?.tribe?.join_tribe_success +
              ": " +
              colors.rainbow("LBC") +
              " 🌈"
          );
        }
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      if (!skipLog) {
        user.log.logError(
          `${lang?.tribe?.join_tribe_failed}: ${error.response?.data?.message}`
        );
      }
    }
  }

  async leaveTribe(user) {
    const endpoint = `tribe/leave`;
    try {
      const { data } = await user.http.post(2, endpoint, {});

      if (data) {
        return true;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      return false;
    }
  }

  async handleTribe(user, lang) {
    const infoTribe = await this.getInfo(user);

    if (infoTribe === null) return;

    if (!infoTribe) {
      await this.joinTribe(user, lang);
    } else {
      const top100 = await this.getLeaderboard(user);
      const canLeaveTribe = top100.includes(infoTribe.id);

      if (canLeaveTribe) {
        await this.leaveTribe(user);
        await delayHelper.delay(3);
        await this.joinTribe(
          user,
          lang,
          "e7d71ab5-5e2f-4b2d-b00a-78d014a93ff6",
          true
        );
      }
    }
  }
}

const tribeService = new TribeService();
export default tribeService;
