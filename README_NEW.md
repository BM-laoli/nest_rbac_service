# 说明
>

这是一个基于 NEST JS 实现的最细粒度的 Template工程 具备下面的内容,

1. token 鉴权
2. redis 单点登录
3. mysql 链接
4. zk 配置服务
5. 其余的统一收口和dto等设置

# 启动说明
1. 配置好三个基础设施 
- docker
- mysql 
- redis
- zk

2. 配置中的内容
- docker 无所谓路
- mysql 配置好 root账号秘密

  - 修改 env 中的 MYSQL_DBS = rbac_db,  rbac_db_1 ,你要几个写几个多的不要写 而且要保证 zk中有你这个项
  - 修改conf 文件夹下的所有配置ip地址信息

- redis

  - 修改conf 文件夹下的所有配置ip地址信息 

- zk 的配置如下

<image src="./image.png" />


# 特殊备注
1. mysql 的实体 中有几个例子文件夹，他们被排除在外你可以参考代码，但是我们不会具体作用到 代码中去
src\core\mysql\mysql.module.ts
```ts
          const DBConfig = DBConfigAll
            .filter(item => !item.name.startsWith('_')) // 过滤掉以下划线开头的数据库
            .find((item) => item.name === db);
```

2. 在dto 下有很多样板代码，如果你不需要重新把他们删除就好路

3. 关于dto 主要向外暴露的一种数据结构