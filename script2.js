const gameContainer = document.getElementById('game');

// Configurações da grade
const gridSize = 20;

// Mapa 15x15 (0= vazio, 1= caminho, 2= baú com tesouro, 3= baú vazio)
const mapData = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,1,1,2,0,0,0,0,0,0,0,1,1,1,2,0],
    [0,2,1,0,0,1,0,0,0,0,0,0,2,1,1,1,0,0,0,0],
    [0,0,1,0,0,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0],
    [0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0],
    [0,0,1,1,1,1,1,1,0,0,1,0,0,0,0,0,1,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,1,0,0,1,1,1,1,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,1,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,1,1,1,2,0,1,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,1,0,1,0,0,1,0,0,0,0,1,2,0,0,0],
    [0,0,1,2,0,1,0,1,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,1,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,1,1,1,1,1,0,0,0,0,1,1,1,0,0,1,1,2,0],
    [0,0,0,0,0,0,1,0,0,2,1,1,0,1,1,1,1,0,0,0],
    [0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0],
    [0,0,0,1,1,1,1,0,0,0,0,1,0,0,0,1,0,0,0,0],
    [0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,2,1,1,0,0,1,0,0,0,0,0,0,1,0,1,1,1,0,0],
    [0,0,0,1,1,1,1,0,0,0,2,1,1,1,0,0,0,2,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

// Variáveis globais que vamos precisar
let tileSize;
let offsetX;
let offsetY;
let player = { row: 5, col: 10 };

// Criar personagem
const character = document.createElement('div');
character.classList.add('character');
gameContainer.appendChild(character);

// Criar caixa de mensagem
const messageBox = document.createElement('div');
messageBox.classList.add('message');
gameContainer.appendChild(messageBox);

// Função para criar os elementos do mapa
function buildMap() {
    gameContainer.innerHTML = ''; // limpa tudo antes

    // Obtem o tamanho real do #game no layout
    const gameElement = document.getElementById('game');
    const containerWidth = gameElement.parentElement.clientWidth;
    const containerHeight = gameElement.parentElement.clientHeight;

    // Escolhe o menor para manter o quadrado, mas agora baseado no container, não no próprio game
    const mapSize = Math.min(containerWidth, containerHeight);

    // Ajusta o tamanho do #game para o tamanho quadrado correto
    gameElement.style.width = mapSize + 'px';
    gameElement.style.height = mapSize + 'px';

    // Calcula o tileSize já com redução de 10%
    tileSize = (mapSize / gridSize) * 0.8;

    // Calcula deslocamento para centralizar o mapa reduzido
    offsetX = (mapSize - (tileSize * gridSize)) / 2;
    offsetY = (mapSize - (tileSize * gridSize)) / 2;

    // Cria os tiles e baús conforme antes
    for(let r = 0; r < gridSize; r++) {
        for(let c = 0; c < gridSize; c++) {
            const val = mapData[r][c];

            if(val === 1) {
                const path = document.createElement('div');
                path.className = 'path';
                path.style.width = tileSize + 'px';
                path.style.height = tileSize + 'px';
                path.style.left = offsetX + c * tileSize + 'px';
                path.style.top = offsetY + r * tileSize + 'px';
                gameElement.appendChild(path);
            }

            if(val === 2 || val === 3) {
                const chest = document.createElement('div');
                chest.className = 'chest ' + (val === 2 ? 'green' : 'red');
                const chestSize = tileSize * 1.2;
                chest.style.width = chestSize + 'px';
                chest.style.height = chestSize + 'px';
                chest.style.left = offsetX + c * tileSize + (tileSize - chestSize) / 2 + 'px';
                chest.style.top = offsetY + r * tileSize + (tileSize - chestSize) / 2 + 'px';
                gameElement.appendChild(chest);
            }
        }
    }

    // Adiciona personagem e mensagem
    gameElement.appendChild(character);
    gameElement.appendChild(messageBox);

    updateCharacterPosition();
}

function updateCharacterPosition() {
    const charHeight = tileSize * 2.5; // personagem 2x altura do tile
    const charWidth = tileSize * 1.5; // largura proporcional

    character.style.width = charWidth + 'px';
    character.style.height = charHeight + 'px';

    // Posicionar personagem alinhado pela base do tile
    const left = offsetX + player.col * tileSize + tileSize - charWidth + (tileSize * 0.3);
    const top = offsetY + player.row * tileSize + tileSize - charHeight - (tileSize * 0.3);

    character.style.left = left + 'px';
    character.style.top = top + 'px';
}

function isWalkable(row, col) {
    return mapData[row]?.[col] === 1 || mapData[row]?.[col] === 2 || mapData[row]?.[col] === 3;
}

function checkInteraction() {
    const row = player.row;
    const col = player.col;
    const val = mapData[row][col];

    if(val === 2) {
        showMessage('🎉 Tesouro encontrado!');
    } else if(val === 3) {
        showMessage('⚠️ Está vazio!');
    } else {
        showMessage('🤷‍♂️ Aqui não tem nada!');
    }
}

function showMessage(text) {
    messageBox.textContent = text;
    messageBox.style.display = 'block';
    setTimeout(() => messageBox.style.display = 'none', 2000);
}

// Movimento do personagem
document.addEventListener('keydown', e => {
    let newRow = player.row;
    let newCol = player.col;

    if(e.key === 'ArrowUp') newRow--;
    else if(e.key === 'ArrowDown') newRow++;
    else if(e.key === 'ArrowLeft') newCol--;
    else if(e.key === 'ArrowRight') newCol++;

    if(isWalkable(newRow, newCol)) {
        player.row = newRow;
        player.col = newCol;
        updateCharacterPosition();
    }

    if(e.code === 'Space') checkInteraction();
});

// Reconstrói mapa ao carregar e ao redimensionar a janela
window.addEventListener('resize', buildMap);
buildMap();