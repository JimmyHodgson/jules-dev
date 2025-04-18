import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';

// Define an interface for the configuration structure for type safety
interface Config {
  port: number;
  bindAddress: string;
  bearerToken: string;
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
    if (!config || typeof config.port !== 'number' || typeof config.bindAddress !== 'string' || typeof config.bearerToken !== 'string') {
      throw new Error('Invalid configuration format');
    }

    return config;
  } catch (error) {
    console.error('Failed to load configuration:', error);
    // Provide default values or re-throw, depending on desired behavior
    // For simplicity, we'll throw an error here, requiring the config file to exist and be valid.
    throw new Error(`Could not load or parse config.yaml: ${error.message}`);
  }
}

// Load the configuration when the module is initialized
const config: Config = loadConfig();

// Export the loaded configuration object
export default config;
