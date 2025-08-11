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
    { x: 155, y: 95, width: 160, height: 25 }, //h
    { x: 290, y: 95, width: 25, height: 140 }, //v
    { x: 235, y: 215, width: 80, height: 25 },
    { x: 400, y: 80, width: 25, height: 95 },
    { x: 290, y: 150, width: 130, height: 25 },
    { x: 350, y: 150, width: 25, height: 265 },
    { x: 250, y: 390, width: 120, height: 25 },
];

// Lista de pontos (x, y, tipo e mensagem)
const points = [
    { x: 100, y: 100, type: 'green', message: '🎉 Você encontrou o tesouro!' },
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