document.getElementById('tab1').addEventListener('click', function() {
    showTab('content1', 'tab1');
});

document.getElementById('tab2').addEventListener('click', function() {
    showTab('content2', 'tab2');
});

document.getElementById('processText1').addEventListener('click', function() {
    processTextData();
    calculateProbabilities(7);
});

document.getElementById('processText2').addEventListener('click', function() {
    processTextData();
    calculateProbabilities(8);
});

document.getElementById('processText3').addEventListener('click', function() {
    processTextData();
    updateCompanionTable();
});

document.getElementById('showRemainingCards').addEventListener('click', function() {
    generateRemainingCardsTable();
});

Array.from(document.getElementsByClassName('closeModal')).forEach(function(closeModalButton) {
    closeModalButton.addEventListener('click', function() {
        Array.from(document.getElementsByClassName('modal')).forEach(function(element) {
            element.style.display = 'none';
        });
        document.getElementById('modal-overlay').style.display = 'none';
    });
});

function showTab(contentId, tabId) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('tab-content-active'));

    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('tab-active'));

    document.getElementById(contentId).classList.add('tab-content-active');
    document.getElementById(tabId).classList.add('tab-active');
}

let cardCounts = {};
let totalCards = 0;

function processTextData() {
    if (totalCards > 0) {
        return;
    }
    const text = document.getElementById('cardData').value;
    const rows = text.split('\n');

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
}

function calculateProbabilities(drawsFirstTurn) {
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

    probabilities.sort((a, b) => {
        if (b.probability === a.probability) {
            return Math.random() - 0.5;
        }
        return b.probability - a.probability;
    });

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
        document.getElementById('modal-probs').style.display = 'block';
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

function updateCompanionTable(drawnCards) {
    const companionBody = document.getElementById('companionBody');
    companionBody.innerHTML = '';

    if (!drawnCards) {
        drawnCards = countDrawnCards();
    }
    
    const sortedCards = Object.keys(cardCounts).sort();
    sortedCards.forEach(card => {
        const row = document.createElement('tr');
        const cardCell = document.createElement('td');
        const totalCell = document.createElement('td');
        const inPlayCell = document.createElement('td');
        const nextTurnProbabilityCell = document.createElement('td');
        
        const total = cardCounts[card];
        const inPlay = drawnCards[card] || 0;
        const remainingCount = total - inPlay;
        const nextTurnProbability = (remainingCount / (totalCards - Object.values(drawnCards).reduce((a, b) => a + b, 0))) * 100;
          
        cardCell.innerText = card;
        totalCell.innerText = total;

        const selectInput = document.createElement('select');
        selectInput.setAttribute('data-card', card);
        selectInput.addEventListener('change', function() {
            updateCompanionTable(countDrawnCards());
        });

        for (let i = 0; i <= total; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.innerText = i;
            selectInput.appendChild(option);
        }
        selectInput.value = inPlay;
        
        nextTurnProbabilityCell.innerText = nextTurnProbability.toFixed(2) + '%';
        
        row.appendChild(cardCell);
        row.appendChild(totalCell);
        inPlayCell.appendChild(selectInput);
        row.appendChild(inPlayCell);
        row.appendChild(nextTurnProbabilityCell);
        companionBody.appendChild(row);
    });
}

function countDrawnCards() {
    const selects = document.querySelectorAll('#companionBody select');
    const drawnCards = {};
    
    selects.forEach(select => {
        const cardName = select.getAttribute('data-card');
        const count = parseInt(select.value, 10) || 0;
        drawnCards[cardName] = count;
    });
    
    return drawnCards;
}

function generateRemainingCardsTable() {
    const drawnCards = countDrawnCards();
    const remainingCards = {};
    for (const [card, count] of Object.entries(cardCounts)) {
        const remainingCount = count - (drawnCards[card] || 0);
        if (remainingCount > 0) {
            const probability = (remainingCount / (totalCards - Object.values(drawnCards).reduce((a, b) => a + b, 0))) * 100;
            remainingCards[card] = probability.toFixed(2);
        }
    }

    const sortedCards = Object.keys(remainingCards).sort((a, b) => remainingCards[b] - remainingCards[a]);

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = '';

    sortedCards.forEach(card => {
        const row = document.createElement('tr');
        const cardCell = document.createElement('td');
        const probabilityCell = document.createElement('td');

        cardCell.innerText = card;
        probabilityCell.innerText = remainingCards[card] + '%';

        row.appendChild(cardCell);
        row.appendChild(probabilityCell);
        modalBody.appendChild(row);
    });

    document.getElementById('modal-companion').style.display = 'block';
    document.getElementById('modal-overlay').style.display = 'block';
}
