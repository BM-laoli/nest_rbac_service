type RBAC_Service = {
  RBAC_Service: ConfigType;
};

type ConfigType = {
  database: ConfigDBType;
  RESTAPI: RESTAPI;
  AuthInfo?: AuthInfo;
  RedisConfig?: RedisConfig;
};

type ConfigDBType = {
  mysql: Array<ConfigDBMYSQLType>;
  mongo?: any;
};

type ConfigDBMYSQLType = {
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
};

type RESTAPI = {
  a: {
    b: {
      c: {
        d: {
          name: string;
        };
      };
    };
  };
};

type AuthInfo = {
  secret: string;
  expiresIn: string;
};

type RedisConfig = {
  host: string;
  password: string;
  db: number;
  port: number;
  family: number;
};
