import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.habittracker.app',
  appName: 'H(abit)eatmap',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
