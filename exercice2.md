# Exercices 2

## Préambule

Run SQL file setup_ex2.sql (cf. README.md)

## Afficher toutes les cards du user 1

Vous devez associer la table de jointure :

```sql
SELECT c.name 
FROM cards as c
JOIN users_cards_lists as ucl ON c.id = ucl.card_id
WHERE ucl.user_id = 1;
```

Dans l'autre sens :

```sql
SELECT c.name 
FROM users_cards_lists as ucl
JOIN cards as c ON c.id = ucl.card_id
WHERE ucl.user_id = 1;
```

## Afficher tous les users qui ont des cards en lists 1

```sql
SELECT u.firstname
FROM users_cards_lists as ucl
JOIN users as u ON u.id = ucl.user_id
JOIN cards as c ON c.id = ucl.card_id
WHERE ucl.list_id = 1;
```

En mieux avec DISTINCT :

```sql
SELECT DISTINCT u.firstname
FROM users_cards_lists as ucl
JOIN users as u ON u.id = ucl.user_id
JOIN cards as c ON c.id = ucl.card_id
WHERE ucl.list_id = 1;
```

## Pour plus de détail, ajouter, pour chaque utilisateur, le nom des cards qu'ils ont en liste 1

```sql
SELECT u.firstname, array_agg( c.name )
FROM users_cards_lists as ucl
JOIN users as u ON u.id = ucl.user_id
JOIN cards as c ON c.id = ucl.card_id
WHERE ucl.list_id = 1
GROUP BY u.id;
```

## Afficher les cards avec les lists associés:

```sql
SELECT c.id, c.name, cat.name
FROM cards as c
JOIN users_cards_lists as ucl ON ucl.card_id = c.id
JOIN lists as cat ON cat.id = ucl.list_id
ORDER BY c.id
```

En mieux en groupant : 

```sql 
SELECT c.id as card_id, c.name, array_agg( DISTINCT  l.name )
FROM cards as c
JOIN users_cards_lists as ucl ON ucl.card_id = c.id
JOIN lists as l ON l.id = ucl.list_id
GROUP BY c.id
ORDER BY c.id
```

En JSON :

```sql 
SELECT c.id as card_id, c.name, json_agg( DISTINCT  l.name ) as lists
FROM cards as c
JOIN users_cards_lists as ucl ON ucl.card_id = c.id
JOIN lists as l ON l.id = ucl.list_id
GROUP BY c.id
ORDER BY c.id
```

## Afficher les listes avec leurs tâches associées et avec pour chaque tâches, la liste des utilisateurs associés

#### la sous-requete 
```sql
SELECT c.id as cid, c.name as cname, ucl.list_id as lid, 
  JSON_AGG( u.firstname ) as users
  FROM users_cards_lists as ucl
  JOIN users as u ON u.id = ucl.user_id
  JOIN cards as c ON c.id = ucl.card_id
  GROUP BY c.id, ucl.list_id
```

#### La requete final

```sql
SELECT l.name, JSON_AGG( JSON_BUILD_OBJECT('card', rucl.cname, 'users', rucl.users )) as cards
FROM (
  SELECT c.id as cid, c.name as cname, ucl.list_id as lid, 
  JSON_AGG( u.firstname ) as users
  FROM users_cards_lists as ucl
  JOIN users as u ON u.id = ucl.user_id
  JOIN cards as c ON c.id = ucl.card_id
  GROUP BY c.id, ucl.list_id
) as rucl
JOIN lists as l ON l.id = rucl.lid
GROUP BY l.id
```