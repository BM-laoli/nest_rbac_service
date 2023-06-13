type RBAC_Service = {
  RBAC_Service: ConfigType;
};

type ConfigType = {
  database: ConfigDBType;
  RESTAPI: RESTAPI;
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
