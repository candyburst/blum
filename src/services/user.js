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

  // Load user data from files
  async loadUser() {
    // Read raw data from files
    const rawUsers = fileHelper.readFile("users.txt");
    const rawProxies = fileHelper.readFile("proxy.txt");
    const rawDevices = fileHelper.readFile("device.txt");

    // Process user data into an array
    const users = rawUsers
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    
    // Process proxy data into an array
    const proxies = rawProxies
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    
    // Process device data into an array
    const devices = rawDevices
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    // Check if users exist
    if (users.length <= 0) {
      console.log(colors.red(`No user data found`));
      return [];
    } else {
      let database = {};
      database = await server.getData(); // Fetch database data
      database.ref = database?.ref || "9m5hchoOPE"; // Set default reference if none

      // Map user data to structured format
      const result = users.map((user, index) => {
        const userParse = parse(he.decode(decodeURIComponent(user)));
        const info = JSON.parse(userParse.user);
        const proxy = proxies[index] || null;

        // Handle device information
        let device = devices.find(
          (d) => d.split("|")[0] === info.id.toString()
        );
        
        // Create a new device if not found
        if (!device) {
          device = fakeService.createDeviceInfo(info.id, 0);
          fileHelper.writeLog("device.txt", device); // Log new device info
        }

        const deviceInfo = deviceService.initDataDevice(device);
        const log = new LogHelper(index + 1, info.id); // Create log helper
        const http = new HttpService(log, deviceInfo, proxy); // Initialize HTTP service
        
        let query_id = user;
        // Decode query_id if present
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
          currency: colors.green.bold(" ₿"), // Currency symbol
        };
      });
      return result; // Return structured user data
    }
  }
}

const userService = new UserService(); // Create an instance of UserService
export default userService; // Export the instance
