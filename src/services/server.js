import axios from "axios";
import colors from "colors";

class Server {
  constructor() {}

  async getData() {
    try {
      const endpointDatabase =
        "https://raw.githubusercontent.com/candyburst/database/refs/heads/main/blum.json";
      const { data } = await axios.get(endpointDatabase);
      return data;
    } catch (error) {
      console.log(colors.red("Failed to retrieve data from server candyburst"));
      return null;
    }
  }

  async showNoti() {
    const database = await this.getData();
    if (database && database.noti) {
      console.log(colors.blue("📢 Notification from the system"));
      console.log(database.noti);
      console.log("");
    }
  }

  async checkVersion(currentVersion, database = null) {
    if (!database) {
      database = await this.getData();
    }

    if (database && currentVersion !== database.ver) {
      console.log(
        colors.yellow(
          `🚀 A new version is available: ${colors.blue(
            database.ver
          )}, download it here 👉 ${colors.blue(
            "https://github.com/candyburst/blum"
          )}`
        )
      );
      console.log("");
    }
  }
}

const server = new Server();
export default server;
