import environment from 'src/config/environment';

import showIp from './showIp';

const {port, version, isProd} = environment;

const logWelcome = (): void =>
  console.log(
    '\n\t🛡️ ###########################🛡️',
    '\n\n\t Server is listening to:',
    `\n${showIp()
      .map(ip => `\n\t 🚀 http://${ip}:${port}`)
      .join('')}\n\n\t 🔨 Build ver: ${version}`,
    `\n\n\t 📳 ${isProd ? 'Production' : 'Development'} mode`,
    '\n\n\t🛡️ ###########################🛡️'
  );

export default logWelcome;
