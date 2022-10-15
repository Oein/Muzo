import consoleColor from "./consoleColor.mjs";

export default {
  error: (str: string) => {
    console.error(
      `${consoleColor.FgRed}[Error]\t${consoleColor.Reset}  ${str}`
    );
  },
  info: (str: string) => {
    console.info(`${consoleColor.FgCyan}[Info]\t${consoleColor.Reset}  ${str}`);
  },
  warn: (str: string) => {
    console.warn(
      `${consoleColor.FgMagenta}[Warn]\t${consoleColor.Reset}  ${str}`
    );
  },
  log: (str: string) => {
    console.warn(`${consoleColor.Reset}[Log]\t${consoleColor.Reset}  ${str}`);
  },
  success: (str: string) => {
    console.log(`${consoleColor.FgGreen}[Success]${consoleColor.Reset} ${str}`);
  },
};
