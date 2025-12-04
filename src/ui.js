/**
 * Inazuma Dark - UI Controller
 * Gestion de l'interface utilisateur du jeu
 */

// Instance globale du jeu
let game;
let currentCharacterId = null;

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    game = new InazumaDarkGame();
    const menuData = game.initialize();
    
    // Activer le bouton continuer si une sauvegarde existe
    const continueBtn = document.getElementById('continue-btn');
    if (game.hasSaveData()) {
        continueBtn.disabled = false;
    }
    
    console.log('Inazuma Dark initialisé!');
});

/**
 * Afficher un écran spécifique
 */
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

/**
 * Retourner au menu principal
 */
function backToMenu() {
    showScreen('title-screen');
    game = new InazumaDarkGame();
    game.initialize();
}

/**
 * Démarrer une nouvelle partie
 */
function startNewGame() {
    game.startNewGame();
    showScreen('character-select');
}

/**
 * Continuer une partie sauvegardée
 */
function continueGame() {
    const result = game.loadSavedGame();
    if (result.error) {
        alert(result.error);
        return;
    }
    
    currentCharacterId = game.selectedCharacter.id;
    updateStoryUI(result);
    showScreen('story-screen');
}

/**
 * Afficher les crédits
 */
function showCredits() {
    showScreen('credits-screen');
}

/**
 * Sélectionner un personnage
 */
function selectCharacter(characterId) {
    // Mettre à jour la description
    const descriptions = {
        mark: "Mark Evans est le gardien passionné de Raimon. Son rêve est de devenir le meilleur gardien du monde. Sa mécanique unique lui permet d'ARRÊTER les buts les plus puissants grâce à ses techniques défensives légendaires comme la Main Céleste.",
        axel: "Axel Blaze, l'attaquant de feu de Raimon. Hanté par la tragédie de sa sœur, son talent offensif reste inégalé. Sa Tornade de Feu peut transpercer n'importe quelle défense. Il débute son aventure avec l'équipe de Raimon.",
        jude: "Jude Sharp est le stratège génial de la Royal Academy. Fils adoptif du directeur Ray Dark, il est tiraillé entre loyauté et justice. Son Pingouin Empereur et ses tactiques font de lui un adversaire redoutable."
    };
    
    const descEl = document.getElementById('char-description');
    descEl.textContent = '';
    const p = document.createElement('p');
    p.textContent = descriptions[characterId] || '';
    descEl.appendChild(p);
    
    // Highlight la carte sélectionnée
    document.querySelectorAll('.character-card').forEach(card => {
        card.style.borderColor = '#3d4f6f';
    });
    document.querySelector(`[data-character="${characterId}"]`).style.borderColor = '#ff6b35';
    
    // Nom du personnage pour confirmation
    const characterNames = {
        mark: 'Mark Evans',
        axel: 'Axel Blaze',
        jude: 'Jude Sharp'
    };
    
    // Demander confirmation
    setTimeout(() => {
        if (confirm(`Voulez-vous jouer avec ${characterNames[characterId] || characterId}?`)) {
            currentCharacterId = characterId;
            const result = game.selectCharacter(characterId);
            
            if (result.error) {
                alert(result.error);
                return;
            }
            
            updateStoryUI(result);
            showScreen('story-screen');
        }
    }, 100);
}

/**
 * Mettre à jour l'interface d'histoire
 */
function updateStoryUI(storyState) {
    const speakerEl = document.getElementById('speaker-name');
    const textEl = document.getElementById('dialogue-text');
    const choicesEl = document.getElementById('choices-container');
    const continueBtn = document.getElementById('story-continue');
    
    // Mettre à jour le HUD
    updateHUD();
    
    // Cacher les éléments par défaut
    choicesEl.innerHTML = '';
    continueBtn.style.display = 'none';
    
    if (storyState.isEnding) {
        showEnding(storyState);
        return;
    }
    
    if (storyState.needsBattle) {
        startBattleFromStory(storyState);
        return;
    }
    
    switch (storyState.type) {
        case 'dialogue':
            speakerEl.textContent = storyState.speaker || '';
            textEl.textContent = storyState.text;
            if (storyState.canContinue) {
                continueBtn.style.display = 'block';
            }
            break;
            
        case 'choice':
            speakerEl.textContent = 'CHOIX';
            textEl.textContent = storyState.prompt;
            storyState.choices.forEach((choice, index) => {
                const btn = document.createElement('button');
                btn.className = 'choice-btn';
                btn.textContent = `${index + 1}. ${choice.text}`;
                btn.onclick = () => makeChoice(index);
                choicesEl.appendChild(btn);
            });
            break;
    }
    
    // Mettre à jour le fond
    const bgEl = document.getElementById('story-bg');
    if (storyState.background) {
        bgEl.style.background = getBackgroundStyle(storyState.background);
    }
}

/**
 * Obtenir le style de fond basé sur le lieu
 */
function getBackgroundStyle(location) {
    const backgrounds = {
        'raimon_school': 'linear-gradient(180deg, #87CEEB 0%, #4682B4 100%)',
        'soccer_field': 'linear-gradient(180deg, #228B22 0%, #006400 100%)',
        'riverside': 'linear-gradient(180deg, #FF8C00 0%, #FF4500 50%, #2F4F4F 100%)',
        'riverside_sunset': 'linear-gradient(180deg, #FF6B35 0%, #8B0000 50%, #1a1a2e 100%)',
        'riverside_night': 'linear-gradient(180deg, #1a1a2e 0%, #0f0f23 100%)',
        'hospital_memory': 'linear-gradient(180deg, #FFFFFF 0%, #D3D3D3 100%)',
        'hospital_room': 'linear-gradient(180deg, #F0F8FF 0%, #E0E0E0 100%)',
        'training_ground': 'linear-gradient(180deg, #8FBC8F 0%, #2E8B57 100%)',
        'school_hallway': 'linear-gradient(180deg, #DEB887 0%, #8B4513 100%)',
        'library': 'linear-gradient(180deg, #8B4513 0%, #654321 100%)',
        'royal_academy': 'linear-gradient(180deg, #4B0082 0%, #2F0052 100%)',
        'royal_training': 'linear-gradient(180deg, #4B0082 0%, #1a1a2e 100%)',
        'dark_office': 'linear-gradient(180deg, #1a1a2e 0%, #0a0a1e 100%)',
        'dark_alley': 'linear-gradient(180deg, #2F4F4F 0%, #0a0a0a 100%)',
        'dark_shadow': 'linear-gradient(180deg, #0a0a0a 0%, #000000 100%)',
        'locker_room': 'linear-gradient(180deg, #696969 0%, #3d3d3d 100%)',
        'secret_archive': 'linear-gradient(180deg, #8B4513 0%, #2F1810 100%)',
        'night_sky': 'linear-gradient(180deg, #0a0a2e 0%, #000033 100%)',
        'raimon_field': 'linear-gradient(180deg, #228B22 0%, #1a1a2e 50%)',
        'empty_field': 'linear-gradient(180deg, #4a5568 0%, #2d3748 100%)',
        'riverside_dawn': 'linear-gradient(180deg, #FFB6C1 0%, #FFA07A 50%, #87CEEB 100%)'
    };
    
    return backgrounds[location] || 'linear-gradient(180deg, #1a1a2e 0%, #0f3460 100%)';
}

/**
 * Continuer l'histoire
 */
function continueStory() {
    const result = game.advanceStory();
    if (result) {
        updateStoryUI(result);
    }
}

/**
 * Faire un choix
 */
function makeChoice(index) {
    const result = game.advanceStory(index);
    if (result) {
        updateStoryUI(result);
    }
}

/**
 * Mettre à jour le HUD
 */
function updateHUD() {
    const gameState = game.getGameState();
    if (gameState.character) {
        document.getElementById('hud-character-name').textContent = gameState.character.name;
        document.getElementById('hud-hp').style.width = 
            `${(gameState.character.hp / gameState.character.maxHp) * 100}%`;
        document.getElementById('hud-tp').style.width = `${gameState.character.tp}%`;
    }
}

/**
 * Sauvegarder la partie
 */
function saveGame() {
    const result = game.saveCurrentGame();
    alert(result.message);
    
    // Activer le bouton continuer
    document.getElementById('continue-btn').disabled = false;
}

/**
 * Démarrer un combat depuis l'histoire
 */
function startBattleFromStory(storyState) {
    const result = game.startBattle(storyState.opponent, storyState.difficulty);
    showScreen('battle-screen');
    updateBattleUI(result);
}

/**
 * Mettre à jour l'interface de combat
 */
function updateBattleUI(battleState) {
    // Joueur
    document.getElementById('player-name').textContent = battleState.player.name;
    const playerHpPercent = (battleState.player.hp / battleState.player.maxHp) * 100;
    document.getElementById('player-hp').style.width = `${playerHpPercent}%`;
    document.getElementById('player-hp-text').textContent = 
        `${battleState.player.hp} / ${battleState.player.maxHp}`;
    document.getElementById('player-tp').style.width = `${battleState.player.tp}%`;
    document.getElementById('player-tp-text').textContent = `TP: ${battleState.player.tp}`;
    
    // Ennemi
    document.getElementById('enemy-name').textContent = battleState.enemy.name;
    const enemyHpPercent = (battleState.enemy.hp / battleState.enemy.maxHp) * 100;
    document.getElementById('enemy-hp').style.width = `${enemyHpPercent}%`;
    document.getElementById('enemy-hp-text').textContent = 
        `${battleState.enemy.hp} / ${battleState.enemy.maxHp}`;
    document.getElementById('enemy-tp').style.width = `${battleState.enemy.tp}%`;
    
    // Mettre à jour la liste des techniques
    const techList = document.getElementById('techniques-list');
    techList.textContent = '';
    battleState.player.techniques.forEach((tech, index) => {
        const btn = document.createElement('button');
        btn.className = 'technique-btn';
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'tech-name';
        nameSpan.textContent = tech.name;
        
        const powerSpan = document.createElement('span');
        powerSpan.className = 'tech-power';
        powerSpan.textContent = `Puissance: ${tech.power} | Élément: ${tech.type}`;
        
        btn.appendChild(nameSpan);
        btn.appendChild(powerSpan);
        btn.onclick = () => useTechnique(index);
        techList.appendChild(btn);
    });
    
    // Gérer les résultats du tour
    if (battleState.turnResults) {
        const log = document.getElementById('battle-log');
        battleState.turnResults.forEach(result => {
            const p = document.createElement('p');
            p.textContent = result.message;
            if (result.damage > 0) p.classList.add('damage');
            if (result.effects?.some(e => e.type === 'technique_used')) p.classList.add('technique');
            log.appendChild(p);
            log.scrollTop = log.scrollHeight;
        });
    }
    
    // Gérer la fin du combat
    if (battleState.battleEnd) {
        handleBattleEnd(battleState);
    }
}

/**
 * Exécuter une action de combat
 */
function battleAction(action) {
    let actionType;
    switch (action) {
        case 'attack': actionType = BattleActionType.ATTACK; break;
        case 'defend': actionType = BattleActionType.DEFEND; break;
        case 'analyze': actionType = BattleActionType.ANALYZE; break;
        default: return;
    }
    
    const result = game.executeBattleAction(actionType);
    updateBattleUI(result);
}

/**
 * Afficher le panneau des techniques
 */
function showTechniques() {
    document.getElementById('techniques-panel').classList.add('active');
}

/**
 * Fermer le panneau des techniques
 */
function closeTechniques() {
    document.getElementById('techniques-panel').classList.remove('active');
}

/**
 * Utiliser une technique
 */
function useTechnique(index) {
    closeTechniques();
    const result = game.executeBattleAction(BattleActionType.TECHNIQUE, index);
    updateBattleUI(result);
}

/**
 * Gérer la fin du combat
 */
function handleBattleEnd(result) {
    const log = document.getElementById('battle-log');
    const p = document.createElement('p');
    p.style.color = result.winner === 'player' ? '#6bff6b' : '#ff6b6b';
    p.style.fontWeight = 'bold';
    p.textContent = result.message;
    log.appendChild(p);
    
    // Attendre un moment avant de continuer l'histoire
    setTimeout(() => {
        if (result.nextStoryState) {
            updateStoryUI(result.nextStoryState);
            showScreen('story-screen');
        }
    }, 2000);
}

/**
 * Afficher l'écran de fin
 */
function showEnding(endingState) {
    document.getElementById('ending-title').textContent = endingState.title;
    document.getElementById('ending-text').textContent = endingState.text;
    
    const typeEl = document.getElementById('ending-type');
    typeEl.className = 'ending-type ' + endingState.endingType;
    
    const typeLabels = {
        good: '✨ Bonne Fin',
        neutral: '⚖️ Fin Neutre',
        dark: '🌑 Fin Sombre'
    };
    typeEl.textContent = typeLabels[endingState.endingType] || 'Fin';
    
    showScreen('ending-screen');
}

/**
 * Rejouer avec le même personnage
 */
function restartWithSameChar() {
    if (currentCharacterId) {
        game = new InazumaDarkGame();
        game.initialize();
        const result = game.selectCharacter(currentCharacterId);
        updateStoryUI(result);
        showScreen('story-screen');
    }
}

// Raccourcis clavier
document.addEventListener('keydown', (e) => {
    const storyScreen = document.getElementById('story-screen');
    const battleScreen = document.getElementById('battle-screen');
    
    if (storyScreen.classList.contains('active')) {
        if (e.key === 'Enter' || e.key === ' ') {
            const continueBtn = document.getElementById('story-continue');
            if (continueBtn.style.display !== 'none') {
                continueStory();
            }
        }
        
        // Choix par numéro
        if (e.key >= '1' && e.key <= '9') {
            const choiceBtns = document.querySelectorAll('.choice-btn');
            const index = parseInt(e.key) - 1;
            if (choiceBtns[index]) {
                makeChoice(index);
            }
        }
    }
    
    if (battleScreen.classList.contains('active')) {
        switch (e.key.toLowerCase()) {
            case 'a': battleAction('attack'); break;
            case 't': showTechniques(); break;
            case 'd': battleAction('defend'); break;
            case 'n': battleAction('analyze'); break;
            case 'escape': closeTechniques(); break;
        }
    }
});
