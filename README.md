# postgresql 10 and JSON output

ref. : 
* https://stackoverflow.com/questions/35949485/how-to-aggregate-an-array-of-json-objects-with-postgres

Interesting :
* https://www.periscopedata.com/blog/the-lazy-analysts-guide-to-postgres-json.html

To list missing indexes :

* https://stackoverflow.com/questions/970562/postgres-and-indexes-on-foreign-keys-and-primary-keys

Very good article on NoSQL relation in PostgreSQL :

* **http://blog.bguiz.com/2017/postgres-many2many-sql-non-relational/**

## Install DB and Adminer :

```
docker-compose up
```
## Connection

### Go to localhost:8080

Credentials :
``` 
System : PostgreSQL
Server : db
Username : dost
Password : changeme
Database : tododb
```

### Or connect via psql command line cli :

```docker ps``` to retrieve psotgres container ID

```docker exec -ti [postgres container ID] bash``` to start shell interface

```psql tododb -U dost``` to run psql command line cli

## Tables Creation and Population
  
* via Adminer :
  
  * Verify you are on tododb (you see tododb as selected DB on the left)
  * click on "run sql command"
  * copy/paste setup.sql content
  * click on "execute"

# Exercices

## Afficher les categories avec leurs todos associées :

```sql
SELECT c.id as id, c.name as name, t.id as tid, t.name as tname
FROM categories as c
JOIN todos as t ON c.id = t.category_id
```

### En mieux, avec aggrégation (GROUP BY et JSON_ARRAYAGG) :

```sql
SELECT c.id, c.name,
json_agg(
  json_build_object('id', t.id, 'name', t.name)
) as todos
FROM categories as c 
JOIN todos as t ON c.id = t.category_id
GROUP BY c.id;
```

## Afficher tous les users avec leurs todos associées :

```sql
SELECT u.id, u.lastname, u.firstname, t.id, t.name
FROM users as u
INNER JOIN users_todos as ut ON ut.user_id = u.id
INNER JOIN todos as t ON ut.todo_id = t.id;
```

### Et en JSON exploitable directement :

```sql
SELECT u.id, 
CONCAT(u.lastname,' ', u.firstname) as name, 
json_agg(json_build_object('id', ut.todo_id, 'name', t.name)) as todos
FROM users as u
JOIN users_todos as ut ON u.id = ut.user_id
JOIN todos as t ON t.id = ut.todo_id
GROUP BY u.id;
```

## Afficher les categories avec pour chacune les todos et pour chaque todos les users associés

```sql
SELECT c.id, c.name, t.id as tid, t.name as todoname, u.id as uid, 
CONCAT(u.lastname,' ', u.firstname) as username 
FROM categories as c
JOIN todos as t ON c.id = t.category_id
JOIN users_todos as ut ON t.id = ut.todo_id
JOIN users as u ON u.id = ut.user_id
ORDER BY c.id;
```

### Pas mieux sans nested SELECT :

```sql
SELECT c.id, c.name, JSON_AGG( 
JSON_BUILD_OBJECT('id', ut.todo_id, 'name', t.name, 'user', 
JSON_BUILD_OBJECT( 'id', ut.user_id, 'name', CONCAT(u.lastname,' ', u.firstname) ) ) ) as todos
FROM categories as c
JOIN todos as t ON c.id = t.category_id
JOIN users_todos as ut ON t.id = ut.todo_id
JOIN users as u ON u.id = ut.user_id
GROUP BY c.id
ORDER BY c.id;
```

### Avec nested SELECT :
(Celle-ci, elle a été galère à faire !)

```sql
SELECT 
c.id as id, 
c.name as name, 
JSON_AGG(
  JSON_BUILD_OBJECT('id', t.id, 'name', t.name, 'users', utr.users)
) as todos 
FROM
(
  SELECT ut.todo_id as tid, 
  JSON_AGG(
    JSON_BUILD_OBJECT(
      'id', ut.user_id, 
      'name', CONCAT(u.lastname,' ', u.firstname)
    )
  ) as users
  FROM users_todos as ut
  JOIN users as u ON u.id = ut.user_id
  GROUP BY ut.todo_id
) utr
JOIN todos as t ON utr.tid = t.id
JOIN categories as c ON c.id = t.category_id
GROUP BY c.id
ORDER BY c.id;
```
