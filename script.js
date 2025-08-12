const gameContainer = document.getElementById('game');

// Criar personagem
/*const character = document.createElement('div');
character.classList.add('character');
character.style.left = "50px";
character.style.top = "50px";
gameContainer.appendChild(character);*/

// Criar elemento de mensagem
const messageBox = document.createElement('div');
messageBox.classList.add('message');
gameContainer.appendChild(messageBox);

// Lista de segmentos do caminho (x, y, largura, altura)
// Caminho ligando os pontos, retângulos amarelos semi-transparentes
const pathSegments = [
    { x: 507, y: 315, width: 25, height: 420 },
    { x: 196, y: 710, width: 25, height: 140 },
    { x: 285, y: 840, width: 25, height: 90 },
    { x: 374, y: 591, width: 25, height: 93 },
    { x: 374, y: 840, width: 25, height: 90 },
    { x: 641, y: 865, width: 25, height: 65 },
    { x: 685, y: 394, width: 25, height: 65 },

    { x: 282, y: 434, width: 235, height: 25 },
    { x: 374, y: 670, width: 150, height: 25 },
    { x: 196, y: 840, width: 200, height: 25 },
    { x: 375, y: 915, width: 290, height: 25 },
];

// Lista de pontos (x, y, tipo e mensagem)
const points = [
    { x: 506, y: 280, type: 'red', message: '⚠️ Não há nada aqui!' },
    { x: 239, y: 438, type: 'red', message: '⚠️ Não há nada aqui!' },
    { x: 684, y: 359, type: 'green', message: '🎉 Você encontrou o tesouro!' },
    { x: 862, y: 319, type: 'red', message: '⚠️ Não há nada aqui!' },
    { x: 373, y: 556, type: 'red', message: '⚠️ Não há nada aqui!' },
    { x: 195, y: 675, type: 'red', message: '⚠️ Não há nada aqui!' },
    { x: 729, y: 635, type: 'red', message: '⚠️ Não há nada aqui!' },
    { x: 951, y: 596, type: 'green', message: '🎉 Você encontrou o tesouro!' },
    { x: 640, y: 833, type: 'red', message: '⚠️ Não há nada aqui!' },
    { x: 986, y: 833, type: 'green', message: '🎉 Você encontrou o tesouro!' },
    { x: 284, y: 951, type: 'red', message: '⚠️ Não há nada aqui!' },
    { x: 818, y: 991, type: 'red', message: '⚠️ Não há nada aqui!' },
];

// Criar segmentos no mapa
pathSegments.forEach(seg => {
    const pathEl = document.createElement('div');
    pathEl.classList.add('path');
    pathEl.style.left = seg.x + 'px';
    pathEl.style.top = seg.y + 'px';
    pathEl.style.width = seg.width + 'px';
    pathEl.style.height = seg.height + 'px';
    gameContainer.appendChild(pathEl);
});

// Criar pontos visíveis
points.forEach(point => {
    const pointElement = document.createElement('div');
    pointElement.classList.add('point');
    pointElement.style.left = `${point.x - 16}px`;  // 16 para centralizar (32/2)
    pointElement.style.top = `${point.y - 16}px`;
    gameContainer.appendChild(pointElement);
});

// Posição inicial do personagem
let position = { x: 50, y: 50 };

// Movimentação
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') position.y = Math.max(0, position.y - 10);
    if (event.key === 'ArrowDown') position.y = Math.min(600 - 48, position.y + 10);
    if (event.key === 'ArrowLeft') position.x = Math.max(0, position.x - 10);
    if (event.key === 'ArrowRight') position.x = Math.min(800 - 48, position.x + 10);

    character.style.left = `${position.x}px`;
    character.style.top = `${position.y}px`;

    if (event.code === 'Space') {
        checkInteraction();
    }
});

// Função para verificar interação
function checkInteraction() {
    const foundPoint = points.find(point => {
        const dx = Math.abs(position.x - point.x);
        const dy = Math.abs(position.y - point.y);
        return dx < 20 && dy < 20;
    });

    if (foundPoint) {
        showMessage(foundPoint.message);
    } else {
        showMessage("🤷‍♂️ Aqui não tem nada!");
    }
}

// Mostrar mensagem
function showMessage(text) {
    messageBox.textContent = text;
    messageBox.style.display = "block";
    setTimeout(() => {
        messageBox.style.display = "none";
    }, 2000);
}