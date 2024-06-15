const goals = {
    0: 'Selecciona uno',
    1: 'Rampear',
    2: 'Robar',
    3: 'Dañar',
    4: 'Curar',
    5: 'Recuperar de descarte',
    6: 'Lorear',
    7: 'Proteger',
    999: 'Mi propia estrategia'
};

function seeDeckInfo() {
    const deckInfoBody = document.getElementById('deckInfoBody');

    deckInfoBody.innerHTML = '';
    for (const [cardName, count] of Object.entries(cardCounts)) {
        const card = cardsWithInfo[cardName];
        const row = document.createElement('tr');
        const countCell = document.createElement('td');
        const nameCell = document.createElement('td');
        const typeCell = document.createElement('td');
        const costCell = document.createElement('td');
        const inkableCell = document.createElement('td');
        const textCell = document.createElement('td');
        const goal1Cell = document.createElement('td');
        
        countCell.innerText = count;
        nameCell.innerText = cardName;
        typeCell.innerText = card ? card.type : '-';
        costCell.innerText = card ? card.cost : '-';
        inkableCell.innerText = card ? (card.inkable === 'true' ? 'Si' : 'No') : '-';
        const button = document.createElement('button');
        button.textContent = 'Leer';
        button.setAttribute('data-text', card ? card.text : '-');
        button.addEventListener('click', function() {
            document.getElementById('modalDeckInfoText').style.display = 'block';
            document.getElementById('modal-overlay').style.display = 'block';
            document.getElementById('modalDeckInfoParagraph').innerText = this.getAttribute('data-text');
        });
        textCell.appendChild(button);
        
        const selectInput = document.createElement('select');
        selectInput.classList.add('deckInfoSelect');
        selectInput.setAttribute('data-card', cardName);
        for (const [goalKey, goalText] of Object.entries(goals)) {
            const option = document.createElement('option');
            option.value = goalKey;
            option.innerText = goalText;
            option.selected = goalSelects && goalSelects[cardName] == goalKey;
            selectInput.appendChild(option);
        }
        
        row.appendChild(countCell);
        row.appendChild(nameCell);
        row.appendChild(typeCell);
        row.appendChild(costCell);
        row.appendChild(inkableCell);
        row.appendChild(textCell);
        goal1Cell.appendChild(selectInput);
        row.appendChild(goal1Cell);
        deckInfoBody.appendChild(row);
    }
}

function calculateGoalPercentages() {
    const goalCounts = Object.keys(goals).reduce((acc, key) => ({ ...acc, [key]: 0 }), {});

    const goalSelects = {};
    const selects = document.querySelectorAll('.deckInfoSelect');
    selects.forEach(select => {
        const cardName = select.getAttribute('data-card');
        const selectedValue = select.value;
        goalSelects[cardName] = selectedValue;
    });
    localStorage.setItem('goalSelects', JSON.stringify(goalSelects));

    for (const [cardName, count] of Object.entries(cardCounts)) {
        goalCounts[goalSelects[cardName]] += count;
    }

    const goalPercentages = {};
    for (const [goal, count] of Object.entries(goalCounts)) {
        goalPercentages[goal] = (count / totalCards) * 100;
    }
    
    const tableBody = document.getElementById('modalDeckInfoGoalsTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    Object.keys(goalPercentages).forEach(key => {
        const row = document.createElement('tr');
        const goalCell = document.createElement('td');
        const percentageCell = document.createElement('td');

        goalCell.textContent = goals[key];
        percentageCell.textContent = goalPercentages[key].toFixed(2) + '%';

        row.appendChild(goalCell);
        row.appendChild(percentageCell);
        tableBody.appendChild(row);
    });

    document.getElementById('modalDeckInfoGoals').style.display = 'block';
    document.getElementById('modal-overlay').style.display = 'block';
}
