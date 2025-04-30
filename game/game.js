import * as Graphics from './graphics.js';
import * as Mechanics from './mechanics.js';

// This is the main entry point file that imports the graphics and mechanics modules
// and starts the game when the user clicks the start button or presses the space bar

// Direct start button click to the mechanics module's start_game function
document.getElementById("start_button").addEventListener("click", Mechanics.start_game);

// Listen for custom restart event from UI controller
document.addEventListener("game:restart", () => {
    // Reset game state and reinitialize 
    Mechanics.resetGameState();
    
    // Re-add start button event listener
    document.getElementById("start_button").addEventListener("click", Mechanics.start_game);
});

// Add space bar listener for both start and restart
document.addEventListener("keydown", (event) => {
    if (!Mechanics.started && (event.key === " " || event.code === "Space" || event.keyCode === 32)) {
        Mechanics.start_game();
    }
});