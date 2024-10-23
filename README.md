# Tool Auto Blum NodeJS by ZuyDD

**Tool developed and shared for free by ZuyDD**

<a href="https://www.facebook.com/zuy.dd"><img src="https://raw.githubusercontent.com/zuydd/image/main/facebook.svg" alt="Facebook"></a>
<a href="https://t.me/zuydd"><img src="https://raw.githubusercontent.com/zuydd/image/main/telegram.svg" alt="Telegram"></a>

> [!WARNING]
> Selling this tool in any form is not permitted!

## Purchase or receive a free API KEY at https://zuy-web.vercel.app/blum

## 🛠️ Installation Guide

> NodeJS is required to be installed

- Step 1: Download the latest version of the tool [here ⬇️](https://github.com/zuydd/blum/archive/refs/heads/main.zip)
- Step 2: Extract the tool
- Step 3: In the tool's directory (the folder containing `package.json`), run the command `npm install` to install the necessary libraries.

## 💾 How to Add Account Data

> The tool supports both `user` and `query_id`

> All data you need to input is in files located in the folder 📁 `src / data`

- [users.txt](src/data/users.txt) : Contains a list of `user` or `query_id` for the accounts, each line represents an account.
- [proxy.txt](src/data/proxy.txt) : Contains a list of proxies, each line corresponds to the account in the `users.txt` file. Leave empty if not using a proxy.
- [token.json](src/data/token.json) : Contains the token list generated from `user` or `query_id`. Tokens will be automatically generated when you run the tool.

> Proxy format: http://user:pass@ip:port

### Installation Commands

1. **Clone the repository:**
   ```bash
   git clone https://github.com/candyburst/blum.git
   ```

2. **Navigate into the project directory:**
   ```bash
   cd blum
   ```

3. **Install the required dependencies:**
   ```bash
   npm install
   ```

   **Note:** If you encounter problems during `npm install`, try this command:
   ```bash
   npm install --ignore-scripts --no-bin-links
   ```

4. **Edit the `users.txt` file to add queries or user info:**
   ```bash
   nano src/data/users.txt
   ```

   Add the required information in the file.

   - To exit nano, use the following key sequence:
     - `Ctrl + X`
     - `Y` (to confirm save)
     - `Ctrl + M` (to return)

5. **Start the application:**
   ```bash
   npm run start
   ```
   
## 🕹️ Features of the Tool

- Automatic daily check-in
- Automatically join tribes to earn an additional 10% bonus points
- Automatically completes tasks
- Automatically farms/claims rewards when it's time
- Automatically plays games (requires API KEY, purchase or receive a free API KEY at https://zuy-web.vercel.app/blum)
- Claims invite points
- Auto-detects and reconnects proxies when there are errors. Add the proxy to the `proxy.txt` file corresponding to the account line. Leave empty or type "skip" for accounts without proxy.
- Multi-thread support: run as many accounts as you want without blocking each other
- Set game-playing times: the default is to always play games. If you want to avoid high-traffic periods, you can find the `TIME_PLAY_GAME = []` variable and input the hours you want to skip playing, e.g., entering [1, 2, 3, 8, 20] will skip game time during those hours.

> [!WARNING]
>
> - Login, task, or game errors are due to Blum's server issues, not tool errors. Just let it be, and the tool will resume once the server is fixed.
> - The server often experiences errors between 2 PM - 12 AM, so it's recommended to run the tool for the first time between 4 AM - 12 PM for smoother performance.

## ♾ Multi-Thread Setup

- The tool will automatically run in multi-thread mode according to the number of accounts entered; no additional setup is required.
- By default, in the first loop, each account (thread) will run 30 seconds apart to avoid spamming requests. You can adjust this by finding the `DELAY_ACC = 10` variable in the [index.js](src/run/index.js) file.

## ❌ Retry Mode for Errors

- For proxy connection errors, the system will retry every 30 seconds. You can set a retry limit by finding the `MAX_RETRY_PROXY = 20` variable in the [index.js](src/run/index.js) file (default is 20). Once the retry limit is exceeded, the tool will stop auto operations for that account and log the error in [log.error.txt](src/data/log.error.txt).
- For login failure errors, the system will retry every 60 seconds. You can set a retry limit by finding the `MAX_RETRY_LOGIN = 20` variable in the [index.js](src/run/index.js) file (default is 20). Once the retry limit is exceeded, the tool will stop auto operations for that account and log the error in [log.error.txt](src/data/log.error.txt).

## 🔄 Update History

> When updating to a new version, simply copy the 📁 [data](src/data) folder from the old version to the new version and it will run without needing to re-enter the data.

> Latest version: `v0.1.9`

<details>
<summary>v0.1.9 - 📅 23/10/2024</summary>
  
- Fix tool stopping bug
</details>
<details>
<summary>v0.1.8 - 📅 23/10/2024</summary>
  
- Added fake device feature
- Added API KEY system for playing games
</details>
...

## 🎁 Donate

We are happy to share free scripts and open-source resources with the airdrop community. If you find our tools and documentation helpful and want to support us in maintaining and developing these projects, you can donate to support us.

Your contribution will help us maintain quality service and continue to provide valuable resources to the airdrop community. We sincerely thank you for your support!

Much love 😘😘😘

<div style="display: flex; gap: 20px;">
  <img src="https://raw.githubusercontent.com/zuydd/image/main/qr-momo.png" alt="QR Momo" height="340" />
  <img src="https://raw.githubusercontent.com/zuydd/image/main/qr-binance.jpg" alt="QR Binance" height="340" />
</div>
