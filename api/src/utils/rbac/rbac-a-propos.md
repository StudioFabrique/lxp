# Système RBAC dans le LXP ANDRIA

## La gestion de rôles
Le système de gestion des rôles (RBAC - Role Based Access Control) dans ANDRIA permet d'attribuer des permissions spécifiques aux utilisateurs selon leur rôle.

À la création d'un utilisateur, un rôle lui sera attribué pour déterminer ses droits d'accès.

Les rôles contiennent des permissions qui déterminent les autorisations à des actions (serveur et interface). Le rang du rôle métier détermine l'espace affiché : administration/formation pour les rangs 1 et 2, apprentissage à partir du rang 3.

- Rôles :
  - Format rôle : `<role>`
  - Format permissions : `<action>:<nom>`
  - exemple :
    - `admin -> create:course, delete:course, read:course, update:course, create:user, delete:user`
    - `teacher -> create:course, read:course, update:course`
    - `student -> read:course`
