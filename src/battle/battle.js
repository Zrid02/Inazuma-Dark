/**
 * Inazuma Dark - Battle System
 * Système de combat 1vs1 style Fear and Hunger
 */

/**
 * Types d'actions en combat
 */
const BattleActionType = {
    ATTACK: 'attack',
    TECHNIQUE: 'technique',
    DEFEND: 'defend',
    ANALYZE: 'analyze'
};

/**
 * États de combat
 */
const BattleState = {
    PLAYER_TURN: 'player_turn',
    ENEMY_TURN: 'enemy_turn',
    PLAYER_WIN: 'player_win',
    ENEMY_WIN: 'enemy_win',
    DRAW: 'draw'
};

/**
 * Résultat d'une action
 */
class ActionResult {
    constructor(success, damage, message, effects = []) {
        this.success = success;
        this.damage = damage;
        this.message = message;
        this.effects = effects;
    }
}

/**
 * Classe de gestion des combats 1vs1
 */
class BattleSystem {
    constructor(player, enemy) {
        this.player = this.prepareCharacter(player);
        this.enemy = this.prepareCharacter(enemy);
        this.state = BattleState.PLAYER_TURN;
        this.turnCount = 0;
        this.battleLog = [];
        this.playerDefending = false;
        this.enemyDefending = false;
        this.analysisBonus = 0;
    }

    /**
     * Préparer un personnage pour le combat
     */
    prepareCharacter(character) {
        character.resetForBattle();
        return character;
    }

    /**
     * Calculer les dégâts de base
     */
    calculateDamage(attacker, defender, technique = null) {
        let baseDamage;
        
        if (technique) {
            baseDamage = technique.power + (attacker.stats.technique * 0.5);
        } else {
            baseDamage = attacker.stats.attaque * 0.8;
        }

        // Bonus d'élément
        const elementBonus = this.getElementBonus(
            technique ? technique.type : attacker.element,
            defender.element
        );
        baseDamage *= elementBonus;

        // Réduction par la défense
        const defenseReduction = defender.stats.defense * 0.3;
        if (this.isDefending(defender)) {
            baseDamage *= 0.5; // 50% de réduction si en défense
        }

        // Variabilité (±15%)
        const variance = 0.85 + (Math.random() * 0.3);
        
        const finalDamage = Math.max(1, Math.floor((baseDamage - defenseReduction) * variance));
        
        return finalDamage;
    }

    /**
     * Obtenir le bonus d'élément
     */
    getElementBonus(attackElement, defendElement) {
        const advantages = {
            'feu': 'bois',     // Feu > Bois
            'bois': 'terre',   // Bois > Terre
            'terre': 'vent',   // Terre > Vent
            'vent': 'feu'      // Vent > Feu
        };

        if (advantages[attackElement] === defendElement) {
            return 1.5; // Avantage élémentaire
        } else if (advantages[defendElement] === attackElement) {
            return 0.75; // Désavantage élémentaire
        }
        return 1.0;
    }

    /**
     * Vérifier si un personnage est en défense
     */
    isDefending(character) {
        if (character === this.player) return this.playerDefending;
        return this.enemyDefending;
    }

    /**
     * Exécuter l'action du joueur
     */
    executePlayerAction(actionType, techniqueIndex = null) {
        if (this.state !== BattleState.PLAYER_TURN) {
            return new ActionResult(false, 0, "Ce n'est pas votre tour!");
        }

        this.playerDefending = false;
        let result;

        switch (actionType) {
            case BattleActionType.ATTACK:
                result = this.performAttack(this.player, this.enemy);
                break;

            case BattleActionType.TECHNIQUE:
                result = this.performTechnique(this.player, this.enemy, techniqueIndex);
                break;

            case BattleActionType.DEFEND:
                result = this.performDefend(this.player);
                break;

            case BattleActionType.ANALYZE:
                result = this.performAnalyze(this.player, this.enemy);
                break;

            default:
                result = new ActionResult(false, 0, "Action inconnue!");
        }

        this.battleLog.push({
            turn: this.turnCount,
            actor: 'player',
            action: actionType,
            result: result
        });

        // Vérifier la fin du combat
        if (this.enemy.isDefeated()) {
            this.state = BattleState.PLAYER_WIN;
        } else {
            this.state = BattleState.ENEMY_TURN;
        }

        return result;
    }

    /**
     * Exécuter l'action de l'ennemi (IA)
     */
    executeEnemyAction() {
        if (this.state !== BattleState.ENEMY_TURN) {
            return new ActionResult(false, 0, "Ce n'est pas le tour de l'ennemi!");
        }

        this.enemyDefending = false;
        let result;

        // IA simple basée sur la situation
        const decision = this.makeAIDecision();

        switch (decision.action) {
            case BattleActionType.ATTACK:
                result = this.performAttack(this.enemy, this.player);
                break;

            case BattleActionType.TECHNIQUE:
                result = this.performTechnique(this.enemy, this.player, decision.techniqueIndex);
                break;

            case BattleActionType.DEFEND:
                result = this.performDefend(this.enemy);
                break;

            default:
                result = this.performAttack(this.enemy, this.player);
        }

        this.battleLog.push({
            turn: this.turnCount,
            actor: 'enemy',
            action: decision.action,
            result: result
        });

        // Vérifier la fin du combat
        if (this.player.isDefeated()) {
            this.state = BattleState.ENEMY_WIN;
        } else {
            this.turnCount++;
            this.state = BattleState.PLAYER_TURN;
        }

        return result;
    }

    /**
     * Attaque normale
     */
    performAttack(attacker, defender) {
        const damage = this.calculateDamage(attacker, defender) + this.analysisBonus;
        defender.takeDamage(damage);

        const message = `${attacker.name} attaque et inflige ${damage} dégâts à ${defender.name}!`;
        
        // Réinitialiser le bonus d'analyse après utilisation
        if (attacker === this.player) this.analysisBonus = 0;

        return new ActionResult(true, damage, message);
    }

    /**
     * Utiliser une technique
     */
    performTechnique(attacker, defender, techniqueIndex) {
        const technique = attacker.useTechnique(techniqueIndex);
        
        if (!technique) {
            return new ActionResult(false, 0, `${attacker.name} n'a pas assez de TP pour cette technique!`);
        }

        const damage = this.calculateDamage(attacker, defender, technique) + this.analysisBonus;
        defender.takeDamage(damage);

        const message = `${attacker.name} utilise ${technique.name}! ${damage} dégâts à ${defender.name}!`;
        
        // Réinitialiser le bonus d'analyse après utilisation
        if (attacker === this.player) this.analysisBonus = 0;

        return new ActionResult(true, damage, message, [{
            type: 'technique_used',
            technique: technique.name,
            element: technique.type
        }]);
    }

    /**
     * Se mettre en défense
     */
    performDefend(character) {
        if (character === this.player) {
            this.playerDefending = true;
        } else {
            this.enemyDefending = true;
        }

        // Récupérer un peu de TP
        character.currentTP = Math.min(100, character.currentTP + 15);

        const message = `${character.name} se met en position défensive et récupère 15 TP!`;
        return new ActionResult(true, 0, message, [{ type: 'defending' }]);
    }

    /**
     * Analyser l'ennemi
     */
    performAnalyze(analyzer, target) {
        // L'analyse donne un bonus aux prochaines attaques
        this.analysisBonus = Math.floor(target.stats.defense * 0.2);
        
        const weaknesses = this.getWeaknesses(target.element);
        const message = `${analyzer.name} analyse ${target.name}. Élément: ${target.element}. Faiblesse: ${weaknesses}. Bonus de ${this.analysisBonus} aux prochains dégâts!`;
        
        return new ActionResult(true, 0, message, [{
            type: 'analysis',
            targetElement: target.element,
            weakness: weaknesses,
            bonus: this.analysisBonus
        }]);
    }

    /**
     * Obtenir les faiblesses d'un élément
     */
    getWeaknesses(element) {
        const weakTo = {
            'feu': 'vent',
            'bois': 'feu',
            'terre': 'bois',
            'vent': 'terre'
        };
        return weakTo[element] || 'aucune';
    }

    /**
     * IA de décision pour l'ennemi
     */
    makeAIDecision() {
        const hpPercentage = this.enemy.currentHP / this.enemy.stats.endurance;
        const tpPercentage = this.enemy.currentTP / 100;

        // Si HP bas et peut défendre
        if (hpPercentage < 0.3 && Math.random() < 0.4) {
            return { action: BattleActionType.DEFEND };
        }

        // Si assez de TP, utiliser une technique
        if (tpPercentage >= 0.2 && this.enemy.techniques.length > 0 && Math.random() < 0.6) {
            const techniqueIndex = Math.floor(Math.random() * this.enemy.techniques.length);
            return { action: BattleActionType.TECHNIQUE, techniqueIndex };
        }

        // Sinon, attaque normale
        return { action: BattleActionType.ATTACK };
    }

    /**
     * Obtenir l'état actuel du combat
     */
    getBattleStatus() {
        return {
            state: this.state,
            turnCount: this.turnCount,
            player: {
                name: this.player.name,
                hp: this.player.currentHP,
                maxHp: this.player.stats.endurance,
                tp: this.player.currentTP,
                defending: this.playerDefending,
                techniques: this.player.techniques.map(t => ({
                    name: t.name,
                    power: t.power,
                    type: t.type
                }))
            },
            enemy: {
                name: this.enemy.name,
                hp: this.enemy.currentHP,
                maxHp: this.enemy.stats.endurance,
                tp: this.enemy.currentTP,
                defending: this.enemyDefending
            },
            analysisBonus: this.analysisBonus
        };
    }

    /**
     * Vérifier si le combat est terminé
     */
    isBattleOver() {
        return this.state === BattleState.PLAYER_WIN || 
               this.state === BattleState.ENEMY_WIN ||
               this.state === BattleState.DRAW;
    }

    /**
     * Obtenir le résultat du combat
     */
    getBattleResult() {
        if (!this.isBattleOver()) return null;

        return {
            winner: this.state === BattleState.PLAYER_WIN ? 'player' : 
                   this.state === BattleState.ENEMY_WIN ? 'enemy' : 'draw',
            turns: this.turnCount,
            log: this.battleLog,
            playerFinalHP: this.player.currentHP,
            enemyFinalHP: this.enemy.currentHP
        };
    }
}

/**
 * Factory pour créer des combats
 */
class BattleFactory {
    /**
     * Créer un combat 1vs1
     */
    static createBattle(playerCharacter, enemyCharacterId) {
        // Import dynamique des personnages si nécessaire
        let enemyCharacter;
        
        if (typeof createCharacterInstance !== 'undefined') {
            enemyCharacter = createCharacterInstance(enemyCharacterId);
        } else {
            // Fallback pour environnement Node.js
            const { createCharacterInstance: createChar } = require('../characters/characters.js');
            enemyCharacter = createChar(enemyCharacterId);
        }

        if (!enemyCharacter) {
            throw new Error(`Personnage ennemi non trouvé: ${enemyCharacterId}`);
        }

        return new BattleSystem(playerCharacter, enemyCharacter);
    }

    /**
     * Créer un combat avec difficulté ajustée
     */
    static createBattleWithDifficulty(playerCharacter, enemyCharacterId, difficulty) {
        const battle = this.createBattle(playerCharacter, enemyCharacterId);

        // Ajuster les stats de l'ennemi selon la difficulté
        const modifiers = {
            'easy': 0.7,
            'normal': 1.0,
            'hard': 1.3,
            'nightmare': 1.6
        };

        const modifier = modifiers[difficulty] || 1.0;

        battle.enemy.stats.attaque = Math.floor(battle.enemy.stats.attaque * modifier);
        battle.enemy.stats.defense = Math.floor(battle.enemy.stats.defense * modifier);
        battle.enemy.stats.endurance = Math.floor(battle.enemy.stats.endurance * modifier);
        battle.enemy.currentHP = battle.enemy.stats.endurance;

        return battle;
    }
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BattleActionType,
        BattleState,
        ActionResult,
        BattleSystem,
        BattleFactory
    };
}
