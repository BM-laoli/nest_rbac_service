type AuthInfo = {
  secret: string;
  expiresIn: string;
};

type ConfigDBType = {
  mysql: Array<ConfigDBMYSQL>;
  mongo?: any;
};

type ConfigDBMYSQL = {
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
};

type RedisConfig = {
  host: string;
  password: string;
  db: number;
  port: number;
  family: number;
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

type Config = {
  ResourceService: {
    Database: ConfigDBType;
    RESTAPI: RESTAPI;
    AuthInfo?: AuthInfo;
    RedisConfig?: RedisConfig;
  };
};

export { Config, ConfigDBMYSQL };
