import pm2 from "pm2";

export const connectPm2 = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    pm2.connect((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

export const listProcesses = (): Promise<pm2.ProcessDescription[]> => {
  return new Promise((resolve, reject) => {
    pm2.list((err, list) => {
      if (err) return reject(err);
      resolve(list);
    });
  });
};

export const restartProcess = (process: string | number): Promise<void> => {
  return new Promise((resolve, reject) => {
    pm2.restart(process, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

export const disconnectPm2 = () => {
  pm2.disconnect();
};
