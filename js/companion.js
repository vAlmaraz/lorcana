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

function selectTopCards(cardsToDraw) {
    updateCompanionTable();
    const drawnCards = {};
    const sortedCards = Object.keys(cardCounts).sort((a, b) => {
        const probabilityA = (cardCounts[a] / totalCards) * 100;
        const probabilityB = (cardCounts[b] / totalCards) * 100;
        return probabilityB - probabilityA;
    });

    for (let i = 0; i < Math.min(cardsToDraw, sortedCards.length); i++) {
        const card = sortedCards[i];
        const remainingCount = cardCounts[card] - (drawnCards[card] || 0);
        const probability = (remainingCount / (totalCards - Object.values(drawnCards).reduce((a, b) => a + b, 0))) * 100;

        const cardsWithSameProbability = sortedCards.filter(c => {
            const remainingCount = cardCounts[c] - (drawnCards[c] || 0);
            const p = (remainingCount / (totalCards - Object.values(drawnCards).reduce((a, b) => a + b, 0))) * 100;
            return p.toFixed(2) === probability.toFixed(2);
        });
        const randomCard = cardsWithSameProbability[Math.floor(Math.random() * cardsWithSameProbability.length)];

        drawnCards[randomCard] = (drawnCards[randomCard] || 0) + 1;
    }

    const selectInputs = document.querySelectorAll('#companionBody select');
    selectInputs.forEach(select => {
        const cardName = select.closest('tr').querySelector('td:first-child').innerText;
        if (drawnCards[cardName] !== undefined) {
            select.value = drawnCards[cardName];
        } else {
            select.value = 0;
        }
    });
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

    document.getElementById('modalCompanion').style.display = 'block';
    document.getElementById('modal-overlay').style.display = 'block';
}
