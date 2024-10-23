class GeneratorHelper {
  constructor() {}

  // Method to generate a random integer within the range [min, max]
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Method to generate a random UUID
  uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
      const randomValue = (Math.random() * 16) | 0; // Generate a random number from 0 to 15 (hexadecimal)
      return (char === "x" ? randomValue : (randomValue & 3) | 8).toString(16); // Convert random number to hexadecimal character
    });
  }

  // Method to shuffle an array using the Fisher-Yates algorithm
  shuffleArray(arr) {
    let shuffled = [...arr]; // Copy the original array to avoid modifying it

    for (let i = shuffled.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap two elements
    }

    return shuffled;
  }

  // Method to get x random elements from an array
  getRandomElements(arr, x) {
    let shuffled = this.shuffleArray([...arr]); // Shuffle the array
    return shuffled.slice(0, x); // Return the first x elements from the shuffled array
  }

  // Method to generate a random hexadecimal string of length n
  randomHex(n) {
    let result = "";
    const hexChars = "0123456789abcdef";
    for (let i = 0; i < n; i++) {
      result += hexChars[Math.floor(Math.random() * 16)];
    }
    return result;
  }

  // Method to generate a random floating-point number between n and m with 3 decimal places
  randomFloat(n, m) {
    return (Math.random() * (m - n) + n).toFixed(3);
  }
}

// Create and export the GeneratorHelper object
const generatorHelper = new GeneratorHelper();
export default generatorHelper;
