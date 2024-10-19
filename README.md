![Blum banner](https://raw.githubusercontent.com/zuydd/image/main/blum.jpeg)

# Auto Blum NodeJS Tool by ZuyDD

**This tool is developed and shared for free by ZuyDD**

<a href="https://www.facebook.com/zuy.dd"><img src="https://raw.githubusercontent.com/zuydd/image/main/facebook.svg" alt="Facebook"></a>  
<a href="https://t.me/zuydd"><img src="https://raw.githubusercontent.com/zuydd/image/main/telegram.svg" alt="Telegram"></a>

> [!WARNING]  
> Selling this tool in any form is strictly prohibited!

## 🛠️ Installation Guide

> Requires NodeJS to be installed

- Step 1: Download the latest version of the tool [here ⬇️](https://github.com/zuydd/blum/archive/refs/heads/main.zip)
- Step 2: Extract the tool
- Step 3: In the extracted folder (the folder containing the `package.json` file), run the command `npm install` to install the necessary libraries

## 💾 How to Add Account Data

> The tool supports both `user` and `query_id`

> All the data you need to enter is located in the files within the 📁 `src / data` folder

- [users.txt](src/data/users.txt): contains the list of `users` or `query_id` for each account, one account per line
- [proxy.txt](src/data/proxy.txt): contains the list of proxies, where each proxy corresponds to an account in the `users.txt` file. Leave blank if no proxy is needed
- [token.json](src/data/token.json): contains the list of tokens generated from `user` or `query_id`. Tokens will be automatically generated when you run the tool

> Proxy format: http://user:pass@ip:port

## >_ Commands and Corresponding Features

| Command          | Functionality                                                                                                                                       |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run start`  | Runs farming/claim, tasks, check-ins, games, claim invite points, etc.—everything the game offers, the tool will do                                  |

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
     - `Enter`

5. **Start the application:**
   ```bash
   npm run start
   ```

## 🕹️ Features of the Tool

- Automatic daily check-in
- Automatically join tribes for an extra 10% bonus points
- Automatic task completion
- Automatically farm/claim rewards at the right time
- Automatic gameplay
- Claim invite points
- Automatically detect proxies and reconnect when there's an error. Add proxies to `proxy.txt` corresponding to the account, leave blank or write "skip" if no proxy is needed
- Multi-threaded: run as many accounts as you like without blocking each other
- Configure game playtime: by default, the tool always plays the game, but you can skip peak hours by setting the `TIME_PLAY_GAME = []` variable, e.g., `[1, 2, 3, 8, 20]` to skip gameplay during those hours

> [!WARNING]  
> - If you encounter login or task issues, it's likely the Blum server's fault, not the tool's. Just wait until the server is back online.
> - Blum servers often fail between 2 PM to 12 AM, so it’s recommended to run the tool for the first time between 4 AM and 12 PM for smoother operation.

## ♾ Multi-Threading Setup

- By default, the tool will run multiple threads corresponding to the number of accounts entered, no further setup is required.
- In the first loop, each account (thread) will start 30 seconds apart to avoid request spamming. You can adjust this delay by modifying the `DELAY_ACC = 10` variable in the [index.js](src/run/index.js) file.

## ❌ Retry Mode on Errors

- For proxy connection errors, the system will retry every 30 seconds. You can set the retry limit by adjusting the `MAX_RETRY_PROXY = 20` variable in the [index.js](src/run/index.js) file (default is 20). If the retry limit is reached, the system will stop auto-running that account and log the error in [log.error.txt](src/data/log.error.txt).
- For login failures, the system retries every 60 seconds. Adjust the retry limit with the `MAX_RETRY_LOGIN = 20` variable in the [index.js](src/run/index.js) file (default is 20). Errors will be logged in [log.error.txt](src/data/log.error.txt) after too many retries.

## 🔄 Update History

> To update to a new version, simply copy the 📁 [data](src/data) folder from the old version and overwrite it in the new version.

> Latest version: `v0.1.7`

<details>
<summary>v0.1.7 - 📅 16/10/2024</summary>
  
- Changed game time settings (default now always plays games)
</details>
<details>
<summary>v0.1.6 - 📅 16/10/2024</summary>
  
- Fixed gameplay issue
- Added DOGS collection during gameplay
</details>
<details>
<summary>v0.1.5 - 📅 12/10/2024</summary>
  
- Temporarily skipped gameplay, will fix later
</details>
<details>
<summary>v0.1.4 - 📅 25/09/2024</summary>
  
- Temporarily skipped tasks due to server issues (will automatically resume when server stabilizes)
</details>
<details>
<summary>v0.1.3 - 📅 19/09/2024</summary>
  
- Fixed task completion bug
</details>
<details>
<summary>v0.1.2 - 📅 18/09/2024</summary>
  
- Added X Empire tasks
</details>
<details>
<summary>v0.1.1 - 📅 14/09/2024</summary>
  
- Fixed continuous loop bug
- Added system notifications and version checks
- Added game time limits to avoid server lag; by default, the game only runs from 1 AM to 1 PM (UTC+7)
</details>
<details>
<summary>v0.1.0 - 📅 14/09/2024</summary>
  
- Added weekly tasks
</details>
<details>
<summary>v0.0.9 - 📅 13/09/2024</summary>
  
- Fixed GitHub server request spam issue
</details>
<details>
<summary>v0.0.8 - 📅 13/09/2024</summary>
  
- Fixed data retrieval from the server
</details>
<details>
<summary>v0.0.7 - 📅 13/09/2024</summary>
  
- Fixed task list retrieval failure
- Added Promo tasks
- Countdown until the next run
- Automatically fetch data from the server every 20-40 minutes
</details>
<details>
<summary>v0.0.6 - 📅 11/09/2024</summary>
  
- Added automatic task completion for questions (Blum server instability may cause errors, just let it retry)
- Fixed check-in (displaying correct status and rewards)
- Fixed auto-claim for invite points
- Fixed task list retrieval failure
</details>
<details>
<summary>v0.0.5 - 📅 08/09/2024</summary>
  
- Added retry limit mechanism for proxy/login errors
- Logged errors for easier tracking when running multiple accounts
- Updated game pass count after check-in
</details>
<details>
<summary>v0.0.4 - 📅 07/09/2024</summary>
  
- Updated task data, fixed task completion issues
</details>
<details>
<summary>v0.0.3 - 📅 05/09/2024</summary>
  
- Changed login API
</details>
<details>
<summary>v0.0.2 - 📅 02/09/2024</summary>
  
- Adjusted game points to match reality (from 180 - 200)
</details>
<details>
<summary>v0.0.1 - 📅 02/09/2024</summary>
  
- Shared the tool with the community
</details>

## 🎁 Donate

We are happy to share free scripts and resources with the airdrop community. If you find our tools and documentation useful and would like to support us in further development and maintenance, you can contribute by donating.

Every donation helps us maintain quality service and continue providing valuable resources to the airdrop community. We sincerely appreciate your support!

Much love 😘😘😘

<div style="display: flex; gap: 20px;">
  <img src="https://raw.githubusercontent.com/zuydd/image/main/qr-momo.png" alt="QR Momo" height="340" />
  <img src="https://raw.githubusercontent.com/zuydd/image/main/qr-binance.jpg" alt="QR Binance" height="340" />
</div>
