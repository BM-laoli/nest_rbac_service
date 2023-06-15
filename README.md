# 说明
>
> 这是基于NestJs的RBAC Service Demo ，也是一套 **标准切规范的Nestjs稳定**

# 重难点

## 动态模块的 参数传递

### 例子如下

```ts
export type ZkConfigModuleOptions = {
  env: 'DEV' | 'Staging' | 'PRD';
  zkHost: string;
  localConfig: any;
};

interface MyModuleOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<any>;
  useClass?: Type<any>;
  useFactory?: (
    ...args: any[]
  ) => Promise<ZkConfigModuleOptions> | ZkConfigModuleOptions;
  inject?: any[];
  extraProviders?: Provider[];
}
const MYMODULE_OPTIONS ="MYMODULE_OPTIONS"

@Module({})
export class MyModule {
  static forRootAsync(options: MyModuleOptions): DynamicModule {
    return {
      module: MyModule,
      imports: [],
      providers: [
        {
          provide: MYMODULE_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
       {
          useFactory: (options:any) => {
            // 可以直接获取到 上下文中的  options
          },
          inject: [MYMODULE_OPTIONS],
       } 
      ]
    };
  }
}
```

## TypeORM 部分

### 关于我到底要不要在 独立的表 entity中添加附加字段 以关联到  中间表去

不添加到 独立的表 entity上

```ts
// 假设我们有role和user 它们是多对多关系，它们需要一个中间表user-role
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => UserRole, userRole => userRole.user)
  userRoles: UserRole[];
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => UserRole, userRole => userRole.role)
  userRoles: UserRole[];
}

@Entity()
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Role, role => role.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
```

添加上去

```ts
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}


@Entity()
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Role, role => role.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
```

这两种写法都是可以的，但是会有一些区别,

1. 如果不添加entity 你需要这样查询

```ts
const userRoles = await UserRole.find({ where: { user: user1 } });
const roles = userRoles.map(userRole => userRole.role);
```

2. 如果你添加了 那吗它的查询三这样的

```ts
const role = await Role.findOne({ where: { id: 1 }, relations: ['userRoles', 'userRoles.user'] });
const users = role.userRoles.map(userRole => userRole.user);
```

OneToMany 关系装饰器的作用是在实体之间建立一对多的关系，并且在数据库中生成外键约束来维护这种关系。如果您在 User 和 Role 实体中都定义了 userRoles 字段，并在这些字段上使用了 OneToMany 装饰器，那么您就可以通过这些字段来查询与用户和角色相关的中间表记录。

**如果您想要在实体之间建立一对多的关系并方便地查询相关记录，可以在实体中定义相应的字段并使用 OneToMany 装饰器。但是，如果您只需要简单地存储多对多关系，并且不需要查询相关记录，那么您可以像我之前展示的那样，在中间表中存储这些关系。**

### 关于自定义中间表的CRUD
>
> 相见这个 代码  <https://github.com/frane/typeorm-versions/blob/ba543918d9c67a48caffb369ba4b4e668ba72718/test/functional/active-record/entityWithCustomPropertiesManyToManyRelation/test.ts>

```ts
import "reflect-metadata";
import "mocha";
import { expect } from "chai";
import { closeTestingConnections, createTestingConnections, reloadTestingDatabases } from "../../../utils/test-utils";
import { Post } from "./Post";
import { Category } from "./Category";
import { VersionEvent } from "../../../../src";
import { PostToCategory } from './PostToCategory';
import { DataSource } from 'typeorm/data-source/DataSource';

describe("Active Record - Entity with custom properties ManyToMany relation", () => {

    let connections: DataSource[] = [];
    before(async () => connections = await createTestingConnections({
        entities: [Post, Category, PostToCategory],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("save 1 item", () => Promise.all(connections.map(async connection => {
        Post.useDataSource(connection);
        Category.useDataSource(connection);

        const postToCategory = new PostToCategory()
        postToCategory.active = false;

        const category = new Category();
        category.name = 'foo';

        postToCategory.category = category;

        let post = new Post();
        post.title = "hello";
        post.content = "World"
        post.postToCategories = [postToCategory];
        await post.save();

        const postsVersions = await post.versions().list();
        const categoriesVersions = await category.versions().list();

        expect(postsVersions.length).to.equal(1, `failed for ${connection.name}`);
        expect(postsVersions[0].event).to.equal(VersionEvent.INSERT, `failed for ${connection.name}`);
        expect(postsVersions[0].itemId).to.equal(post.id.toString());
        expect(postsVersions[0].itemType).to.equal(post.constructor.name);

        expect(categoriesVersions.length).to.equal(1, `failed for ${connection.name}`);
        expect(categoriesVersions[0].event).to.equal(VersionEvent.INSERT, `failed for ${connection.name}`);
        expect(categoriesVersions[0].itemId).to.equal(category.id.toString());
        expect(categoriesVersions[0].itemType).to.equal(category.constructor.name);

    })));
    it("save 2 items", () => Promise.all(connections.map(async connection => {
        Post.useDataSource(connection);
        Category.useDataSource(connection);

        const postToCategory = new PostToCategory()
        postToCategory.active = false;

        const category = new Category();
        category.name = 'foo';

        postToCategory.category = category;

        let post = new Post();
        post.title = "hello";
        post.content = "World"
        post.postToCategories = [postToCategory];
        await post.save();

        let post2 = new Post();
        post2.title = "hello";
        post2.content = "again";
        post2.postToCategories = [postToCategory]
        await post2.save();

        const postsVersions = await post2.versions().list();
        const categoriesVersions = await category.versions().list();

        expect(postsVersions.length).to.equal(1, `failed for ${connection.name}`);
        expect(postsVersions[0].event).to.equal(VersionEvent.INSERT, `failed for ${connection.name}`);
        expect(postsVersions[0].itemId).to.equal(post2.id.toString());
        expect(postsVersions[0].itemType).to.equal(post2.constructor.name);

        expect(categoriesVersions.length).to.equal(1, `failed for ${connection.name}`);
        expect(categoriesVersions[0].event).to.equal(VersionEvent.INSERT, `failed for ${connection.name}`);
        expect(categoriesVersions[0].itemId).to.equal(category.id.toString());
        expect(categoriesVersions[0].itemType).to.equal(category.constructor.name);
    })));

    it("update item", () => Promise.all(connections.map(async connection => {
        Post.useDataSource(connection);
        Category.useDataSource(connection);

        const postToCategory = new PostToCategory()
        postToCategory.active = false;

        const category = new Category();
        category.name = 'foo';

        postToCategory.category = category;

        let post = new Post();
        post.title = "hello";
        post.content = "World"
        post.postToCategories = [postToCategory];
        await post.save();

        post.content = "there!";
        await post.save();

        const postsVersions = await post.versions().list();
        const categoriesVersions = await category.versions().list();

        expect(postsVersions.length).to.equal(2, `failed for ${connection.name}`);
        expect(postsVersions[0].event).to.equal(VersionEvent.UPDATE, `failed for ${connection.name}`);
        expect(postsVersions[0].itemId).to.equal(post.id.toString());
        expect(postsVersions[0].itemType).to.equal(post.constructor.name);

        expect(categoriesVersions.length).to.equal(1, `failed for ${connection.name}`);
        expect(categoriesVersions[0].event).to.equal(VersionEvent.INSERT, `failed for ${connection.name}`);
        expect(categoriesVersions[0].itemId).to.equal(category.id.toString());
        expect(categoriesVersions[0].itemType).to.equal(category.constructor.name);
    })));

    it("remove item", () => Promise.all(connections.map(async connection => {
        Post.useDataSource(connection);
        Category.useDataSource(connection);

        const postToCategory = new PostToCategory()
        postToCategory.active = false;

        const category = new Category();
        category.name = 'foo';

        postToCategory.category = category;

        let post = new Post();
        post.title = "hello";
        post.content = "World"
        post.postToCategories = [postToCategory];
        await post.save();

        const postId = post.id;

        await post.remove();

        post.id = postId; // object loses id after removal, add it back to fetch versions
        const postsVersions = await post.versions().list();
        const categoriesVersions = await category.versions().list();

        expect(postsVersions.length).to.equal(2, `failed for ${connection.name}`);
        expect(postsVersions[0].event).to.equal(VersionEvent.REMOVE, `failed for ${connection.name}`);
        expect(postsVersions[0].itemId).to.equal(post.id.toString());
        expect(postsVersions[0].itemType).to.equal(post.constructor.name);

        expect(categoriesVersions.length).to.equal(1, `failed for ${connection.name}`);
        expect(categoriesVersions[0].event).to.equal(VersionEvent.INSERT, `failed for ${connection.name}`);
        expect(categoriesVersions[0].itemId).to.equal(category.id.toString());
        expect(categoriesVersions[0].itemType).to.equal(category.constructor.name);
    })));

    it("version navigation", () => Promise.all(connections.map(async connection => {
        Post.useDataSource(connection);
        Category.useDataSource(connection);

        const postToCategory = new PostToCategory()
        postToCategory.active = false;

        const category = new Category();
        category.name = 'foo';

        postToCategory.category = category;

        let post = new Post();
        post.title = "hello";
        post.content = "World"
        post.postToCategories = [postToCategory];
        await post.save();

        post.title = "Bye";
        await post.save();

        const previousVersion = await post.versions().previous();
        const latestVersion = await post.versions().latest();

        expect((await previousVersion!.next())!.id).to.equal(latestVersion!.id, `failed for ${connection.name}`);
        expect((await latestVersion!.previous())!.id).to
          .equal(previousVersion!.id, `failed for ${connection.name}`);

        expect(await previousVersion!.previous()).to.equal(null, `failed for ${connection.name}`);
        expect(await latestVersion!.next()).to.equal(null, `failed for ${connection.name}`);
    })));
});
```
