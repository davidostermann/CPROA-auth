# Exercices 1

## Préambule

Run SQL file setup_ex1.sql (cf. README.md)

## Afficher les lists avec leurs cards associées :

```sql
SELECT li.id as id, li.name as name, c.id as cid, c.name as cname
FROM lists as li
JOIN cards as c ON li.id = c.list_id
```

### En mieux, avec aggrégation (GROUP BY et JSON_ARRAYAGG) :

```sql
SELECT li.id, li.name,
json_agg(
  json_build_object('id', c.id, 'name', c.name)
) as cards
FROM lists as li
JOIN cards as c ON li.id = c.list_id
GROUP BY li.id;
```

## Afficher tous les users avec leurs cards associées :

```sql
SELECT u.id, u.lastname, u.firstname, c.id, c.name
FROM users as u
INNER JOIN users_cards as uc ON uc.user_id = u.id
INNER JOIN cards as c ON uc.card_id = c.id;
```

### Et en JSON exploitable directement :

```sql
SELECT u.id, 
CONCAT(u.lastname,' ', u.firstname) as name, 
json_agg(
  json_build_object('id', uc.card_id, 'name', c.name)
) as cards
FROM users as u
JOIN users_cards as uc ON u.id = uc.user_id
JOIN cards as c ON c.id = uc.card_id
GROUP BY u.id;
```

## Afficher les lists avec pour chacune les cards et pour chaque cards les users associés

```sql
SELECT li.id, li.name, c.id as cid, c.name as cardname, u.id as uid, 
CONCAT(u.lastname,' ', u.firstname) as username 
FROM lists as li
JOIN cards as c ON li.id = c.list_id
JOIN users_cards as uc ON c.id = uc.card_id
JOIN users as u ON u.id = uc.user_id
ORDER BY li.id;
```

### Pas mieux sans nested SELECT :

```sql
SELECT li.id, li.name, JSON_AGG( 
  JSON_BUILD_OBJECT(
    'id', uc.card_id, 'name', c.name, 'user', 
    JSON_BUILD_OBJECT( 
      'id', uc.user_id, 'name', 
      CONCAT(u.lastname,' ', u.firstname) 
    ) 
  )
) as cards
FROM lists as li
JOIN cards as c ON li.id = c.list_id
JOIN users_cards as uc ON c.id = uc.card_id
JOIN users as u ON u.id = uc.user_id
GROUP BY li.id
ORDER BY li.id;
```

### Avec nested SELECT :
(Celle-ci, elle a été galère à faire !)

```sql
SELECT 
li.id as id, 
li.name as name, 
JSON_AGG(
  JSON_BUILD_OBJECT('id', c.id, 'name', c.name, 'users', ucr.users)
) as cards 
FROM
(
  SELECT uc.card_id as cid, 
  JSON_AGG(
    JSON_BUILD_OBJECT(
      'id', uc.user_id, 
      'name', CONCAT(u.lastname,' ', u.firstname)
    )
  ) as users
  FROM users_cards as uc
  JOIN users as u ON u.id = uc.user_id
  GROUP BY uc.card_id
) ucr
JOIN cards as c ON ucr.tid = c.id
JOIN lists as li ON li.id = c.list_id
GROUP BY li.id
ORDER BY li.id;
```
