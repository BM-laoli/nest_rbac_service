const MysqlDBConfig: ConfigType['database'] = {
  mysql: [
    {
      name: 'rbac_db',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'rbac',
      synchronize: true,
    },
  ],
};

export default MysqlDBConfig;
