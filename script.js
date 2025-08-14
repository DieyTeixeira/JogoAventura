const gameContainer = document.getElementById('game');

// Configurações da grade
const gridSize = 17;

// Mapa 15x15 (0= vazio, 1= caminho, 2= baú com tesouro, 3= baú vazio)
const mapData = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,1,1,2,0,0,0,0,0,0,2,0,0,0,0],
    [0,0,0,1,0,0,0,0,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,0,0,0,1,1,1,0,0],
    [0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0],
    [0,3,1,1,1,1,1,0,1,0,1,1,1,1,1,0,0],
    [0,0,1,0,0,0,1,0,1,1,1,0,0,0,0,0,0],
    [0,0,1,0,0,0,1,0,1,0,0,0,1,1,1,0,0],
    [0,0,1,0,1,1,1,1,1,0,0,0,1,0,1,0,0],
    [0,0,1,0,1,0,0,0,1,1,1,1,1,0,1,5,0],
    [0,0,1,1,1,1,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,1,0,2,1,1,1,1,1,1,1,0,0],
    [0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,0,0],
    [0,0,4,1,0,1,1,1,1,1,1,1,1,0,1,0,0],
    [0,0,0,1,0,1,0,0,0,1,0,0,1,1,1,0,0],
    [0,0,0,1,1,1,1,1,1,1,0,0,2,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

// Variáveis globais que vamos precisar
let tileSize;
let offsetX;
let offsetY;
let player = { row: 5, col: 8 };

// Criar personagem
const character = document.createElement('div');
character.classList.add('character');
gameContainer.appendChild(character);

// Lottie
const lottieAnimation = lottie.loadAnimation({
    container: document.getElementById('lottieContainer'),
    renderer: 'svg',
    loop: true,
    autoplay: false,
    path: 'https://lottie.host/af03f169-377f-48d4-b129-071dc8e67c48/5yv253NX5W.json'
    /*path: 'spray.gif'*/
});

// Criar caixa de mensagem
const messageBox = document.createElement('div');
messageBox.classList.add('message');
gameContainer.appendChild(messageBox);

// Função para criar os elementos do mapa
function buildMap() {

    const gameElement = document.getElementById('game');
    const joystickContainer = document.querySelector('.joystick-container');

    // Altura e largura disponíveis do viewport
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Altura do joystick + margem
    const joystickHeight = joystickContainer.offsetHeight + 15;

    // Largura máxima do container
    const containerWidth = gameElement.parentElement.clientWidth;

    // Tamanho do mapa será o menor entre largura do container e altura disponível
    const maxMapSize = Math.min(containerWidth, vh - joystickHeight - 20); // 20px extra de folga

    // Define largura e altura do #game
    gameElement.style.width = maxMapSize + 'px';
    gameElement.style.height = maxMapSize + 'px';

    const mapWidth = gameElement.clientWidth;
    const mapHeight = gameElement.clientHeight;

    // Tile size baseado no menor tamanho do mapa
    tileSize = (Math.min(mapWidth, mapHeight) / gridSize) * 0.8;

    // Offset para centralizar o grid
    offsetX = (mapWidth - tileSize * gridSize) / 2;
    offsetY = (mapHeight - tileSize * gridSize) / 2;

    // Limpa elementos anteriores
    gameElement.innerHTML = '';

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

            if(val === 2 || val === 3 || val === 4 || val === 5) {
                const chest = document.createElement('div');
                chest.className = 'chest ' + (val === 2 ? 'green' : 'red');
                const chestSize = tileSize * 1.4;
                chest.style.width = chestSize + 'px';
                chest.style.height = chestSize + 'px';
                chest.style.left = offsetX + c * tileSize + (tileSize - chestSize) / 2 + 'px';
                chest.style.top = offsetY + r * tileSize + (tileSize - chestSize) / 2 + (tileSize * 0.2) + 'px';
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
    return mapData[row]?.[col] === 1;
}

function checkInteraction() {
    const row = player.row;
    const col = player.col;

    // Verifica casas adjacentes
    const adjTiles = [
        mapData[row-1]?.[col], // cima
        mapData[row+1]?.[col], // baixo
        mapData[row]?.[col-1], // esquerda
        mapData[row]?.[col+1]  // direita
    ];

    // Procura o primeiro baú encontrado
    const chestNumber = adjTiles.find(tile => tile !== undefined && tile >= 2);

    if (chestNumber !== undefined) showMessage(chestNumber);
}

function showMessage(chestNumber) {
    const modal = document.getElementById('gameModal');
    const modalText = document.getElementById('modalText');
    const modalImage = document.getElementById('modalImage');
    const closeModal = document.getElementById('closeModal');
    const lottieContainer = document.getElementById('lottieContainer');

    modalText.innerHTML = '';
    modalImage.style.display = 'none';
    lottieContainer.style.display = 'block';
    lottieAnimation.play();
    modal.style.display = 'flex';

    closeModal.onclick = () => { lottieAnimation.stop(); modal.style.display = 'none'; };

    setTimeout(()=>{
        lottieAnimation.stop();
        lottieContainer.style.display='none';

        if(chestNumber===2){
            modalText.innerHTML = `⚠️ Este baú está vazio! Mas não desista!`;
            setTimeout(()=>{ modal.style.display='none'; },2000);
        } else {
            const info = getMonumentInfo(chestNumber);
            modalText.innerHTML = `<h2>${info.nome}</h2><p>${info.desc}</p>`;
            modalImage.src = info.img;
            modalImage.style.display='block';
        }
    }, 2000);
}

// Função com dados dos monumentos
function getMonumentInfo(num) {
    switch(num) {
        case 2:
            return {
                desc: 'Este baú está vazio! Mas não desista, continue sua busca!'
            };
        case 3:
            return {
                nome: 'Taj Mahal',
                desc: 'O Taj Mahal é um mausoléu localizado na Índia, conhecido por sua beleza arquitetônica.',
                img: 'taj-mahal.jpg'
            };
        case 4:
            return {
                nome: 'Coliseu',
                desc: 'O Coliseu, em Roma, é um dos maiores anfiteatros já construídos na história.',
                img: 'coliseu.jpg'
            };
        case 5:
            return {
                nome: 'Cristo Redentor',
                desc: 'Localizado no Rio de Janeiro, é um dos símbolos mais reconhecidos do Brasil.',
                img: 'cristo-redentor.jpg'
            };
    }
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

// Função para movimentar via joystick
function movePlayer(dir) {
    let newRow = player.row;
    let newCol = player.col;

    if(dir === 'up') newRow--;
    else if(dir === 'down') newRow++;
    else if(dir === 'left') newCol--;
    else if(dir === 'right') newCol++;

    if(isWalkable(newRow, newCol)) {
        player.row = newRow;
        player.col = newCol;
        updateCharacterPosition();
    }
}

// Eventos dos botões de direção
document.querySelectorAll('.joy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const dir = btn.getAttribute('data-dir');
        movePlayer(dir);
    });
});

// Botão de ação
document.querySelector('.action-btn').addEventListener('click', checkInteraction);