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
    [0,2,1,1,1,1,1,0,1,0,1,1,1,1,1,0,0],
    [0,0,1,0,0,0,1,0,1,1,1,0,0,0,0,0,0],
    [0,0,1,0,0,0,1,0,1,0,0,0,1,1,1,0,0],
    [0,0,1,0,1,1,1,1,1,0,0,0,1,0,1,0,0],
    [0,0,1,0,1,0,0,0,1,1,1,1,1,0,1,2,0],
    [0,0,1,1,1,1,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,1,0,2,1,1,1,1,1,1,1,0,0],
    [0,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0],
    [0,0,2,1,1,1,1,1,1,1,1,1,1,0,1,0,0],
    [0,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0],
    [0,0,0,0,1,1,1,1,1,0,0,2,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

const originalMap = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,1,1,2,0,0,0,0,0,0,2,0,0,0,0],
    [0,0,0,1,0,0,0,0,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,0,0,0,1,1,1,0,0],
    [0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0],
    [0,2,1,1,1,1,1,0,1,0,1,1,1,1,1,0,0],
    [0,0,1,0,0,0,1,0,1,1,1,0,0,0,0,0,0],
    [0,0,1,0,0,0,1,0,1,0,0,0,1,1,1,0,0],
    [0,0,1,0,1,1,1,1,1,0,0,0,1,0,1,0,0],
    [0,0,1,0,1,0,0,0,1,1,1,1,1,0,1,2,0],
    [0,0,1,1,1,1,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,1,0,2,1,1,1,1,1,1,1,0,0],
    [0,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0],
    [0,0,2,1,1,1,1,1,1,1,1,1,1,0,1,0,0],
    [0,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0],
    [0,0,0,0,1,1,1,1,1,0,0,2,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

// Variáveis globais que vamos precisar
let tileSize;
let offsetX;
let offsetY;
let player = { row: 5, col: 8 };
let chestsOpenedWithItem = 0; // contador de baús com item

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

// Pré-carregar imagens dos baús
const monumentImages = ['bau-trem.png', 'bau-flechas.png', 'bau-casa-artes.png', 
                        'image-trem.png', 'image-flechas.png', 'image-casa-artes.png'];

monumentImages.forEach(src => {
    const img = new Image();
    img.src = src;
});

function randomizeChests() {
    // Pega todas as posições onde tem baú "2"
    let chestPositions = [];
    for (let r = 0; r < mapData.length; r++) {
        for (let c = 0; c < mapData[r].length; c++) {
            if (mapData[r][c] === 2) {
                chestPositions.push({ row: r, col: c });
            }
        }
    }

    // Embaralha a lista de baús
    chestPositions.sort(() => Math.random() - 0.5);

    // Garante que existem pelo menos 3 baús
    if (chestPositions.length >= 3) {
        // Define 1 para cada tipo especial
        mapData[chestPositions[0].row][chestPositions[0].col] = 4;
        mapData[chestPositions[1].row][chestPositions[1].col] = 6;
        mapData[chestPositions[2].row][chestPositions[2].col] = 8;
    }
}

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

            if(val >= 2 && val <= 9) {
                const chest = document.createElement('div');

                let chestClass;
                let size;

                const closedSize = tileSize * 1.5;  // tamanho do baú fechado
                const openedSize = tileSize * 1.8;  // tamanho do baú aberto
                const openedItemSize = tileSize * 2.3;  // tamanho do baú aberto com item

                switch (val) {
                    case 2:
                        chestClass = 'closed'; // baús fechados
                        size = closedSize;
                        break;
                    case 4:
                        chestClass = 'closed'; // baús fechados
                        size = closedSize;
                        break;
                    case 6:
                        chestClass = 'closed'; // baús fechados
                        size = closedSize;
                        break;
                    case 8:
                        chestClass = 'closed'; // baús fechados
                        size = closedSize;
                        break;
                    case 3:
                        chestClass = 'opened'; // baú aberto normal
                        size = openedSize;
                        break;
                    case 5:
                        chestClass = 'openedtrem'; // baú com trem
                        size = openedItemSize;
                        break;
                    case 7:
                        chestClass = 'openedflechas'; // baú com flechas
                        size = openedItemSize;
                        break;
                    case 9:
                        chestClass = 'openedcasa'; // baú com casa
                        size = openedItemSize;
                        break;
                    default:
                        chestClass = 'closed';
                        size = closedSize;
                }

                chest.className = 'chest ' + chestClass;
                chest.dataset.row = r;
                chest.dataset.col = c;

                /*const isOpen = (val % 2 !== 0); // ímpares são abertos
                chest.className = 'chest ' + (isOpen ? 'opened' : 'closed');
                chest.dataset.row = r;
                chest.dataset.col = c;

                // Tamanho diferente para closed
                const closedSize = tileSize * 1.5;  // tamanho do baú fechado
                const openedSize = tileSize * 1.8;    // tamanho do baú aberto (quando interagido)
                const size = isOpen ? openedSize : closedSize;*/

                chest.style.width = size + 'px';
                chest.style.height = size + 'px';
                chest.style.left = offsetX + c * tileSize + (tileSize - size) / 2 + 'px';
                chest.style.top = offsetY + r * tileSize + (tileSize - size) / 2 - (tileSize * 0.1) + 'px';
                
                // Salva os tamanhos no dataset para usar depois
                chest.dataset.closedSize = closedSize;
                chest.dataset.openedSize = openedSize;
                chest.dataset.openedItemSize = openedItemSize;
                
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
    const charHeight = tileSize * 3.2; // personagem 2x altura do tile
    const charWidth = tileSize * 2; // largura proporcional

    character.style.width = charWidth + 'px';
    character.style.height = charHeight + 'px';

    // Posicionar personagem alinhado pela base do tile
    const left = offsetX + player.col * tileSize + tileSize - charWidth + (tileSize * 0.6);
    const top = offsetY + player.row * tileSize + tileSize - charHeight + (tileSize * 0.1);

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
    const chestNumber = adjTiles.find(tile => tile !== undefined && tile >= 2 && tile <= 8 && tile % 2 === 0);

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

    // Encontrar o baú próximo
    const chestElements = document.querySelectorAll('.chest');
    let interactedChest = null;
    let chestPos = null;
    chestElements.forEach(chest => {
        const row = parseInt(chest.dataset.row);
        const col = parseInt(chest.dataset.col);
        if ((Math.abs(row - player.row) + Math.abs(col - player.col)) === 1) {
            interactedChest = chest;
            chestPos = { row, col };
        }
    });

    const closeChestModal = () => {
        lottieAnimation.stop();
        modal.style.display = 'none';
    };

    closeModal.onclick = closeChestModal;

    // Lottie finaliza
    setTimeout(() => {
        lottieAnimation.stop();
        lottieContainer.style.display = 'none';

        if (!interactedChest) return;

        if (chestNumber === 2 || chestNumber === 3) {
            // Baú vazio
            modalText.innerHTML = `⚠️ Que pena, este baú está vazio!`;

            // Marca o baú como aberto
            interactedChest.classList.remove('closed');
            interactedChest.classList.add('opened'); // ou 'openedEmpty' se quiser diferenciar
            const newSize = interactedChest.dataset.openedSize;
            const row = parseInt(interactedChest.dataset.row);
            const col = parseInt(interactedChest.dataset.col);
            interactedChest.style.width = newSize + 'px';
            interactedChest.style.height = newSize + 'px';
            interactedChest.style.left = offsetX + col * tileSize + (tileSize - newSize) / 2 + (tileSize * 0.1) + 'px';
            interactedChest.style.top = offsetY + row * tileSize + (tileSize - newSize) / 2 - (tileSize * 0.4) + 'px';
                
            // Atualiza o mapa para não interagir novamente
            mapData[chestPos.row][chestPos.col] = chestNumber + 1;    

            // Fecha automaticamente após 2s
            setTimeout(closeChestModal, 2000);

        } else {
            // Baú com item
            const infoImg = getMonumentImage(chestNumber);
            const info = getMonumentInfo(chestNumber);

            // Mostra a imagem primeiro
            modalImage.src = infoImg.img;
            modalImage.style.display = 'block';
            modalImage.style.width = '80%';
            modalImage.style.height = 'auto';
            modalImage.style.margin = '0 auto';
            modalText.innerHTML = '';

            setTimeout(() => {
                modalImage.style.display = 'none';
                modalText.innerHTML = `
                    <div class="fade-in">
                        <img src="${info.img}" alt="${info.nome}" 
                            style="width: 80%; display:block; margin:0 auto 10px;">
                        <h2 style="font-size: 2em;">${info.nome}</h2>
                        <p>${info.desc}</p>
                        <p style="margin-top: 1em; font-size: 1.2em;">${info.text}</p>
                    </div>
                `;

                // O fechamento agora só dispara o modal final depois que o usuário clicar
                closeModal.onclick = () => {
                    closeChestModal();

                    // Marca o baú como aberto
                     interactedChest.classList.remove('closed');
                    let openClass, newSize, deslocX, deslocY;
                    switch (chestNumber) {
                        case 4:
                            openClass = 'openedtrem';
                            newSize = interactedChest.dataset.openedItemSize;
                            deslocX = tileSize * 0.2;
                            deslocY = tileSize * 0.6;
                            break;
                        case 6:
                            openClass = 'openedflechas';
                            newSize = interactedChest.dataset.openedItemSize;
                            deslocX = tileSize * 0.2;
                            deslocY = tileSize * 0.6;
                            break;
                        case 8:
                            openClass = 'openedcasa';
                            newSize = interactedChest.dataset.openedItemSize;
                            deslocX = tileSize * 0.2;
                            deslocY = tileSize * 0.6;
                            break;
                    }

                    interactedChest.classList.add(openClass);
                    interactedChest.style.width = newSize + 'px';
                    interactedChest.style.height = newSize + 'px';
                    const row = parseInt(interactedChest.dataset.row);
                    const col = parseInt(interactedChest.dataset.col);
                    interactedChest.style.left = offsetX + col * tileSize + (tileSize - newSize) / 2 + deslocX + 'px';
                    interactedChest.style.top = offsetY + row * tileSize + (tileSize - newSize) / 2 - deslocY + 'px';
                    mapData[chestPos.row][chestPos.col] = chestNumber + 1;

                    // Incrementa contador de baús com item
                    chestsOpenedWithItem++;

                    // Mostra modal final somente se abriu todos os 3 baús com item
                    if (chestsOpenedWithItem === 3) {
                        modalText.innerHTML = `
                            <div style="text-align:center; padding:20px;">
                                <h2>🎉 Parabéns!</h2>
                                <p>Você encontrou todos os 3 tesouros escondidos!</p>
                                <button id="restartBtn" class="joy-btn">
                                    Reiniciar Jogo
                                </button>
                            </div>
                        `;
                        modal.style.display = 'flex';

                        document.getElementById('restartBtn').onclick = () => {
                            modal.style.display = 'none';
                            restartGame();
                        };
                    }
                };

            }, 2000); // tempo para mostrar imagem antes do texto
        }

    }, 2000); // tempo do Lottie
}

function getMonumentImage(num) {
    switch(num) {
        case 4:
            return {
                img: 'bau-trem.png'
            };
        case 6:
            return {
                img: 'bau-flechas.png'
            };
        case 8:
            return {
                img: 'bau-casa-artes.png'
            };
    }
}

// Função com dados dos monumentos
function getMonumentInfo(num) {
    switch(num) {
        case 4:
            return {
                img: 'image-trem.png',
                nome: 'Antiga Estação Férrea',
                desc: 'Monumento. Arqueologia Histórica.',
                text: 'A Antiga Estação Férrea de Santa Cruz do Sul é como uma pista arqueológica viva: ainda podemos observar e imaginar como as pessoas viajavam, trabalhavam e se comunicavam há décadas. Esse espaço é fundamental para a Arqueologia Histórica, pois preserva vestígios do cotidiano da cidade, mostrando como o trem transformou a vida das pessoas e impulsionou o crescimento da região.'
            };
        case 6:
            return {
                img: 'image-flechas.png',
                nome: 'Pontas de Flechas',
                desc: 'Artefatos arquelógicos. Arqueologia Pré-histórica.',
                text: 'As pontas de flechas encontradas em Santa Cruz do Sul são provas de como os grupos indígenas caçavam, se defendiam e organizavam sua vida. É como se o solo da cidade guardasse segredos de quem passou por aqui muito antes de nós, e cada descoberta ajuda a revelar capítulos esquecidos da nossa história. Preservar essas pontas de flechas é garantir que essa memória continue viva para as futuras gerações.'
            };
        case 8:
            return {
                img: 'image-casa-artes.png',
                nome: 'Casa de Artes Regina Simonis',
                desc: 'Monumento tombado. Arquelogia Histórica.',
                text: 'Imagine um baú do tesouro repleto de histórias: é exatamente isso que a Casa das Artes Regina Simonis representa para Santa Cruz do Sul! Assim como arqueólogos desenterram vestígios do passado para compreendê-lo, a Casa preserva e exibe memórias da cidade — desde sua arquitetura única até obras de arte e exposições. É como uma verdadeira “máquina do tempo cultural”, permitindo que todos viajem pelo passado, conheçam suas raízes e aprendam a valorizar e proteger nossa história para o futuro.'
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
randomizeChests();
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

function resetMap() {
    for (let r = 0; r < mapData.length; r++) {
        for (let c = 0; c < mapData[r].length; c++) {
            mapData[r][c] = originalMap[r][c];
        }
    }
}

function restartGame() {
    chestsOpenedWithItem = 0;
    player = { row: 5, col: 8 };
    resetMap();
    randomizeChests();
    buildMap();
}