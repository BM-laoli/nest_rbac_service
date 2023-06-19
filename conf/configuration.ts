import db from './db.config';
import RESTAPI from './RESTAPI.config';

export const InitConfig = () => ({
  env: process.env.ENV,
  port: process.env.APP_PROT,
  zkHost: process.env.ZK_HOST,
  mysqlDBS: process.env.MYSQL_DBS.split(',').map((i) => i.trim()),
});

export const config: RBAC_Service = {
  RBAC_Service: {
    database: db,
    RESTAPI: RESTAPI,
    RedisConfig: {
      host: '192.168.101.2',
      port: 6379,
      db: 0,
      family: 4,
      password: '',
    },
    AuthInfo: {
      secret: "1234567890-=qwertyuiop[]asdfghjkl;'zxcvbnm,./",
      expiresIn: '8h',
    },
  },
};
