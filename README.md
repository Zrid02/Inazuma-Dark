# Inazuma Dark - Le Football des Ténèbres

Un jeu narratif inspiré de **Fear and Hunger** dans l'univers d'**Inazuma Eleven**.

## 🎮 Description

Inazuma Dark est un jeu de rôle narratif où vous incarnez l'un des trois personnages emblématiques de l'univers Inazuma Eleven. Chaque personnage a sa propre histoire qui suit l'anime, avec un système de choix permettant des histoires alternatives.

## ⚽ Personnages Jouables

### Mark Evans (Gardien)
- **Équipe de départ**: Raimon
- **Élément**: Vent 🌪️
- **Spécialité**: ARRÊTER les buts au lieu de les marquer
- **Techniques**: Main Céleste, Poing de la Justice, Main Démoniaque
- **Stats principales**: Défense élevée (90)

### Axel Blaze (Attaquant)
- **Équipe de départ**: Raimon
- **Élément**: Feu 🔥
- **Spécialité**: MARQUER des buts avec puissance
- **Techniques**: Tornade de Feu, Tempête de Feu, Tir du Tigre
- **Stats principales**: Attaque élevée (95)

### Jude Sharp (Stratège)
- **Équipe de départ**: Royal Academy
- **Élément**: Terre 🌍
- **Spécialité**: Tactique et analyse
- **Techniques**: Pingouin Empereur, Regard Perçant, Dribble Fantôme
- **Stats principales**: Technique élevée (95)

## 🎯 Fonctionnalités

### Système de Sélection de Personnage
- Choisissez parmi 3 personnages uniques au début
- Chaque personnage a son propre style de jeu et ses techniques

### Histoire Ramifiée
- Suivez l'histoire de l'anime avec des variations
- Faites des choix qui influencent le déroulement
- Découvrez des fins multiples (Bonne, Neutre, Sombre)

### Combats 1vs1
- Système de combat tactique au tour par tour
- 4 actions: Attaquer, Techniques, Défendre, Analyser
- Système d'éléments avec avantages/désavantages
  - 🔥 Feu > 🌳 Bois
  - 🌳 Bois > 🌍 Terre
  - 🌍 Terre > 🌪️ Vent
  - 🌪️ Vent > 🔥 Feu

### Types et Techniques
- Chaque personnage a des techniques uniques
- Coût en TP (Technique Points) pour les techniques spéciales
- Bonus élémentaires basés sur les types

## 🚀 Comment Jouer

1. Ouvrez `index.html` dans votre navigateur
2. Cliquez sur "Nouvelle Partie"
3. Sélectionnez votre personnage
4. Suivez l'histoire et faites vos choix
5. Combattez en 1vs1 lors des duels

### Contrôles

**Histoire:**
- `Espace` ou `Entrée`: Continuer le dialogue
- `1-9`: Sélectionner un choix

**Combat:**
- `A`: Attaquer
- `T`: Ouvrir les techniques
- `D`: Défendre
- `N`: Analyser l'ennemi
- `Échap`: Fermer le menu techniques

## 📁 Structure du Projet

```
Inazuma-Dark/
├── index.html              # Page principale du jeu
├── styles.css              # Styles CSS
├── README.md               # Documentation
└── src/
    ├── game.js             # Moteur de jeu principal
    ├── ui.js               # Contrôleur d'interface
    ├── characters/
    │   └── characters.js   # Définitions des personnages
    ├── story/
    │   └── story.js        # Système narratif et histoires
    ├── battle/
    │   └── battle.js       # Système de combat
    └── assets/             # Ressources (images, sons)
```

## 🎨 Inspirations

- **Fear and Hunger**: Ambiance sombre, choix conséquents, gameplay tactique
- **Inazuma Eleven**: Personnages, univers du football, techniques spéciales

## 📝 Notes de Version

### v1.0.0
- Sélection de personnage (Mark, Axel, Jude)
- Histoires complètes pour les 3 personnages
- Système de combat 1vs1
- Système de choix avec conséquences
- Fins multiples par personnage
- Sauvegarde locale

## 📄 Licence

Projet fan-made inspiré par Inazuma Eleven (Level-5) et Fear and Hunger (Miro Haverinen).