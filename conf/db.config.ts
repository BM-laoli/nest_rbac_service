const MysqlDBConfig: ConfigType['database'] = {
  mysql: [
    {
      name: 'rbac_db',
      // host: '192.168.101.2',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'rbac_db',
      synchronize: true,
    },
    {
      name: 'rbac_db_1',
      // host: '192.168.101.2',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'rbac_db_1',
      synchronize: true,
    },
  ],
};

export default MysqlDBConfig;
