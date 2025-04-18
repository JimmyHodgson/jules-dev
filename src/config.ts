import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';

// Define an interface for the configuration structure for type safety
interface Config {
  port: number;
  bindAddress: string;
  bearerToken: string;
  hydraIntrospectionUrl: string; // Added Hydra URL
  enableDevToken: boolean;      // Added dev token flag
}

// Function to load and parse the YAML configuration file
function loadConfig(): Config {
  try {
    // Construct the path to config.yaml relative to the project root
    // __dirname in CommonJS points to the directory of the current module (e.g., dist/config.js)
    // We need to go up one level from 'dist' to find the project root where config.yaml resides.
    const configPath = path.join(__dirname, '..', 'config.yaml');

    // Read the YAML file content
    const fileContents = fs.readFileSync(configPath, 'utf8');

    // Parse the YAML content
    const config = yaml.load(fileContents) as Config;

    // Basic validation (can be expanded)
    if (
      !config ||
      typeof config.port !== 'number' ||
      typeof config.bindAddress !== 'string' ||
      typeof config.bearerToken !== 'string' ||
      typeof config.hydraIntrospectionUrl !== 'string' || // Validate Hydra URL type
      typeof config.enableDevToken !== 'boolean'         // Validate dev token flag type
    ) {
      throw new Error('Invalid or incomplete configuration format in config.yaml');
    }

    return config;
  } catch (error) {
    // Improved error handling: Check if it's an Error instance
    let errorMessage = 'An unknown error occurred while loading config.yaml';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    // Optional: Log the original error for debugging
    console.error('Raw config loading error:', error);
    // Re-throw with a more informative message, ensuring error.message is accessed safely
    throw new Error(`Could not load or parse config.yaml: ${errorMessage}`);
  }
}

// Load the configuration when the module is initialized
const config: Config = loadConfig();

// Export the loaded configuration object
export default config;
