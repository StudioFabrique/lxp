# Système RBAC dans le LXP ANDRIA

## La gestion de rôles
Le système de gestion des rôles (RBAC - Role Based Access Control) dans ANDRIA permet d'attribuer des permissions spécifiques aux utilisateurs selon leur rôle.

À la création d'un utilisateur, un rôle lui sera attribué pour déterminer ses droits d'accès.

Plusieurs types de rôles sont disponibles :

- Rôle interface : contient des permissions pour autoriser des dispositions différentes
  - Format rôle : `interface:<role>`
  - Format permissions : `layout:<nom>`, `component:<nom>`
  - exemple :
  - `interface:admin -> layout:admin, layout:teacher, layout:student, layout:guest, component:admin-panel, component:teacher-tools, component:calendar`
    > Aura accès à plusieurs interfaces : l'interface admin, l'interface enseignant, l'interface étudiant et l'interface visiteur
  - `interface:teacher -> layout:teacher, layout:student, component:teacher-tools, component:course-overview`
    > Aura accès à deux interfaces : l'interface enseignant et l'interface étudiant
  - Si on ajoute `interface:admin` et `interface:teacher` à un utilisateur, il pourra accéder à `layout:admin, layout:teacher, layout:student, layout:guest, component:admin-panel, component:teacher-tools, component:calendar, component:course-overview`
      > L'utilisateur aura accès à toutes les interfaces et composants des deux rôles

- Rôles basiques : contient des permissions pour déterminer les autorisations à des actions (serveur et interface)
  - Format rôle : `<role>`
  - Format permissions : `<action>:<nom>`
  - exemple :
    - `admin -> create:course, delete:course, read:course, update:course, create:user, delete:user`
    - `teacher -> create:course, read:course, update:course`
    - `student -> read:course`
