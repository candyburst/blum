import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";

export class HttpService {
  constructor(log, device, proxy = null) {
    // Base URLs for different domains used in the service
    this.baseURL = [
      "https://game-domain.blum.codes/api/v1/",
      "https://gateway.blum.codes/v1/",
      "https://tribe-domain.blum.codes/api/v1/",
      "https://user-domain.blum.codes/api/v1/",
      "https://earn-domain.blum.codes/api/v1/",
      "https://game-domain.blum.codes/api/v2/",
    ];
    this.proxy = proxy;
    this.log = log;
    this.token = null;
    this.refreshToken = null;
    this.isConnected = false;
    this.device = device;
    // Default headers for API requests
    this.headers = {
      "Content-Type": "application/json",
      Accept: "application/json, text/plain, */*",
      "Sec-Fetch-Site": "same-site",
      "Accept-Language": "vi-VN,vi;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      Origin: "https://telegram.blum.codes",
      "User-Agent": this.device.userAgent,
      Referer: "https://telegram.blum.codes/",
      Connection: "keep-alive",
      "Sec-Fetch-Dest": "empty",
    };
  }

  // Update the access token
  updateToken(token) {
    this.token = token;
  }

  // Update the refresh token
  updateRefreshToken(token) {
    this.refreshToken = token;
  }

  // Update the connection status
  updateConnect(status) {
    this.isConnected = status;
  }

  // Initialize the configuration for an HTTP request
  initConfig() {
    const headers = {
      ...this.headers,
    };

    // Add Authorization header if token is available
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const config = {
      headers,
    };

    // If a proxy is specified (and not set to "skip"), set up the proxy agent
    if (this.proxy && this.proxy !== "skip") {
      config["httpsAgent"] = new HttpsProxyAgent(this.proxy);
    }

    return config;
  }

  // Perform a GET request to the specified domain and endpoint
  get(domain, endPoint) {
    const url = this.baseURL[domain] + endPoint;
    const config = this.initConfig();
    return axios.get(url, config);
  }

  // Perform a POST request to the specified domain and endpoint with a request body
  post(domain, endPoint, body) {
    const url = this.baseURL[domain] + endPoint;
    const config = this.initConfig();
    return axios.post(url, body, config);
  }

  // Perform a PUT request to the specified domain and endpoint with a request body
  put(domain, endPoint, body) {
    const url = this.baseURL[domain] + endPoint;
    const config = this.initConfig();
    return axios.put(url, body, config);
  }

  // Check the proxy's public IP using the IPify API
  async checkProxyIP() {
    if (!this.proxy || this.proxy === "skip") {
      // If no proxy is set or it is skipped, update log with a default symbol
      this.log.updateIp("🖥️");
      return null;
    }
    try {
      const proxyAgent = new HttpsProxyAgent(this.proxy);
      const response = await axios.get("https://api.ipify.org?format=json", {
        httpsAgent: proxyAgent,
      });
      if (response.status === 200) {
        const ip = response.data.ip;
        this.log.updateIp(ip); // Update log with the detected IP
        return ip;
      } else {
        throw new Error("Proxy error, please check the proxy connection");
      }
    } catch (error) {
      this.log.updateIp("🖥️"); // Reset log on error
      return -1; // Return -1 to indicate proxy failure
    }
  }
}
