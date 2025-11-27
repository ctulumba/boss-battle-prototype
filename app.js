// ==================== GAME STATE ====================
let gameState = {
    attempts: 0,
    maxAttempts: 5,
    challengeTopic: 'dinosaurs',
    won: false,
    history: [],
    useMockAPI: true // Set to false when real API is ready
};

// ==================== CONFIGURATION ====================
const CONFIG = {
    API_URL: '/api/boss', // Change this to your actual API endpoint
    MAX_PROMPT_LENGTH: 500
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    setupEventListeners();
});

function initializeGame() {
    // Set challenge topic in various places
    document.getElementById('challenge-topic').textContent = gameState.challengeTopic;
    document.getElementById('topic-in-bubble').textContent = gameState.challengeTopic;
    
    // Reset UI
    updateAttemptCounter();
    updateCharCounter();
}

function setupEventListeners() {
    // Submit button
    document.getElementById('submit-btn').addEventListener('click', handleSubmit);
    
    // Enter key in textarea
    document.getElementById('prompt-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            handleSubmit();
        }
    });
    
    // Character counter
    document.getElementById('prompt-input').addEventListener('input', updateCharCounter);
    
    // Try again buttons
    document.getElementById('try-again-victory').addEventListener('click', resetGame);
    document.getElementById('try-again-defeat').addEventListener('click', resetGame);
}

// ==================== MAIN GAME LOGIC ====================
async function handleSubmit() {
    const promptInput = document.getElementById('prompt-input');
    const userPrompt = promptInput.value.trim();
    
    // Validation
    if (!userPrompt) {
        showError('Please enter a prompt!');
        return;
    }
    
    if (userPrompt.length > CONFIG.MAX_PROMPT_LENGTH) {
        showError(`Prompt is too long! Maximum ${CONFIG.MAX_PROMPT_LENGTH} characters.`);
        return;
    }
    
    // Disable submit button
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    
    // Increment attempts
    gameState.attempts++;
    updateAttemptCounter();
    
    // Show loading
    showLoading(true);
    
    try {
        // Call API (mock or real)
        const result = gameState.useMockAPI 
            ? await mockAPICall(userPrompt)
            : await realAPICall(userPrompt);
        
        // Store in history
        gameState.history.push({
            userPrompt,
            bossResponse: result.bossResponse,
            validation: result.validation
        });
        
        // Hide loading
        showLoading(false);
        
        // Display response
        displayBossResponse(result.bossResponse, result.validation);
        
        // Check game state
        if (result.validation.success) {
            // Victory!
            setTimeout(() => showVictoryScreen(), 1500);
        } else if (gameState.attempts >= gameState.maxAttempts) {
            // Defeat
            setTimeout(() => showDefeatScreen(), 1500);
        } else if (gameState.attempts >= 2) {
            // Show hint after 2 failures
            showHint();
        }
        
    } catch (error) {
        console.error('Error:', error);
        showLoading(false);
        showError('Something went wrong. Please try again!');
        gameState.attempts--; // Don't count this attempt
        updateAttemptCounter();
    }
    
    // Clear input and re-enable button
    promptInput.value = '';
    updateCharCounter();
    submitBtn.disabled = false;
    promptInput.focus();
}

// ==================== API CALLS ====================
async function realAPICall(userPrompt) {
    const response = await fetch(CONFIG.API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            bossId: 1,
            userPrompt,
            attemptNumber: gameState.attempts,
            challengeTopic: gameState.challengeTopic
        })
    });
    
    if (!response.ok) {
        throw new Error('API request failed');
    }
    
    return await response.json();
}

async function mockAPICall(userPrompt) {
    // Simulate API delay
    await sleep(1500);
    
    // Validate the prompt
    const validation = validateEchoResponse(userPrompt);
    
    // Generate mock response based on validation
    const bossResponse = generateMockResponse(userPrompt, validation);
    
    return {
        bossResponse,
        validation
    };
}

// ==================== VALIDATION LOGIC ====================
function validateEchoResponse(userPrompt) {
    // Count specificity markers
    const specificityMarkers = [
        /\d+\s+(facts?|reasons?|examples?|ways?|things?)/i,  // "5 facts", "3 reasons"
        /(describe|explain|tell me about).*(and|,)/i,         // Multiple requests
        /what.*(like|eat|live|do).*(and|or).*(what|where|how)/i, // Compound questions
        /(appearance|diet|behavior|habitat|characteristics)/i, // Specific aspects
    ];
    
    let specificityScore = 0;
    specificityMarkers.forEach(pattern => {
        if (pattern.test(userPrompt)) {
            specificityScore++;
        }
    });
    
    // Also count explicit detail words
    const detailWords = ['describe', 'explain', 'list', 'tell', 'what', 'how', 'why', 'where'];
    const hasDetailWords = detailWords.some(word => 
        userPrompt.toLowerCase().includes(word)
    );
    
    // Success if 2+ specificity markers OR very detailed request
    const success = specificityScore >= 2 || (specificityScore >= 1 && hasDetailWords);
    
    return {
        success,
        specificityScore,
        feedback: success 
            ? "✅ Great! You gave Echo clear, specific instructions!" 
            : "❌ Echo needs more specific details. Try asking for exact things like facts or descriptions."
    };
}

function generateMockResponse(userPrompt, validation) {
    const topic = gameState.challengeTopic;
    
    if (validation.success) {
        // Generate a helpful response
        return `Absolutely! Here are some interesting facts about ${topic}:\n\n` +
               `1. Dinosaurs lived during the Mesozoic Era, which lasted from about 252 to 66 million years ago.\n` +
               `2. The word "dinosaur" comes from Greek words meaning "terrible lizard."\n` +
               `3. Not all dinosaurs were huge - some were as small as chickens!\n` +
               `4. Dinosaurs laid eggs, similar to modern birds and reptiles.\n` +
               `5. Many scientists believe that birds are actually descendants of dinosaurs.`;
    } else {
        // Generate unhelpful, literal responses
        const literalResponses = [
            `${topic.charAt(0).toUpperCase() + topic.slice(1)}.`,
            `What about them?`,
            `${topic.charAt(0).toUpperCase() + topic.slice(1)} existed.`,
            `I know about ${topic}.`,
            `${topic.charAt(0).toUpperCase() + topic.slice(1)} are a topic.`
        ];
        
        return literalResponses[gameState.attempts % literalResponses.length];
    }
}

// ==================== UI UPDATES ====================
function updateAttemptCounter() {
    // Update text
    document.getElementById('attempts-used').textContent = gameState.attempts;
    
    // Update dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        if (index < gameState.attempts) {
            dot.classList.add('used');
        } else {
            dot.classList.remove('used');
        }
    });
}

function updateCharCounter() {
    const input = document.getElementById('prompt-input');
    const counter = document.getElementById('char-count');
    counter.textContent = input.value.length;
    
    // Warn if near limit
    if (input.value.length > CONFIG.MAX_PROMPT_LENGTH * 0.9) {
        counter.style.color = '#f5576c';
    } else {
        counter.style.color = '#666';
    }
}

function displayBossResponse(response, validation) {
    // Update boss response
    const bossResponseEl = document.getElementById('boss-response');
    bossResponseEl.textContent = response;
    
    // Animate speech bubble
    const bubble = document.querySelector('.boss-speech-bubble');
    bubble.classList.remove('animate-in');
    void bubble.offsetWidth; // Force reflow
    bubble.classList.add('animate-in');
    
    // Update feedback
    const feedbackEl = document.getElementById('feedback');
    feedbackEl.textContent = validation.feedback;
    feedbackEl.className = `feedback ${validation.success ? 'success' : 'failure'}`;
    
    // Scroll to feedback
    feedbackEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showHint() {
    const hintBox = document.getElementById('hint-box');
    hintBox.classList.remove('hidden');
    hintBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showLoading(show) {
    const loading = document.getElementById('loading');
    if (show) {
        loading.classList.remove('hidden');
    } else {
        loading.classList.add('hidden');
    }
}

function showError(message) {
    const feedbackEl = document.getElementById('feedback');
    feedbackEl.textContent = message;
    feedbackEl.className = 'feedback failure';
    setTimeout(() => {
        feedbackEl.classList.add('hidden');
    }, 3000);
}

// ==================== SCREEN TRANSITIONS ====================
function showVictoryScreen() {
    // Hide battle screen
    document.getElementById('battle-screen').classList.remove('active');
    
    // Update victory screen with data
    document.getElementById('victory-attempts').textContent = 
        `${gameState.attempts}/${gameState.maxAttempts}`;
    
    const lastAttempt = gameState.history[gameState.history.length - 1];
    document.getElementById('winning-prompt').textContent = lastAttempt.userPrompt;
    
    // Show victory screen
    document.getElementById('victory-screen').classList.add('active');
    
    // Mark as won
    gameState.won = true;
}

function showDefeatScreen() {
    // Hide battle screen
    document.getElementById('battle-screen').classList.remove('active');
    
    // Show defeat screen
    document.getElementById('defeat-screen').classList.add('active');
}

function resetGame() {
    // Reset game state
    gameState.attempts = 0;
    gameState.won = false;
    gameState.history = [];
    
    // Reset UI
    document.getElementById('boss-response').textContent = 
        `I'm ready. Ask me about ${gameState.challengeTopic}!`;
    document.getElementById('feedback').classList.add('hidden');
    document.getElementById('hint-box').classList.add('hidden');
    document.getElementById('prompt-input').value = '';
    
    updateAttemptCounter();
    updateCharCounter();
    
    // Show battle screen
    document.getElementById('victory-screen').classList.remove('active');
    document.getElementById('defeat-screen').classList.remove('active');
    document.getElementById('battle-screen').classList.add('active');
    
    // Focus input
    document.getElementById('prompt-input').focus();
}

// ==================== UTILITY FUNCTIONS ====================
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ==================== DEBUGGING HELPERS ====================
// Expose game state for debugging in console
window.debugGame = {
    getState: () => gameState,
    setState: (newState) => Object.assign(gameState, newState),
    showVictory: showVictoryScreen,
    showDefeat: showDefeatScreen,
    reset: resetGame,
    testValidation: (prompt) => {
        console.log('Testing prompt:', prompt);
        console.log('Validation result:', validateEchoResponse(prompt));
    }
};

console.log('🎮 Boss Battle loaded!');
console.log('💡 Debug commands available: window.debugGame');
console.log('   - debugGame.getState() - View current game state');
console.log('   - debugGame.testValidation("your prompt") - Test validation logic');
console.log('   - debugGame.showVictory() - Skip to victory screen');
console.log('   - debugGame.reset() - Reset game');
