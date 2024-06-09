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
