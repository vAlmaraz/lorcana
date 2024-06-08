document.getElementById('processText1').addEventListener('click', function() {
    const text = document.getElementById('cardData').value;
    processTextData(text, 7);
});

document.getElementById('processText2').addEventListener('click', function() {
    const text = document.getElementById('cardData').value;
    processTextData(text, 8);
});

document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('modal-overlay').style.display = 'none';
});

function processTextData(text, drawsFirstTurn) {
    const rows = text.split('\n');
    const cardCounts = {};
    let totalCards = 0;

    rows.forEach(row => {
        if (row.trim()) {
            const [count, ...cardNameParts] = row.trim().split(' ');
            const card = cardNameParts.join(' ');
            const countNum = parseInt(count, 10);

            if (!isNaN(countNum)) {
                cardCounts[card] = (cardCounts[card] || 0) + countNum;
                totalCards += countNum;
            }
        }
    });

    calculateProbabilities(cardCounts, totalCards, drawsFirstTurn);
}

function calculateProbabilities(cardCounts, totalCards, drawsFirstTurn) {
    const resultsBody = document.getElementById('resultsBody');
    resultsBody.innerHTML = '';

    let drawnCards = {};
    let remainingCards = totalCards;
    for (let turn = 1; remainingCards > 0; turn++) {
        let drawsThisTurn = turn == 1 ? drawsFirstTurn : 1;
        const result = calculateMostProbable(cardCounts, totalCards, drawnCards, drawsThisTurn);
        appendResult(resultsBody, turn, result.cards, result.probabilities, cardCounts, totalCards, drawnCards);
        drawnCards = updateDrawnCards(drawnCards, result.cards);
        remainingCards -= drawsThisTurn;
    }
}

function calculateMostProbable(cardCounts, totalCards, drawnCards, draws) {
    const probabilities = [];

    for (const [card, count] of Object.entries(cardCounts)) {
        const remainingCount = count - (drawnCards[card] || 0);
        if (remainingCount > 0) {
            const probability = 1 - binomialProbability(remainingCount, totalCards - Object.values(drawnCards).reduce((a, b) => a + b, 0), draws);
            probabilities.push({ card, probability });
        }
    }

    probabilities.sort((a, b) => b.probability - a.probability);

    const mostProbableCards = probabilities.slice(0, draws).map(p => p.card);
    const mostProbableProbabilities = probabilities.slice(0, draws).map(p => p.probability.toFixed(4));

    return { cards: mostProbableCards, probabilities: mostProbableProbabilities };
}

function binomialProbability(successes, trials, draws) {
    let probability = 1;
    for (let i = 0; i < draws; i++) {
        probability *= (trials - successes - i) / (trials - i);
    }
    return probability;
}

function appendResult(container, turn, cards, probabilities, cardCounts, totalCards, drawnCards) {
    const row = document.createElement('tr');
    const turnCell = document.createElement('td');
    const cardsCell = document.createElement('td');
    const probabilityCell = document.createElement('td');
    const detailsButton = document.createElement('button');
    detailsButton.classList.add('showModal');
    detailsButton.setAttribute('data-turn', 'turn-' + turn);
    detailsButton.addEventListener('click', function() {
        document.getElementById('modal').style.display = 'block';
        document.getElementById('modal-overlay').style.display = 'block';
        document.getElementById('detailedBody').innerHTML = document.getElementById(this.getAttribute('data-turn')).innerHTML;
    });
    const detailsHiddenTableBody = document.createElement('tbody');
    detailsHiddenTableBody.id = 'turn-' + turn;
    detailsHiddenTableBody.style.display = 'none';

    turnCell.textContent = turn;
    cardsCell.innerHTML = cards.join('<br>');
    detailsButton.textContent = 'Ver detalles';
    prepareModalInfo(turn, cardCounts, totalCards, drawnCards, detailsHiddenTableBody);

    probabilityCell.appendChild(detailsButton);
    probabilityCell.appendChild(detailsHiddenTableBody);
    row.appendChild(turnCell);
    row.appendChild(cardsCell);
    row.appendChild(probabilityCell);
    container.appendChild(row);
}

function prepareModalInfo(turn, cardCounts, totalCards, drawnCards, detailsHiddenTableBody) {
    const remainingCards = totalCards - Object.values(drawnCards).reduce((a, b) => a + b, 0);
    const probabilitiesDetailed = [];

    for (const [card, count] of Object.entries(cardCounts)) {
        const remainingCount = count - (drawnCards[card] || 0);
        if (remainingCount > 0) {
            const probability = 1 - binomialProbability(remainingCount, remainingCards, 1);
            probabilitiesDetailed.push({ card, probability });
        }
    }

    probabilitiesDetailed.sort((a, b) => b.probability - a.probability);

    probabilitiesDetailed.forEach(({ card, probability }) => {
        const row = document.createElement('tr');
        const cardCell = document.createElement('td');
        const probCell = document.createElement('td');

        cardCell.textContent = card;
        probCell.textContent = (probability * 100).toFixed(2) + '%';

        row.appendChild(cardCell);
        row.appendChild(probCell);
        detailsHiddenTableBody.appendChild(row);
    });
}

function updateDrawnCards(drawnCards, cards) {
    cards.forEach(card => {
        drawnCards[card] = (drawnCards[card] || 0) + 1;
    });
    return drawnCards;
}
