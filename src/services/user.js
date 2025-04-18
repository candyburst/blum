import colors from "colors";
import he from "he";
import { parse } from "querystring";
import fileHelper from "../helpers/file.js";
import { LogHelper } from "../helpers/log.js";
import deviceService from "./device.js";
import fakeService from "./fake.js";
import { HttpService } from "./http.js";
import server from "./server.js";

class UserService {
  constructor() {}

  safeDecodeURIComponent(str) {
    return str.replace(/(%[0-9A-F]{2})+/gi, (match) => {
      try {
        return decodeURIComponent(match);
      } catch (e) {
        return match; // Nếu có lỗi, giữ nguyên phần này
      }
    });
  }

  async loadUser(lang) {
    const rawUsers = fileHelper.readFile("users.txt");
    const rawProxies = fileHelper.readFile("proxy.txt");
    const rawDevices = fileHelper.readFile("device.txt");

    const users = rawUsers
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    const proxies = rawProxies
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    const devices = rawDevices
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (users.length <= 0) {
      console.log(colors.red(lang?.user?.not_found));
      return [];
    } else {
      let database = {};
      database = await server.getData();
      database.ref = database?.ref || "9m5hchoOPE";

      const result = users.map((user, index) => {
        const userParse = parse(he.decode(this.safeDecodeURIComponent(user)));
        const info = JSON.parse(userParse.user);
        const proxy = proxies[index] || null;
        // handle device
        let device = devices.find(
          (d) => d.split("|")[0] === info.id.toString()
        );
        if (!device) {
          device = fakeService.createDeviceInfo(info.id, 0);
          fileHelper.writeLog("device.txt", device);
        }
        const deviceInfo = deviceService.initDataDevice(device);
        const log = new LogHelper(index + 1, info.id);
        const http = new HttpService(log, deviceInfo, proxy);
        let query_id = user;
        if (user && user.includes("query_id%3D")) {
          query_id = he.decode(decodeURIComponent(query_id));
        }
        return {
          query_id,
          index: index + 1,
          info: {
            ...info,
            fullName: (info.first_name + " " + info.last_name).trim(),
            auth_date: userParse.auth_date,
            hash: userParse.hash,
          },
          database,
          proxy,
          http,
          log,
          currency: colors.green.bold(" ₿"),
        };
      });
      return result;
    }
  }
}

const userService = new UserService();
export default userService;
