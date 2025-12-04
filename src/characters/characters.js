/**
 * Inazuma Dark - Character System
 * Définition des personnages jouables et leurs caractéristiques
 */

const CharacterType = {
    GARDIEN: 'gardien',      // Goalkeeper type
    ATTAQUANT: 'attaquant',  // Forward type
    MILIEU: 'milieu',        // Midfielder type
    DEFENSEUR: 'defenseur'   // Defender type
};

const ElementType = {
    FEU: 'feu',       // Fire
    TERRE: 'terre',   // Earth
    VENT: 'vent',     // Wind
    BOIS: 'bois'      // Wood
};

/**
 * Technique spéciale d'un personnage
 */
class Technique {
    constructor(name, power, type, description) {
        this.name = name;
        this.power = power;
        this.type = type;
        this.description = description;
    }
}

/**
 * Classe de base pour un personnage
 */
class Character {
    constructor(id, name, team, characterType, element, stats, techniques, backstory) {
        this.id = id;
        this.name = name;
        this.team = team;
        this.characterType = characterType;
        this.element = element;
        this.stats = stats;           // { attaque, defense, vitesse, technique, endurance }
        this.techniques = techniques; // Array of Technique
        this.backstory = backstory;
        this.currentHP = stats.endurance;
        this.currentTP = 100;         // Technique Points
    }

    /**
     * Utiliser une technique
     */
    useTechnique(techniqueIndex) {
        if (techniqueIndex >= 0 && techniqueIndex < this.techniques.length) {
            const technique = this.techniques[techniqueIndex];
            if (this.currentTP >= 20) {
                this.currentTP -= 20;
                return technique;
            }
        }
        return null;
    }

    /**
     * Subir des dégâts
     */
    takeDamage(amount) {
        this.currentHP = Math.max(0, this.currentHP - amount);
        return this.currentHP > 0;
    }

    /**
     * Récupérer de la vie
     */
    heal(amount) {
        this.currentHP = Math.min(this.stats.endurance, this.currentHP + amount);
    }

    /**
     * Vérifier si le personnage est KO
     */
    isDefeated() {
        return this.currentHP <= 0;
    }

    /**
     * Réinitialiser pour un nouveau combat
     */
    resetForBattle() {
        this.currentHP = this.stats.endurance;
        this.currentTP = 100;
    }
}

/**
 * Personnages principaux jouables
 */
const PLAYABLE_CHARACTERS = {
    mark: new Character(
        'mark',
        'Mark Evans',
        'Raimon',
        CharacterType.GARDIEN,
        ElementType.VENT,
        {
            attaque: 40,
            defense: 90,
            vitesse: 60,
            technique: 85,
            endurance: 100
        },
        [
            new Technique(
                'Main Céleste',
                80,
                ElementType.VENT,
                'Une technique défensive puissante qui arrête les tirs les plus forts'
            ),
            new Technique(
                'Poing de la Justice',
                70,
                ElementType.VENT,
                'Un poing concentré qui repousse le ballon avec force'
            ),
            new Technique(
                'Main Démoniaque',
                95,
                ElementType.VENT,
                'La forme ultime de la Main Céleste, imbattable'
            )
        ],
        "Mark Evans est le gardien passionné de Raimon. Son rêve est de devenir le meilleur gardien du monde, inspiré par son grand-père légendaire. Sa détermination inébranlable inspire ses coéquipiers."
    ),

    axel: new Character(
        'axel',
        'Axel Blaze',
        'Raimon',
        CharacterType.ATTAQUANT,
        ElementType.FEU,
        {
            attaque: 95,
            defense: 50,
            vitesse: 85,
            technique: 90,
            endurance: 80
        },
        [
            new Technique(
                'Tornade de Feu',
                90,
                ElementType.FEU,
                'Un tir enflammé qui tourbillonne vers le but'
            ),
            new Technique(
                'Tempête de Feu',
                100,
                ElementType.FEU,
                'Version améliorée de la Tornade de Feu, encore plus dévastatrice'
            ),
            new Technique(
                'Tir du Tigre',
                85,
                ElementType.FEU,
                'Un tir rapide et précis comme un tigre bondissant'
            )
        ],
        "Axel Blaze, ancien attaquant star de Raimon, porte le poids de la tragédie de sa sœur. Son talent exceptionnel est égalé par sa solitude. Rejoindra-t-il de nouveau le football ?"
    ),

    jude: new Character(
        'jude',
        'Jude Sharp',
        'Royal Academy',
        CharacterType.MILIEU,
        ElementType.TERRE,
        {
            attaque: 75,
            defense: 70,
            vitesse: 80,
            technique: 95,
            endurance: 85
        },
        [
            new Technique(
                'Pingouin Empereur',
                95,
                ElementType.TERRE,
                'Une formation tactique dévastatrice qui invoque des pingouins de glace'
            ),
            new Technique(
                'Regard Perçant',
                60,
                ElementType.TERRE,
                'Analyse les mouvements adverses et prédit leurs actions'
            ),
            new Technique(
                'Dribble Fantôme',
                75,
                ElementType.TERRE,
                'Un dribble si rapide que l\'adversaire ne voit qu\'une ombre'
            )
        ],
        "Jude Sharp est le stratège génial de la Royal Academy. Fils adoptif du directeur Ray Dark, il est tiraillé entre loyauté et justice. Son intelligence sur le terrain est sans égale."
    )
};

/**
 * Obtenir un personnage par son ID
 */
function getCharacter(characterId) {
    return PLAYABLE_CHARACTERS[characterId] || null;
}

/**
 * Obtenir tous les personnages jouables
 */
function getAllPlayableCharacters() {
    return Object.values(PLAYABLE_CHARACTERS);
}

/**
 * Créer une copie d'un personnage pour le jeu
 */
function createCharacterInstance(characterId) {
    const original = PLAYABLE_CHARACTERS[characterId];
    if (!original) return null;
    
    return new Character(
        original.id,
        original.name,
        original.team,
        original.characterType,
        original.element,
        { ...original.stats },
        [...original.techniques],
        original.backstory
    );
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CharacterType,
        ElementType,
        Technique,
        Character,
        PLAYABLE_CHARACTERS,
        getCharacter,
        getAllPlayableCharacters,
        createCharacterInstance
    };
}
