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
  },
};
