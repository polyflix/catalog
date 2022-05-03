# How migrations work

https://github.com/typeorm/typeorm/blob/master/docs/migrations.md

You should never directly modify a migration file that have been already pushed to master or develop.  
You need to generate a new migration file if you want to update database config.  
(Obviously you can change/customize a migration file, you recently generated in your work/feature branch)

## create a migration file

```bash
npm run typeorm migration:generate -- -n <migration_name>
```

## Upgrade DB to last migration file

```bash
npm run typeorm migration:run
```

## Downgrade DB

```bash
npm run typeorm migration:revert
```

---

## Populate database with sample

### Load seeds in database

First, build and run app to create ormconfig file
(It will overwrite existing database data)

```bash
npm run db:sample
```

Sample : https://github.com/RobinCK/typeorm-fixtures-sample

### Create custom seeds

Seed always start by a number and underscore. The reason is that we need to care about execution order, to allow foreigns keys utilisation.  
Seed are appended to database in ascending order.

If you need to hardcode an id, checkout: https://www.uuidgenerator.net
Seed documentation : https://github.com/RobinCK/typeorm-fixtures
