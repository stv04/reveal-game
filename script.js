/**
 * Revela con Fe 🎲
 * Juego de cartas digital para grupos cristianos.
 * Diseñado para ser fácil de usar en móvil y divertido en grupo.
 *
 * Nota: este proyecto fue inspirado por un juego comercial. Se renombró a
 * "Revela" y se han evitado referencias directas a marcas comerciales para
 * reducir riesgo de conflictos por derechos de autor o marcas.
 */

// Mazos de cartas por categoría
/**
 * Categorías:
 * - luz: Situaciones cotidianas y momentos divertidos
 * - fe: Reflexiones personales sobre tu camino espiritual
 * - comunidad: Preguntas sobre el grupo y la iglesia
 * - biblia: Conocimiento bíblico e historias
 * - especial: Retos, oraciones y momentos de adoración
 */
const mazos = {
    luz: [
        "¿Has usado memes cristianos para evangelizar?",
        "¿Has bailado alguna canción cristiana?",
        "¿Has confundido un versículo en público?",
        "¿Has hecho una historia en Instagram desde la iglesia?",
        "¿Has hecho una broma durante una reunión de célula?",
        "¿Has usado stickers cristianos en WhatsApp?",
        "¿Alguna vez te has dormido durante el sermón?",
        "¿Has cantado una alabanza en la ducha?",
        "¿Has intentado explicar un versículo y te has enredado?",
        "¿Cuál es tu meme cristiano favorito?",
        "¿Has tratado de evangelizar usando referencias de películas?",
        "¿Alguna vez has confundido la letra de una alabanza?"
    ],
    fe: [
        "¿Qué oración te ha marcado últimamente?",
        "¿Has sentido que Dios te respondió directamente?",
        "¿Qué significa para ti 'ser luz en el mundo'?",
        "¿Has compartido tu fe con alguien fuera de la iglesia?",
        "¿Has sentido consuelo al leer la Biblia en momentos difíciles?",
        "¿Has ayunado por una causa específica?",
        "¿Cuál fue el momento en que más cerca te sentiste de Dios?",
        "¿Qué versículo te ayuda cuando tienes dudas?",
        "¿Cómo explicarías tu fe a un niño?",
        "¿Qué testimonio personal te gustaría compartir?",
        "¿Qué hábito espiritual te gustaría desarrollar?",
        "¿Cómo mantienes tu fe en momentos difíciles?"
    ],
    comunidad: [
        "¿A quién del grupo admiras por su fe?",
        "¿Has ayudado a alguien del grupo en un momento difícil?",
        "¿Qué actividad cristiana te gustaría hacer con este grupo?",
        "¿Has orado por alguien aquí sin que lo supiera?",
        "¿Has invitado a alguien nuevo a la iglesia?",
        "¿Has participado en una actividad de servicio comunitario con tu grupo?",
        "¿Qué te hizo elegir esta iglesia/grupo?",
        "¿Qué momento especial has vivido con este grupo?",
        "¿Cómo te gustaría servir en la iglesia?",
        "¿Qué te hace sentir bienvenido en la comunidad?",
        "¿Qué proyecto te gustaría iniciar en la iglesia?",
        "¿Cómo podemos orar por ti esta semana?"
    ],
    biblia: [
        "¿Puedes nombrar tres mujeres de la Biblia?",
        "¿Qué personaje bíblico te inspira más?",
        "¿Qué libro de la Biblia te cuesta entender?",
        "¿Cuál fue el primer milagro de Jesús?",
        "¿Qué profeta fue tragado por un pez?",
        "¿Qué salmo te sabes de memoria?",
        "¿Cuál es tu historia bíblica favorita y por qué?",
        "¿Qué parábola de Jesús te parece más relevante hoy?",
        "¿Qué personaje bíblico te gustaría conocer?",
        "¿Cuál crees que es el mensaje central de la Biblia?",
        "¿Qué versículo te ayuda en momentos de ansiedad?",
        "¿Qué pasaje bíblico te desafía más?"
    ],
    especial: [
        "🙏 Oración por agradecimiento",
        "🙏 Oración por unidad del grupo",
        "🙏 Oración por sanidad",
        "🎯 Haz una mímica de una historia bíblica",
        "🎯 Canta un fragmento de tu alabanza favorita",
        "📖 Comparte un versículo que te da paz",
        "🙏 Oración por la familia",
        "🎯 Dibuja una escena bíblica y que el grupo adivine",
        "📖 Resume un libro de la Biblia en una frase",
        "🎯 Inventa una parábola moderna",
        "🙏 Oración por dirección divina",
        "📖 Comparte una promesa bíblica que te sostiene"
    ]
};
// Estado del juego
/**
 * Estado del juego
 * @type {Object.<string, Set<number>>} Registro de índices usados por mazo
 */
const used = {}; 

/**
 * @type {Array<Object>} Historial de cartas jugadas
 */
const historyArr = []; 

/**
 * @type {Object|null} Última carta mostrada
 */
let lastCard = null;

/**
 * @type {string|null} Último mazo usado
 */
let lastDeck = null;

// Referencias a elementos del DOM
/** @type {HTMLElement} Contenedor de la carta */
const cardEl = document.getElementById('card');
/** @type {HTMLElement} Texto frontal */
const cardText = document.getElementById('card-text');
/** @type {HTMLElement} Texto posterior */
const cardBackText = document.getElementById('card-back-text');
/** @type {HTMLElement} Contador de jugadas */
const playedCountEl = document.getElementById('played-count');
/** @type {HTMLElement} Lista de historial */
const historyEl = document.getElementById('history');
/** @type {HTMLElement} Estado de mazos */
const statusEl = document.getElementById('status');
/** @type {HTMLCanvasElement} Canvas para efectos */
const confettiCanvas = document.getElementById('confetti');
for (const k in mazos)
    used[k] = new Set();
/**
 * Actualiza el contador de cartas disponibles por mazo
 * y muestra el estado en la interfaz
 */
function updateStatus() {
    const lines = Object.keys(mazos).map(k => `${k}: ${mazos[k].length - used[k].size}`);
    statusEl.textContent = 'Mazos disponibles — ' + lines.join(' • ');
}
updateStatus();

/**
 * Selecciona un mazo al azar entre los disponibles
 * @returns {string} Nombre del mazo elegido
 */
function chooseRandomDeck() {
    const keys = Object.keys(mazos);
    return keys[Math.floor(Math.random() * keys.length)];
}

/**
 * Extrae una carta aleatoria no usada del mazo especificado
 * @param {string} deck Nombre del mazo
 * @returns {Object|null} Carta extraída o null si el mazo está vacío
 */
function drawFromDeck(deck) {
    const cards = mazos[deck];
    if (!cards)
        return null;
    if (used[deck].size >= cards.length)
        return null;
    let idx;
    do {
        idx = Math.floor(Math.random() * cards.length);
    } while (used[deck].has(idx));
    used[deck].add(idx);
    return { text: cards[idx], deck, idx };
}
/**
 * Muestra una carta en la interfaz con animación y efectos especiales
 * @param {Object} card Carta a mostrar
 * @param {string} card.text Texto de la carta
 * @param {string} card.deck Mazo de origen
 */
function reveal(card) {
    if (!card)
        return;
    lastCard = card.text;
    lastDeck = card.deck;
    cardEl.classList.remove('flip');
    // show a quick flipping placeholder on both faces
    if(cardText) cardText.textContent = '...';
    if(cardBackText) cardBackText.textContent = '...';
    setTimeout(() => {
        if(cardText) cardText.textContent = card.text;
        if(cardBackText) cardBackText.textContent = card.text;
        cardEl.classList.add('flip');
    }, 80);
    historyArr.unshift({ deck: card.deck, text: card.text });
    renderHistory();
    playedCountEl.textContent = String(historyArr.length);
    updateStatus();
    // Activar confeti para cartas especiales o con emojis especiales
    if (/[🎯🙏📖🌟✝️]/.test(card.text) || card.deck === 'especial')
        fireConfetti();
}

/**
 * Extrae una carta del mazo especificado o uno aleatorio
 * @param {string} [deck] Mazo específico o 'random' para aleatorio
 */
function drawCard(deck) {
    const chosen = (!deck || deck === 'random') ? chooseRandomDeck() : deck;
    const result = drawFromDeck(chosen);
    if (!result) {
            const msg = `El mazo "${chosen}" se agotó. Pulsa Reiniciar para volver a jugar.`;
            if(cardText) cardText.textContent = msg;
            if(cardBackText) cardBackText.textContent = msg;
        return;
    }
    reveal(result);
}
// Asignar manejadores de eventos a los botones de mazos
/** Configurar botones para cada mazo específico */
document.querySelectorAll('[data-deck]').forEach(btn => {
    btn.addEventListener('click', () => { drawCard(btn.dataset.deck); });
});

/** Configurar botón de mazo aleatorio */
document.getElementById('btn-random').addEventListener('click', () => drawCard('random'));

/** Configurar botón de reinicio */
document.getElementById('btn-again').addEventListener('click', () => {
    if (!lastDeck) {
        cardText.textContent = 'Primero roba una carta.';
        return;
    }
    reveal({ text: lastCard, deck: lastDeck });
});
document.getElementById('btn-reset').addEventListener('click', () => {
    for (const k in used)
        used[k].clear();
    historyArr.length = 0;
    lastCard = null;
    lastDeck = null;
    renderHistory();
    playedCountEl.textContent = '0';
    updateStatus();
    cardText.textContent = 'Mazos reiniciados. Elige un mazo.';
});
document.getElementById('btn-copy').addEventListener('click', () => {
    if (!lastCard)
        return alert('No hay carta para copiar');
    navigator.clipboard?.writeText(`${lastCard} (${lastDeck})`).then(() => {
        const prevFront = cardText.textContent;
        const prevBack = cardBackText ? cardBackText.textContent : prevFront;
        if(cardText) cardText.textContent = 'Copiado ✅';
        if(cardBackText) cardBackText.textContent = 'Copiado ✅';
        setTimeout(() => {
            if(cardText) cardText.textContent = prevFront;
            if(cardBackText) cardBackText.textContent = prevBack;
        }, 900);
    }).catch(() => alert('No se pudo copiar en el portapapeles'));
});
document.getElementById('clear-history').addEventListener('click', () => { historyArr.length = 0; renderHistory(); playedCountEl.textContent = '0'; });
function renderHistory() {
    historyEl.innerHTML = historyArr.map(h => `<div class="history-item"><strong>${h.deck}</strong> — ${h.text}</div>`).join('');
}
const confettiCtx = confettiCanvas.getContext('2d');
let confettiPieces = [];
function resize() { confettiCanvas.width = innerWidth; confettiCanvas.height = innerHeight; }
window.addEventListener('resize', resize);
resize();
function fireConfetti() {
    for (let i = 0; i < 80; i++) {
        confettiPieces.push({
            x: Math.random() * confettiCanvas.width,
            y: -20 - Math.random() * 200,
            vx: (Math.random() - 0.5) * 2,
            vy: 2 + Math.random() * 4,
            size: 6 + Math.random() * 8,
            color: ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93'][Math.floor(Math.random() * 5)],
            rot: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 10
        });
    }
    if (!confettiLoopRunning)
        runConfetti();
}
let confettiLoopRunning = false;
function runConfetti() {
    confettiLoopRunning = true;
    const t = setInterval(() => {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        for (let i = confettiPieces.length - 1; i >= 0; i--) {
            const p = confettiPieces[i];
            p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.rot += p.rotSpeed;
            confettiCtx.save(); confettiCtx.translate(p.x, p.y); confettiCtx.rotate(p.rot * Math.PI / 180);
            confettiCtx.fillStyle = p.color; confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            confettiCtx.restore();
            if (p.y > confettiCanvas.height + 50) confettiPieces.splice(i, 1);
        }
        if (confettiPieces.length === 0) { clearInterval(t); confettiLoopRunning = false; confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height); }
    }, 1000 / 60);
}
cardEl.addEventListener('click', () => { drawCard(); });
// Exponer API mínima para depuración en consola con el nuevo nombre
window._Revela = { drawCard, drawFromDeck, used, mazos };
