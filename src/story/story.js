/**
 * Inazuma Dark - Story System
 * Système de narration avec choix et embranchements
 */

/**
 * Types de nœuds d'histoire
 */
const StoryNodeType = {
    DIALOGUE: 'dialogue',
    CHOICE: 'choice',
    BATTLE: 'battle',
    ENDING: 'ending'
};

/**
 * Classe représentant un nœud d'histoire
 */
class StoryNode {
    constructor(id, type, content, options = {}) {
        this.id = id;
        this.type = type;
        this.content = content;
        this.options = options;
    }
}

/**
 * Classe représentant un choix
 */
class Choice {
    constructor(text, nextNodeId, consequences = {}) {
        this.text = text;
        this.nextNodeId = nextNodeId;
        this.consequences = consequences;
    }
}

/**
 * Histoires pour chaque personnage
 */
const STORIES = {
    // ==================== HISTOIRE DE MARK ====================
    mark: {
        startNode: 'mark_intro',
        nodes: {
            mark_intro: new StoryNode(
                'mark_intro',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Narrateur',
                    text: "Raimon Junior High. Le club de football est au bord de la dissolution. Un seul membre reste fidèle à son poste de gardien : Mark Evans.",
                    background: 'raimon_school',
                    nextNode: 'mark_determination'
                }
            ),
            mark_determination: new StoryNode(
                'mark_determination',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Mark',
                    text: "Je ne laisserai jamais ce club disparaître ! Le football, c'est ma vie ! Grand-père, je te promets de protéger ce but !",
                    background: 'soccer_field',
                    nextNode: 'mark_choice_1'
                }
            ),
            mark_choice_1: new StoryNode(
                'mark_choice_1',
                StoryNodeType.CHOICE,
                {
                    prompt: "Un match contre la Royal Academy approche. Comment Mark doit-il se préparer ?",
                    choices: [
                        new Choice(
                            "S'entraîner seul jusqu'à l'épuisement",
                            'mark_solo_training',
                            { determination: +10, teamwork: -5 }
                        ),
                        new Choice(
                            "Chercher de nouveaux membres pour l'équipe",
                            'mark_recruit',
                            { teamwork: +10, technique: +5 }
                        ),
                        new Choice(
                            "Étudier les techniques de la Royal Academy",
                            'mark_study',
                            { strategy: +10, knowledge: +5 }
                        )
                    ]
                }
            ),
            mark_solo_training: new StoryNode(
                'mark_solo_training',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Mark',
                    text: "Encore ! Plus fort ! Je dois pouvoir arrêter n'importe quel tir !",
                    background: 'training_ground',
                    nextNode: 'mark_encounter_axel'
                }
            ),
            mark_recruit: new StoryNode(
                'mark_recruit',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Mark',
                    text: "Il doit bien y avoir quelqu'un dans cette école qui aime le football autant que moi !",
                    background: 'school_hallway',
                    nextNode: 'mark_encounter_axel'
                }
            ),
            mark_study: new StoryNode(
                'mark_study',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Mark',
                    text: "La Royal Academy... Leur stratégie est impitoyable. Je dois comprendre leurs techniques.",
                    background: 'library',
                    nextNode: 'mark_encounter_axel'
                }
            ),
            mark_encounter_axel: new StoryNode(
                'mark_encounter_axel',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Narrateur',
                    text: "Au bord de la rivière, Mark aperçoit un garçon solitaire qui tire sur un pneu suspendu. La puissance de son tir est incroyable.",
                    background: 'riverside',
                    nextNode: 'mark_talk_axel'
                }
            ),
            mark_talk_axel: new StoryNode(
                'mark_talk_axel',
                StoryNodeType.CHOICE,
                {
                    prompt: "Mark reconnaît Axel Blaze, l'ancien prodige du football. Comment l'approcher ?",
                    choices: [
                        new Choice(
                            "L'inviter directement à rejoindre l'équipe",
                            'mark_direct_invite',
                            { friendship_axel: +5, respect: -5 }
                        ),
                        new Choice(
                            "Lui demander de lui enseigner à bloquer son tir",
                            'mark_ask_training',
                            { technique: +10, friendship_axel: +10 }
                        ),
                        new Choice(
                            "Observer silencieusement et revenir plus tard",
                            'mark_observe',
                            { knowledge: +5, patience: +10 }
                        )
                    ]
                }
            ),
            mark_direct_invite: new StoryNode(
                'mark_direct_invite',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Axel',
                    text: "Le football ? C'est fini pour moi. Va-t'en.",
                    background: 'riverside',
                    nextNode: 'mark_battle_royal'
                }
            ),
            mark_ask_training: new StoryNode(
                'mark_ask_training',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Mark',
                    text: "S'il te plaît ! Je veux devenir plus fort ! Tire sur moi avec toute ta puissance !",
                    background: 'riverside',
                    nextNode: 'mark_training_duel'
                }
            ),
            mark_observe: new StoryNode(
                'mark_observe',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Narrateur',
                    text: "Mark observe la tristesse dans les yeux d'Axel. Il y a une histoire derrière ce regard...",
                    background: 'riverside',
                    nextNode: 'mark_battle_royal'
                }
            ),
            mark_training_duel: new StoryNode(
                'mark_training_duel',
                StoryNodeType.BATTLE,
                {
                    opponent: 'axel',
                    difficulty: 'normal',
                    winNode: 'mark_impress_axel',
                    loseNode: 'mark_defeated_but_determined'
                }
            ),
            mark_impress_axel: new StoryNode(
                'mark_impress_axel',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Axel',
                    text: "Tu... tu as arrêté ma Tornade de Feu ? C'est impossible...",
                    background: 'riverside',
                    nextNode: 'mark_battle_royal'
                }
            ),
            mark_defeated_but_determined: new StoryNode(
                'mark_defeated_but_determined',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Mark',
                    text: "Encore ! Je peux le faire ! Je ne renonce jamais !",
                    background: 'riverside',
                    nextNode: 'mark_battle_royal'
                }
            ),
            mark_battle_royal: new StoryNode(
                'mark_battle_royal',
                StoryNodeType.BATTLE,
                {
                    opponent: 'jude',
                    difficulty: 'hard',
                    winNode: 'mark_victory_royal',
                    loseNode: 'mark_defeat_royal'
                }
            ),
            mark_victory_royal: new StoryNode(
                'mark_victory_royal',
                StoryNodeType.ENDING,
                {
                    title: 'La Lumière dans les Ténèbres',
                    text: "Contre toute attente, Mark et Raimon ont vaincu la Royal Academy. Ce n'est que le début d'une légende...",
                    ending_type: 'good'
                }
            ),
            mark_defeat_royal: new StoryNode(
                'mark_defeat_royal',
                StoryNodeType.ENDING,
                {
                    title: 'Écrasé mais Pas Brisé',
                    text: "La Royal Academy était trop forte. Mais Mark refuse de baisser les bras. La prochaine fois sera différente...",
                    ending_type: 'neutral'
                }
            )
        }
    },

    // ==================== HISTOIRE D'AXEL ====================
    axel: {
        startNode: 'axel_intro',
        nodes: {
            axel_intro: new StoryNode(
                'axel_intro',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Narrateur',
                    text: "Un terrain vide au crépuscule. Axel Blaze, autrefois le prodige le plus prometteur du football, tire seul sur un pneu. Ses yeux sont vides de joie.",
                    background: 'riverside_sunset',
                    nextNode: 'axel_memory'
                }
            ),
            axel_memory: new StoryNode(
                'axel_memory',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Axel (pensée)',
                    text: "Julia... c'est à cause de moi que tu ne pourras plus jamais marcher. Comment puis-je encore jouer au football après ça ?",
                    background: 'hospital_memory',
                    nextNode: 'axel_choice_1'
                }
            ),
            axel_choice_1: new StoryNode(
                'axel_choice_1',
                StoryNodeType.CHOICE,
                {
                    prompt: "Le souvenir de l'accident de sa sœur le hante. Que doit faire Axel ?",
                    choices: [
                        new Choice(
                            "Abandonner définitivement le football",
                            'axel_quit',
                            { depression: +10, guilt: +10 }
                        ),
                        new Choice(
                            "Continuer à s'entraîner seul, en pénitence",
                            'axel_penance',
                            { technique: +10, isolation: +5 }
                        ),
                        new Choice(
                            "Visiter Julia à l'hôpital",
                            'axel_visit_julia',
                            { hope: +10, guilt: -5 }
                        )
                    ]
                }
            ),
            axel_quit: new StoryNode(
                'axel_quit',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Axel',
                    text: "C'est fini. Le football ne m'apportera plus que de la douleur.",
                    background: 'empty_field',
                    nextNode: 'axel_mark_appears'
                }
            ),
            axel_penance: new StoryNode(
                'axel_penance',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Axel',
                    text: "Chaque tir est une prière. Chaque tir est une excuse. Jusqu'à ce que je puisse me pardonner...",
                    background: 'riverside_night',
                    nextNode: 'axel_mark_appears'
                }
            ),
            axel_visit_julia: new StoryNode(
                'axel_visit_julia',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Julia',
                    text: "Grand frère ! Tu es venu ! Tu sais, j'ai vu un match de football à la télé. L'équipe de Raimon... ils avaient l'air si joyeux !",
                    background: 'hospital_room',
                    nextNode: 'axel_julia_request'
                }
            ),
            axel_julia_request: new StoryNode(
                'axel_julia_request',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Julia',
                    text: "Axel... promets-moi que tu joueras encore. Pour moi. Je veux te voir marquer des buts comme avant !",
                    background: 'hospital_room',
                    nextNode: 'axel_mark_appears'
                }
            ),
            axel_mark_appears: new StoryNode(
                'axel_mark_appears',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Narrateur',
                    text: "Un garçon énergique avec un bandeau orange apparaît. C'est Mark Evans, le gardien de Raimon.",
                    background: 'riverside',
                    nextNode: 'axel_confrontation'
                }
            ),
            axel_confrontation: new StoryNode(
                'axel_confrontation',
                StoryNodeType.CHOICE,
                {
                    prompt: "Mark demande à Axel de rejoindre Raimon. Comment réagir ?",
                    choices: [
                        new Choice(
                            "Refuser catégoriquement et partir",
                            'axel_refuse',
                            { isolation: +10, bond_mark: -10 }
                        ),
                        new Choice(
                            "Tester Mark avec un tir puissant",
                            'axel_test_mark',
                            { curiosity: +5, bond_mark: +5 }
                        ),
                        new Choice(
                            "Écouter ce qu'il a à dire",
                            'axel_listen',
                            { openness: +10, bond_mark: +10 }
                        )
                    ]
                }
            ),
            axel_refuse: new StoryNode(
                'axel_refuse',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Axel',
                    text: "Le football n'est qu'un jeu cruel. Laisse-moi tranquille.",
                    background: 'riverside',
                    nextNode: 'axel_dark_path'
                }
            ),
            axel_test_mark: new StoryNode(
                'axel_test_mark',
                StoryNodeType.BATTLE,
                {
                    opponent: 'mark',
                    difficulty: 'easy',
                    winNode: 'axel_impress_self',
                    loseNode: 'axel_surprised'
                }
            ),
            axel_listen: new StoryNode(
                'axel_listen',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Mark',
                    text: "Le football m'a donné des amis, des rêves, une raison de vivre ! Je suis sûr qu'il peut faire pareil pour toi !",
                    background: 'riverside',
                    nextNode: 'axel_moved'
                }
            ),
            axel_impress_self: new StoryNode(
                'axel_impress_self',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Axel (pensée)',
                    text: "Il a tenu bon... même contre ma Tornade de Feu. Il y a quelque chose de différent chez ce garçon.",
                    background: 'riverside',
                    nextNode: 'axel_moved'
                }
            ),
            axel_surprised: new StoryNode(
                'axel_surprised',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Axel',
                    text: "Il... il a arrêté mon tir ?! Impossible !",
                    background: 'riverside',
                    nextNode: 'axel_moved'
                }
            ),
            axel_moved: new StoryNode(
                'axel_moved',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Narrateur',
                    text: "Quelque chose s'éveille dans le cœur d'Axel. La flamme du football n'était pas éteinte, juste enfouie.",
                    background: 'riverside_dawn',
                    nextNode: 'axel_join_decision'
                }
            ),
            axel_dark_path: new StoryNode(
                'axel_dark_path',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Narrateur',
                    text: "Axel s'enfonce dans les ténèbres de la solitude. Mais le destin a d'autres plans...",
                    background: 'dark_alley',
                    nextNode: 'axel_royal_approach'
                }
            ),
            axel_royal_approach: new StoryNode(
                'axel_royal_approach',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Ray Dark',
                    text: "Axel Blaze. Ton talent est gâché. Rejoins la Royal Academy. Nous te donnerons un vrai but.",
                    background: 'dark_office',
                    nextNode: 'axel_final_choice'
                }
            ),
            axel_join_decision: new StoryNode(
                'axel_join_decision',
                StoryNodeType.CHOICE,
                {
                    prompt: "Le moment de vérité. Axel doit choisir son chemin.",
                    choices: [
                        new Choice(
                            "Rejoindre Raimon et Mark",
                            'axel_join_raimon',
                            { hope: +20, bond_mark: +20 }
                        ),
                        new Choice(
                            "Rester seul pour l'instant",
                            'axel_stay_alone',
                            { independence: +10 }
                        )
                    ]
                }
            ),
            axel_final_choice: new StoryNode(
                'axel_final_choice',
                StoryNodeType.CHOICE,
                {
                    prompt: "Ray Dark offre puissance et reconnaissance. Que choisir ?",
                    choices: [
                        new Choice(
                            "Accepter l'offre de la Royal Academy",
                            'axel_dark_ending',
                            { darkness: +20 }
                        ),
                        new Choice(
                            "Refuser et chercher sa propre voie",
                            'axel_redemption',
                            { redemption: +10 }
                        )
                    ]
                }
            ),
            axel_join_raimon: new StoryNode(
                'axel_join_raimon',
                StoryNodeType.ENDING,
                {
                    title: 'La Flamme Renaît',
                    text: "Axel rejoint Raimon. Avec Mark et ses nouveaux coéquipiers, il redécouvre la joie du football. Julia sera fière.",
                    ending_type: 'good'
                }
            ),
            axel_stay_alone: new StoryNode(
                'axel_stay_alone',
                StoryNodeType.ENDING,
                {
                    title: 'Le Loup Solitaire',
                    text: "Axel choisit de suivre son propre chemin. Ni Raimon ni la Royal Academy. Un jour, peut-être, il trouvera sa place.",
                    ending_type: 'neutral'
                }
            ),
            axel_dark_ending: new StoryNode(
                'axel_dark_ending',
                StoryNodeType.ENDING,
                {
                    title: 'Flamme Corrompue',
                    text: "Axel rejoint les ténèbres de la Royal Academy. Sa puissance grandit, mais à quel prix ?",
                    ending_type: 'dark'
                }
            ),
            axel_redemption: new StoryNode(
                'axel_redemption',
                StoryNodeType.ENDING,
                {
                    title: 'Rédemption',
                    text: "Axel refuse le pouvoir corrompu. Il trouvera sa propre rédemption, à sa manière.",
                    ending_type: 'neutral'
                }
            )
        }
    },

    // ==================== HISTOIRE DE JUDE ====================
    jude: {
        startNode: 'jude_intro',
        nodes: {
            jude_intro: new StoryNode(
                'jude_intro',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Narrateur',
                    text: "Royal Academy. L'école d'élite où la victoire est la seule option acceptable. Au sommet de l'équipe de football se trouve Jude Sharp, le stratège parfait.",
                    background: 'royal_academy',
                    nextNode: 'jude_meeting'
                }
            ),
            jude_meeting: new StoryNode(
                'jude_meeting',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Ray Dark',
                    text: "Jude. Le match contre Raimon approche. Tu sais ce que j'attends de toi. Une victoire totale. Pas de pitié.",
                    background: 'dark_office',
                    nextNode: 'jude_response'
                }
            ),
            jude_response: new StoryNode(
                'jude_response',
                StoryNodeType.CHOICE,
                {
                    prompt: "Face à son père adoptif, Jude doit répondre.",
                    choices: [
                        new Choice(
                            "Oui, Père. Nous les écraserons.",
                            'jude_obey',
                            { loyalty_dark: +10, inner_conflict: +5 }
                        ),
                        new Choice(
                            "Nous gagnerons, mais fair-play.",
                            'jude_fairplay',
                            { honor: +10, loyalty_dark: -10 }
                        ),
                        new Choice(
                            "Pourquoi cette obsession contre Raimon ?",
                            'jude_question',
                            { wisdom: +10, curiosity: +10 }
                        )
                    ]
                }
            ),
            jude_obey: new StoryNode(
                'jude_obey',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Ray Dark',
                    text: "Bien. Tu es mon fils parfait, Jude. Ne me déçois pas.",
                    background: 'dark_office',
                    nextNode: 'jude_training'
                }
            ),
            jude_fairplay: new StoryNode(
                'jude_fairplay',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Ray Dark',
                    text: "Fair-play ? Le fair-play est pour les perdants. Souviens-toi d'où tu viens, Jude.",
                    background: 'dark_office',
                    nextNode: 'jude_training'
                }
            ),
            jude_question: new StoryNode(
                'jude_question',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Ray Dark',
                    text: "Ne pose pas de questions. Obéis. C'est tout ce que je te demande.",
                    background: 'dark_office',
                    nextNode: 'jude_secret_hint'
                }
            ),
            jude_secret_hint: new StoryNode(
                'jude_secret_hint',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Narrateur',
                    text: "Les yeux de Ray Dark trahissent une lueur étrange. Il cache quelque chose concernant Raimon...",
                    background: 'dark_office',
                    nextNode: 'jude_training'
                }
            ),
            jude_training: new StoryNode(
                'jude_training',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Narrateur',
                    text: "L'entraînement de la Royal Academy est brutal. Seuls les plus forts survivent.",
                    background: 'royal_training',
                    nextNode: 'jude_teammate'
                }
            ),
            jude_teammate: new StoryNode(
                'jude_teammate',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Coéquipier',
                    text: "Jude... j'ai entendu dire que le gardien de Raimon, Mark Evans, est le petit-fils du légendaire Evans. Tu savais ça ?",
                    background: 'locker_room',
                    nextNode: 'jude_revelation'
                }
            ),
            jude_revelation: new StoryNode(
                'jude_revelation',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Jude (pensée)',
                    text: "Evans... Ce nom me dit quelque chose. Pourquoi Père déteste-t-il tant ce nom ?",
                    background: 'locker_room',
                    nextNode: 'jude_choice_2'
                }
            ),
            jude_choice_2: new StoryNode(
                'jude_choice_2',
                StoryNodeType.CHOICE,
                {
                    prompt: "Jude sent que quelque chose ne va pas. Que faire ?",
                    choices: [
                        new Choice(
                            "Enquêter sur le passé de Ray Dark",
                            'jude_investigate',
                            { knowledge: +15, risk: +10 }
                        ),
                        new Choice(
                            "Se concentrer sur le match uniquement",
                            'jude_focus',
                            { discipline: +10 }
                        ),
                        new Choice(
                            "Observer Mark Evans de près avant le match",
                            'jude_observe_mark',
                            { strategy: +10, curiosity: +5 }
                        )
                    ]
                }
            ),
            jude_investigate: new StoryNode(
                'jude_investigate',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Narrateur',
                    text: "Dans les archives secrètes de la Royal Academy, Jude découvre la vérité : Ray Dark était autrefois ami avec le grand-père de Mark...",
                    background: 'secret_archive',
                    nextNode: 'jude_truth'
                }
            ),
            jude_focus: new StoryNode(
                'jude_focus',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Jude',
                    text: "Le passé n'a pas d'importance. Seule la victoire compte.",
                    background: 'royal_field',
                    nextNode: 'jude_match'
                }
            ),
            jude_observe_mark: new StoryNode(
                'jude_observe_mark',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Jude (pensée)',
                    text: "Ce Mark Evans... Il ne joue pas pour gagner. Il joue pour le plaisir. Comment peut-on être aussi... libre ?",
                    background: 'raimon_field',
                    nextNode: 'jude_doubt'
                }
            ),
            jude_truth: new StoryNode(
                'jude_truth',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Jude (pensée)',
                    text: "Père a trahi le grand-père de Mark il y a des années. Cette vendetta contre Raimon... c'est personnel pour lui.",
                    background: 'secret_archive',
                    nextNode: 'jude_moral_choice'
                }
            ),
            jude_doubt: new StoryNode(
                'jude_doubt',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Jude (pensée)',
                    text: "Est-ce que je joue vraiment pour moi ? Ou suis-je juste un pion de Père ?",
                    background: 'night_sky',
                    nextNode: 'jude_match'
                }
            ),
            jude_moral_choice: new StoryNode(
                'jude_moral_choice',
                StoryNodeType.CHOICE,
                {
                    prompt: "La vérité est cruelle. Jude doit choisir entre loyauté et justice.",
                    choices: [
                        new Choice(
                            "Confronter Ray Dark avec la vérité",
                            'jude_confront',
                            { courage: +20, loyalty_dark: -30 }
                        ),
                        new Choice(
                            "Garder le secret mais jouer honnêtement",
                            'jude_silent_honor',
                            { honor: +15, inner_conflict: +10 }
                        ),
                        new Choice(
                            "Utiliser cette information comme levier",
                            'jude_manipulate',
                            { cunning: +10, darkness: +10 }
                        )
                    ]
                }
            ),
            jude_confront: new StoryNode(
                'jude_confront',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Ray Dark',
                    text: "Tu oses me défier ?! Après tout ce que j'ai fait pour toi ?! Tu n'es rien sans moi !",
                    background: 'dark_office',
                    nextNode: 'jude_break_free'
                }
            ),
            jude_silent_honor: new StoryNode(
                'jude_silent_honor',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Jude (pensée)',
                    text: "Je ne peux pas trahir Père... mais je refuse de jouer sale. Je montrerai la vraie force sur le terrain.",
                    background: 'night_sky',
                    nextNode: 'jude_match'
                }
            ),
            jude_manipulate: new StoryNode(
                'jude_manipulate',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Jude (pensée)',
                    text: "L'information est le pouvoir. Je garderai ce secret... pour l'instant.",
                    background: 'dark_shadow',
                    nextNode: 'jude_match'
                }
            ),
            jude_break_free: new StoryNode(
                'jude_break_free',
                StoryNodeType.DIALOGUE,
                {
                    speaker: 'Jude',
                    text: "Non, Père. Je suis Jude Sharp. Pas votre marionnette. Je tracerai mon propre chemin !",
                    background: 'dark_office',
                    nextNode: 'jude_rebellion_match'
                }
            ),
            jude_match: new StoryNode(
                'jude_match',
                StoryNodeType.BATTLE,
                {
                    opponent: 'mark',
                    difficulty: 'normal',
                    winNode: 'jude_victory',
                    loseNode: 'jude_defeat_awakening'
                }
            ),
            jude_rebellion_match: new StoryNode(
                'jude_rebellion_match',
                StoryNodeType.BATTLE,
                {
                    opponent: 'mark',
                    difficulty: 'hard',
                    winNode: 'jude_honor_victory',
                    loseNode: 'jude_honor_defeat'
                }
            ),
            jude_victory: new StoryNode(
                'jude_victory',
                StoryNodeType.ENDING,
                {
                    title: 'Le Stratège Parfait',
                    text: "Jude a vaincu Raimon. Ray Dark est satisfait. Mais dans le cœur de Jude, un doute persiste...",
                    ending_type: 'neutral'
                }
            ),
            jude_defeat_awakening: new StoryNode(
                'jude_defeat_awakening',
                StoryNodeType.ENDING,
                {
                    title: 'Défaite Révélatrice',
                    text: "La défaite contre Raimon ouvre les yeux de Jude. Le football n'est pas qu'une question de victoire. Mark Evans lui a montré une autre voie.",
                    ending_type: 'good'
                }
            ),
            jude_honor_victory: new StoryNode(
                'jude_honor_victory',
                StoryNodeType.ENDING,
                {
                    title: 'Victoire de l\'Honneur',
                    text: "Jude a vaincu Raimon avec honneur, sans les tactiques sales de Ray Dark. Il a prouvé sa valeur à sa façon.",
                    ending_type: 'good'
                }
            ),
            jude_honor_defeat: new StoryNode(
                'jude_honor_defeat',
                StoryNodeType.ENDING,
                {
                    title: 'Liberté dans la Défaite',
                    text: "Jude a perdu, mais il s'est libéré de l'ombre de Ray Dark. Mark Evans et lui partagent maintenant un lien de respect mutuel.",
                    ending_type: 'good'
                }
            )
        }
    }
};

/**
 * Gestionnaire d'histoire
 */
class StoryManager {
    constructor() {
        this.currentCharacter = null;
        this.currentNode = null;
        this.storyVariables = {};
        this.visitedNodes = [];
    }

    /**
     * Initialiser une nouvelle histoire
     */
    startStory(characterId) {
        const story = STORIES[characterId];
        if (!story) {
            console.error(`Histoire non trouvée pour: ${characterId}`);
            return null;
        }

        this.currentCharacter = characterId;
        this.currentNode = story.nodes[story.startNode];
        this.storyVariables = {};
        this.visitedNodes = [story.startNode];

        return this.currentNode;
    }

    /**
     * Avancer dans l'histoire
     */
    advance(choiceIndex = null) {
        if (!this.currentNode) return null;

        let nextNodeId;

        switch (this.currentNode.type) {
            case StoryNodeType.DIALOGUE:
                nextNodeId = this.currentNode.content.nextNode;
                break;

            case StoryNodeType.CHOICE:
                if (choiceIndex !== null && this.currentNode.content.choices[choiceIndex]) {
                    const choice = this.currentNode.content.choices[choiceIndex];
                    nextNodeId = choice.nextNodeId;
                    
                    // Appliquer les conséquences
                    Object.entries(choice.consequences).forEach(([key, value]) => {
                        this.storyVariables[key] = (this.storyVariables[key] || 0) + value;
                    });
                }
                break;

            case StoryNodeType.BATTLE:
                // Le résultat du combat détermine le prochain nœud
                // Ceci sera géré par le système de combat
                break;

            case StoryNodeType.ENDING:
                return null; // Fin de l'histoire
        }

        if (nextNodeId) {
            const story = STORIES[this.currentCharacter];
            this.currentNode = story.nodes[nextNodeId];
            this.visitedNodes.push(nextNodeId);
            return this.currentNode;
        }

        return null;
    }

    /**
     * Obtenir le nœud actuel
     */
    getCurrentNode() {
        return this.currentNode;
    }

    /**
     * Définir le résultat d'un combat
     */
    setBattleResult(won) {
        if (this.currentNode && this.currentNode.type === StoryNodeType.BATTLE) {
            const nextNodeId = won 
                ? this.currentNode.content.winNode 
                : this.currentNode.content.loseNode;
            
            const story = STORIES[this.currentCharacter];
            this.currentNode = story.nodes[nextNodeId];
            this.visitedNodes.push(nextNodeId);
            return this.currentNode;
        }
        return null;
    }

    /**
     * Obtenir les variables d'histoire
     */
    getVariables() {
        return { ...this.storyVariables };
    }

    /**
     * Sauvegarder l'état de l'histoire
     */
    saveState() {
        return {
            character: this.currentCharacter,
            nodeId: this.currentNode?.id,
            variables: { ...this.storyVariables },
            visited: [...this.visitedNodes]
        };
    }

    /**
     * Charger un état sauvegardé
     */
    loadState(state) {
        const story = STORIES[state.character];
        if (!story) return false;

        this.currentCharacter = state.character;
        this.currentNode = story.nodes[state.nodeId];
        this.storyVariables = { ...state.variables };
        this.visitedNodes = [...state.visited];

        return true;
    }
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        StoryNodeType,
        StoryNode,
        Choice,
        STORIES,
        StoryManager
    };
}
