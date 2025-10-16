const cubes = document.querySelectorAll('[class^="cube"]');
let gameCompleted = false;
let currentPlayer = 'krestik'; // 'krestik' или 'null'
let boardState = Array(9).fill(''); // Состояние игрового поля

function setupCubeToggle(cubeElement, index) {
    let clickCount = 0;
    
    cubeElement.addEventListener('click', () => {
        if (gameCompleted) return;
        
        // Если клетка уже занята - выходим
        if (boardState[index] !== '') return;
        
        clickCount++;
        if (clickCount === 1) {
            // Ход текущего игрока
            if (currentPlayer === 'krestik') {
                cubeElement.style.backgroundImage = 'url("./img/krestik.png")';
                cubeElement.style.backgroundSize = '220px 220px';
                boardState[index] = 'X';
                checkWinCondition('X');
                currentPlayer = 'null';
            } else {
                cubeElement.style.backgroundImage = 'url("./img/null.png")';
                cubeElement.style.backgroundSize = '300px 300px';
                boardState[index] = 'O';
                checkWinCondition('O');
                currentPlayer = 'krestik';
            }
            updatePlayerIndicator();
        } else if (clickCount === 2) {
            // Сброс клетки (только если игра не завершена)
            cubeElement.style.backgroundImage = 'none';
            boardState[index] = '';
            clickCount = 0;
        }
    });
}

function checkWinCondition(player) {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Горизонтальные
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Вертикальные
        [0, 4, 8], [2, 4, 6] // Диагональные
    ];

    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (boardState[a] === player && boardState[b] === player && boardState[c] === player) {
            declareVictory(player, condition);
            return;
        }
    }

    // Проверка на ничью
    if (boardState.every(cell => cell !== '')) {
        declareDraw();
    }
}

function declareVictory(winner, winningLine) {
    gameCompleted = true;
    
    // Подсвечиваем выигрышную линию
    winningLine.forEach(index => {
        const cube = cubes[index];
        if (cube) {
            cube.style.boxShadow = '0 0 20px gold';
            cube.style.transform = 'scale(1.1)';
        }
    });

    const winnerName = winner === 'X' ? 'Крестики' : 'Нолики';
    
    const winScreen = document.createElement('div');
    winScreen.id = 'winScreen';
    winScreen.innerHTML = `
        <div class="win-content">
            <h1>🎉 Победа! 🎉</h1>
            <p>${winnerName} выиграли!</p>
            <div class="win-buttons">
                <button id="playAgainBtn">Играть снова</button>
            </div>
        </div>
    `;
    
    addWinScreenStyles();
    document.body.appendChild(winScreen);
    
    document.getElementById('playAgainBtn').addEventListener('click', restartGame);
    playVictorySound();
}

function declareDraw() {
    gameCompleted = true;
    
    const winScreen = document.createElement('div');
    winScreen.id = 'winScreen';
    winScreen.innerHTML = `
        <div class="win-content">
            <h1>🤝 Ничья! 🤝</h1>
            <p>Все клетки заполнены</p>
            <div class="win-buttons">
                <button id="playAgainBtn">Играть снова</button>
            </div>
        </div>
    `;
    
    addWinScreenStyles();
    document.body.appendChild(winScreen);
    
    document.getElementById('playAgainBtn').addEventListener('click', restartGame);
}

function addWinScreenStyles() {
    if (document.getElementById('winStyles')) return;
    
    const styles = `
        <style id="winStyles">
            #winScreen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                animation: fadeIn 0.5s ease;
            }
            
            .win-content {
                background: white;
                padding: 2rem;
                border-radius: 15px;
                text-align: center;
                animation: scaleIn 0.5s ease;
                min-width: 300px;
            }
            
            .win-content h1 {
                color: #4CAF50;
                margin-bottom: 1rem;
            }
            
            #playAgainBtn {
                margin-top: 1rem;
                padding: 0.5rem 2rem;
                border: none;
                background: #4CAF50;
                color: white;
                border-radius: 5px;
                cursor: pointer;
                font-size: 1.1rem;
                transition: background 0.3s;
            }
            
            #playAgainBtn:hover {
                background: #45a049;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes scaleIn {
                from { transform: scale(0.8); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}

function playVictorySound() {
    // Раскомментируйте если есть звуковой файл
    // const audio = new Audio('./sounds/victory.mp3');
    // audio.play().catch(e => console.log('Audio play failed:', e));
}

function addPlayerIndicator() {
    // Удаляем старый индикатор если есть
    const oldIndicator = document.getElementById('playerIndicator');
    if (oldIndicator) oldIndicator.remove();
    
    const indicator = document.createElement('div');
    indicator.id = 'playerIndicator';
    indicator.innerHTML = `
        <div style="text-align: center; margin: 20px; font-size: 20px; font-weight: bold;">
            Сейчас ходят: <span id="currentPlayer" style="color: #4CAF50;">Крестики</span>
        </div>
    `;
    document.body.insertBefore(indicator, document.body.firstChild);
}

function updatePlayerIndicator() {
    const indicator = document.getElementById('currentPlayer');
    if (indicator) {
        if (currentPlayer === 'krestik') {
            indicator.textContent = 'Крестики';
            indicator.style.color = '#4CAF50';
        } else {
            indicator.textContent = 'Нолики';
            indicator.style.color = '#2196F3';
        }
    }
}

function restartGame() {
    // Убираем экран победы
    const winScreen = document.getElementById('winScreen');
    if (winScreen) winScreen.remove();
    
    // Сбрасываем состояние игры
    gameCompleted = false;
    currentPlayer = 'krestik';
    boardState = Array(9).fill('');
    
    // Сбрасываем все кубы
    cubes.forEach((cube, index) => {
        cube.style.backgroundImage = 'none';
        cube.style.boxShadow = '';
        cube.style.transform = '';
        cube.style.backgroundSize = '';
    });
    
    // Обновляем индикатор
    updatePlayerIndicator();
}

// Инициализация игры
addPlayerIndicator();

// Инициализируем кубы с правильными индексами
cubes.forEach((cube, index) => {
    // Добавляем data-атрибут для отладки
    cube.setAttribute('data-index', index);
    setupCubeToggle(cube, index);
});

// Добавляем стили для кубов
const cubeStyles = `
<style>
    [class^="cube"] {
        transition: all 0.3s ease;
        cursor: pointer;
        border: 2px solid #333;
        background-repeat: no-repeat;
        background-position: center;
    }
    
    [class^="cube"]:hover {
        background-color: #f0f0f0;
    }
</style>
`;
document.head.insertAdjacentHTML('beforeend', cubeStyles);

console.log('Игра инициализирована. Количество кубов:', cubes.length);
