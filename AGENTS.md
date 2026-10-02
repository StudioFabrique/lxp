# Règles du projet pour les agents IA

Lire ce fichier avant toute intervention dans le projet. Les conventions frontend ci-dessous s'appliquent à `front/` et à tous ses sous-répertoires. Les conventions de modification s'appliquent à tout le projet.

## Classes CSS : utilisation obligatoire de `cn()`

- Utiliser l'utilitaire existant `front/src/utils/cn.ts` pour **toute classe conditionnelle et toute combinaison dynamique de classes** dans `className`.
- La syntaxe JSX attendue est `className={cn(...)}`. Importer `cn` avec un chemin relatif adapté au fichier.
- Placer les classes communes en premier, les classes conditionnelles ensuite et la prop `className` en dernier lorsqu'elle doit permettre une personnalisation.
- Utiliser `condition && "classe"` pour une classe optionnelle, et `condition ? "classe-a" : "classe-b"` pour deux variantes, à l'intérieur de `cn()`.
- Ne pas construire ces listes de classes par concaténation (`+`), interpolation de chaînes, ou assemblage de tableaux avec `filter().join()` ; ne pas remplacer `cn()` par un appel direct à `clsx` ou `twMerge`.
- Cette obligation s'applique aussi aux variables et fonctions intermédiaires qui produisent les classes. Une variable déjà calculée avec `cn()` peut être transmise directement à `className`.
- Les classes entièrement statiques peuvent rester sous la forme `className="..."`. Une prop `className` simplement transmise peut rester sous la forme `className={className}`.
- Conserver les noms complets des classes Tailwind dans le code pour permettre leur détection à la compilation. Préférer une table de variantes explicites à la construction d'un nom comme `bg-${color}`.
- `cn()` fusionne les classes Tailwind incompatibles : vérifier l'ordre des arguments pour conserver la priorité souhaitée.

```tsx
import { cn } from "../../utils/cn";

<button
  className={cn(
    "btn",
    selected ? "btn-primary" : "btn-outline",
    disabled && "opacity-50",
    className,
  )}
/>

const inputClassName = cn("input input-bordered", hasError && "input-error");
<input className={inputClassName} />;
```

## Frontend : séparateurs visuels

- Ne pas utiliser de caractères textuels comme le point médian (`·`) ou le tiret cadratin (em dash, Unicode U+2014) pour séparer des informations dans l'interface.
- Utiliser de vrais éléments visuels : le composant DaisyUI `divider`, sa variante `divider-horizontal`, ou une bordure CSS sur un élément dédié, selon la disposition.
- Ne pas simuler ces séparateurs par le contenu textuel d'un pseudo-élément CSS.
- Pour une séparation purement décorative, utiliser `aria-hidden="true"`. Utiliser `<hr>` lorsqu'une séparation thématique du contenu est pertinente.

## Frontend : composants et couleurs DaisyUI

- Utiliser autant que possible les composants et classes DaisyUI : `btn`, `card`, `modal`, `input`, `select`, `badge`, `alert`, `tabs`, `divider`, etc.
- Réutiliser les composants du projet qui encapsulent ces éléments avant de créer un nouveau composant ou des styles spécifiques.
- Utiliser Tailwind pour la disposition, l'espacement et les adaptations nécessaires autour des composants DaisyUI.
- Utiliser les couleurs sémantiques du thème DaisyUI : `primary`, `secondary`, `accent`, `neutral`, `base-100`, `base-200`, `base-300`, `base-content`, `info`, `success`, `warning`, `error` et leurs couleurs de contenu associées.
- Associer les fonds et textes appropriés, par exemple `bg-primary text-primary-content` ou `bg-base-100 text-base-content`.
- Éviter les couleurs fixes pour les éléments de l'interface : valeurs hexadécimales, RGB/HSL et palettes Tailwind comme `gray-*` ou `blue-*`. Les couleurs propres aux logos, médias ou données métier peuvent être conservées lorsqu'elles portent une signification indépendante du thème.
- Si une couleur doit être passée à une bibliothèque ou à un style inline, utiliser les variables CSS du thème DaisyUI, par exemple `var(--color-primary)`.
- Vérifier que les choix de couleurs restent lisibles dans les thèmes clair et sombre.

## Frontend : un composant par fichier

- **Un composant React frontend = un fichier.** Ne pas déclarer plusieurs composants dans un même fichier, même si les composants secondaires ne sont pas exportés.
- Extraire chaque sous-composant dans son propre fichier et l'importer dans le composant parent.
- Nommer le fichier d'après le composant, en respectant la convention de nommage du répertoire.
- Les types des props, constantes locales et fonctions utilitaires propres au composant peuvent rester dans son fichier tant qu'ils ne constituent pas d'autres composants.
- Placer les hooks et utilitaires partagés dans des fichiers dédiés.
- Appliquer cette règle aux nouveaux composants et aux composants refactorisés, sans lancer une réorganisation globale non demandée.

## Conventions de modification

- Réutiliser les composants, hooks et utilitaires existants et respecter l'organisation du code autour du fichier modifié.
- Préserver les modifications en cours et limiter les changements à la demande.
- Conserver l'accessibilité des contrôles, notamment les labels, la navigation clavier et les états désactivés.
- Après une modification de code frontend, exécuter depuis `front/` les vérifications adaptées : `npm run build`, le lint des fichiers modifiés et les tests existants concernés si le comportement change. Pour les autres parties du projet, utiliser les vérifications adaptées à leur périmètre.
- Signaler les vérifications qui échouent ou qui n'ont pas pu être exécutées.
