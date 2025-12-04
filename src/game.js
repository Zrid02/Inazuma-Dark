/**
 * Inazuma Dark - Game Engine
 * Moteur de jeu principal coordonnant tous les systèmes
 */

/**
 * États du jeu
 */
const GameState = {
    MENU: 'menu',
    CHARACTER_SELECT: 'character_select',
    STORY: 'story',
    BATTLE: 'battle',
    ENDING: 'ending',
    GAME_OVER: 'game_over'
};

/**
 * Classe principale du jeu
 */
class InazumaDarkGame {
    constructor() {
        this.state = GameState.MENU;
        this.selectedCharacter = null;
        this.storyManager = null;
        this.currentBattle = null;
        this.gameData = {
            endings: [],
            totalPlaytime: 0,
            unlockedCharacters: ['mark', 'axel', 'jude']
        };
    }

    /**
     * Initialiser le jeu
     */
    initialize() {
        console.log("=================================");
        console.log("   INAZUMA DARK");
        console.log("   Un jeu inspiré de Fear and Hunger");
        console.log("   Dans l'univers d'Inazuma Eleven");
        console.log("=================================\n");
        
        this.state = GameState.MENU;
        this.loadSaveData();
        
        return this.getMenuOptions();
    }

    /**
     * Obtenir les options du menu principal
     */
    getMenuOptions() {
        return {
            title: "INAZUMA DARK",
            subtitle: "Le Football des Ténèbres",
            options: [
                { id: 'new_game', label: 'Nouvelle Partie' },
                { id: 'continue', label: 'Continuer', disabled: !this.hasSaveData() },
                { id: 'credits', label: 'Crédits' }
            ]
        };
    }

    /**
     * Démarrer une nouvelle partie
     */
    startNewGame() {
        this.state = GameState.CHARACTER_SELECT;
        return this.getCharacterSelectOptions();
    }

    /**
     * Obtenir les options de sélection de personnage
     */
    getCharacterSelectOptions() {
        const characters = [];
        
        // Import des personnages
        let allCharacters;
        if (typeof getAllPlayableCharacters !== 'undefined') {
            allCharacters = getAllPlayableCharacters();
        } else {
            const { getAllPlayableCharacters: getAll } = require('./characters/characters.js');
            allCharacters = getAll();
        }

        allCharacters.forEach(char => {
            characters.push({
                id: char.id,
                name: char.name,
                team: char.team,
                type: char.characterType,
                element: char.element,
                description: char.backstory,
                stats: char.stats,
                techniques: char.techniques.map(t => t.name),
                unlocked: this.gameData.unlockedCharacters.includes(char.id)
            });
        });

        return {
            title: "CHOISISSEZ VOTRE DESTIN",
            characters: characters,
            descriptions: {
                mark: "Mark Evans - Le gardien passionné de Raimon. Sa mécanique unique est d'ARRÊTER les buts au lieu de les marquer. Spécialisé en défense et techniques de gardien.",
                axel: "Axel Blaze - L'attaquant de feu de Raimon. Son talent offensif est inégalé. Débute avec l'équipe de Raimon.",
                jude: "Jude Sharp - Le stratège de la Royal Academy. Son intelligence tactique fait de lui un redoutable adversaire. Débute avec la Royal Academy."
            }
        };
    }

    /**
     * Sélectionner un personnage et démarrer l'histoire
     */
    selectCharacter(characterId) {
        if (!this.gameData.unlockedCharacters.includes(characterId)) {
            return { error: "Ce personnage n'est pas débloqué!" };
        }

        // Créer une instance du personnage
        let character;
        if (typeof createCharacterInstance !== 'undefined') {
            character = createCharacterInstance(characterId);
        } else {
            const { createCharacterInstance: createChar } = require('./characters/characters.js');
            character = createChar(characterId);
        }

        if (!character) {
            return { error: "Personnage non trouvé!" };
        }

        this.selectedCharacter = character;

        // Initialiser le gestionnaire d'histoire
        if (typeof StoryManager !== 'undefined') {
            this.storyManager = new StoryManager();
        } else {
            const { StoryManager: SM } = require('./story/story.js');
            this.storyManager = new SM();
        }

        this.storyManager.startStory(characterId);
        this.state = GameState.STORY;

        return this.getCurrentStoryState();
    }

    /**
     * Obtenir l'état actuel de l'histoire
     */
    getCurrentStoryState() {
        const node = this.storyManager.getCurrentNode();
        if (!node) {
            return { error: "Erreur dans l'histoire!" };
        }

        const baseState = {
            type: node.type,
            character: this.selectedCharacter.name
        };

        switch (node.type) {
            case 'dialogue':
                return {
                    ...baseState,
                    speaker: node.content.speaker,
                    text: node.content.text,
                    background: node.content.background,
                    canContinue: true
                };

            case 'choice':
                return {
                    ...baseState,
                    prompt: node.content.prompt,
                    choices: node.content.choices.map((c, i) => ({
                        index: i,
                        text: c.text
                    })),
                    canContinue: false
                };

            case 'battle':
                return {
                    ...baseState,
                    opponent: node.content.opponent,
                    difficulty: node.content.difficulty,
                    needsBattle: true
                };

            case 'ending':
                this.state = GameState.ENDING;
                this.recordEnding(node.content);
                return {
                    ...baseState,
                    title: node.content.title,
                    text: node.content.text,
                    endingType: node.content.ending_type,
                    isEnding: true
                };
        }
    }

    /**
     * Avancer dans l'histoire
     */
    advanceStory(choiceIndex = null) {
        if (this.state !== GameState.STORY) {
            return { error: "Pas dans le mode histoire!" };
        }

        const currentNode = this.storyManager.getCurrentNode();

        // Si c'est un nœud de combat, lancer le combat
        if (currentNode.type === 'battle') {
            return this.startBattle(currentNode.content.opponent, currentNode.content.difficulty);
        }

        this.storyManager.advance(choiceIndex);
        return this.getCurrentStoryState();
    }

    /**
     * Démarrer un combat
     */
    startBattle(opponentId, difficulty) {
        this.state = GameState.BATTLE;

        let BattleFactoryClass;
        if (typeof BattleFactory !== 'undefined') {
            BattleFactoryClass = BattleFactory;
        } else {
            const { BattleFactory: BF } = require('./battle/battle.js');
            BattleFactoryClass = BF;
        }

        this.currentBattle = BattleFactoryClass.createBattleWithDifficulty(
            this.selectedCharacter,
            opponentId,
            difficulty
        );

        return this.getBattleState();
    }

    /**
     * Obtenir l'état du combat
     */
    getBattleState() {
        if (!this.currentBattle) {
            return { error: "Aucun combat en cours!" };
        }

        const status = this.currentBattle.getBattleStatus();
        
        return {
            state: 'battle',
            ...status,
            actions: [
                { id: 'attack', label: 'Attaquer' },
                { id: 'technique', label: 'Technique', techniques: status.player.techniques },
                { id: 'defend', label: 'Défendre' },
                { id: 'analyze', label: 'Analyser' }
            ]
        };
    }

    /**
     * Exécuter une action de combat
     */
    executeBattleAction(actionType, techniqueIndex = null) {
        if (this.state !== GameState.BATTLE || !this.currentBattle) {
            return { error: "Aucun combat en cours!" };
        }

        // Tour du joueur
        const playerResult = this.currentBattle.executePlayerAction(actionType, techniqueIndex);
        const results = [playerResult];

        // Vérifier si le combat est terminé
        if (this.currentBattle.isBattleOver()) {
            return this.handleBattleEnd();
        }

        // Tour de l'ennemi
        const enemyResult = this.currentBattle.executeEnemyAction();
        results.push(enemyResult);

        // Vérifier à nouveau si le combat est terminé
        if (this.currentBattle.isBattleOver()) {
            return this.handleBattleEnd();
        }

        return {
            ...this.getBattleState(),
            turnResults: results
        };
    }

    /**
     * Gérer la fin d'un combat
     */
    handleBattleEnd() {
        const result = this.currentBattle.getBattleResult();
        const playerWon = result.winner === 'player';

        // Mettre à jour l'histoire avec le résultat du combat
        this.storyManager.setBattleResult(playerWon);
        this.state = GameState.STORY;
        this.currentBattle = null;

        return {
            battleEnd: true,
            winner: result.winner,
            turns: result.turns,
            message: playerWon 
                ? "Victoire! Vous avez gagné le duel!" 
                : "Défaite... L'adversaire était trop fort.",
            nextStoryState: this.getCurrentStoryState()
        };
    }

    /**
     * Enregistrer une fin obtenue
     */
    recordEnding(endingContent) {
        const ending = {
            title: endingContent.title,
            type: endingContent.ending_type,
            character: this.selectedCharacter.id,
            date: new Date().toISOString()
        };

        if (!this.gameData.endings.find(e => 
            e.title === ending.title && e.character === ending.character)) {
            this.gameData.endings.push(ending);
            this.saveGameData();
        }
    }

    /**
     * Vérifier s'il y a des données sauvegardées
     */
    hasSaveData() {
        // En environnement browser, utiliser localStorage
        if (typeof localStorage !== 'undefined') {
            return !!localStorage.getItem('inazuma_dark_save');
        }
        return false;
    }

    /**
     * Charger les données sauvegardées
     */
    loadSaveData() {
        if (typeof localStorage !== 'undefined') {
            const saved = localStorage.getItem('inazuma_dark_data');
            if (saved) {
                this.gameData = JSON.parse(saved);
            }
        }
    }

    /**
     * Sauvegarder les données du jeu
     */
    saveGameData() {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('inazuma_dark_data', JSON.stringify(this.gameData));
        }
    }

    /**
     * Sauvegarder la partie en cours
     */
    saveCurrentGame() {
        if (this.storyManager && typeof localStorage !== 'undefined') {
            const saveState = {
                character: this.selectedCharacter.id,
                storyState: this.storyManager.saveState(),
                state: this.state
            };
            localStorage.setItem('inazuma_dark_save', JSON.stringify(saveState));
            return { success: true, message: "Partie sauvegardée!" };
        }
        return { success: false, message: "Impossible de sauvegarder." };
    }

    /**
     * Charger une partie sauvegardée
     */
    loadSavedGame() {
        if (typeof localStorage !== 'undefined') {
            const saved = localStorage.getItem('inazuma_dark_save');
            if (saved) {
                const saveState = JSON.parse(saved);
                this.selectCharacter(saveState.character);
                this.storyManager.loadState(saveState.storyState);
                this.state = saveState.state;
                return this.getCurrentStoryState();
            }
        }
        return { error: "Aucune sauvegarde trouvée!" };
    }

    /**
     * Obtenir les crédits
     */
    getCredits() {
        return {
            title: "CRÉDITS",
            content: [
                "INAZUMA DARK",
                "",
                "Un jeu inspiré de:",
                "- Inazuma Eleven (Level-5)",
                "- Fear and Hunger (Miro Haverinen)",
                "",
                "Personnages:",
                "- Mark Evans (Gardien)",
                "- Axel Blaze (Attaquant)",
                "- Jude Sharp (Stratège)",
                "",
                "Systèmes de jeu:",
                "- Sélection de personnage unique",
                "- Histoire ramifiée avec choix multiples",
                "- Combats 1vs1 tactiques",
                "- Techniques spéciales élémentaires",
                "",
                "© 2024 Inazuma Dark Project"
            ]
        };
    }

    /**
     * Obtenir l'état global du jeu pour l'affichage
     */
    getGameState() {
        return {
            currentState: this.state,
            character: this.selectedCharacter ? {
                name: this.selectedCharacter.name,
                hp: this.selectedCharacter.currentHP,
                maxHp: this.selectedCharacter.stats.endurance,
                tp: this.selectedCharacter.currentTP
            } : null,
            hasSave: this.hasSaveData(),
            endings: this.gameData.endings.length
        };
    }
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GameState,
        InazumaDarkGame
    };
}

// Initialisation automatique pour le navigateur
if (typeof window !== 'undefined') {
    window.InazumaDarkGame = InazumaDarkGame;
    window.GameState = GameState;
}
