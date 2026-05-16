/**
 * Configures Remotion CLI settings.
 * @see https://www.remotion.dev/docs/config
 */

import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

// Set high concurrency for faster rendering if system allows
Config.setConcurrency(8);

// Default output settings
Config.setCodec('h264');
Config.setAudioCodec('aac');
Config.setCrf(18);
Config.setPixelFormat('yuv420p');
