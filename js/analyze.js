// https://lorcana-api.com/docs/cards/parameters/strict-parameter
// https://lorcast.com/docs/api/cards
const apis = {
    'lorcana-api': {
        'url': 'https://api.lorcana-api.com/cards/fetch',
        'parameter': 'strict',
        'body': null
    },
    'lorcast': {
        'url': 'https://api.lorcast.com/v0/cards/search',
        'parameter': 'q',
        'body': 'results'
    }
}
let apiToUse = 'lorcana-api';

async function analyzeDeck() {
    showLoading();
    hideTabs();
    await processTextData();
    hideLoading();
    showTabs();
}

async function processTextData() {
    localStorage.clear();
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
    
    for (const [cardName, count] of Object.entries(cardCounts)) {
        details = await fetchCardDetails(cardName);
        const card = details ? new Card(details) : undefined;
        cardsWithInfo[cardName] = card;
    }
    
    localStorage.setItem('text', text);
    localStorage.setItem('cardCounts', JSON.stringify(cardCounts));
    localStorage.setItem('totalCards', totalCards);
    localStorage.setItem('cardsWithInfo', JSON.stringify(cardsWithInfo));
}

async function fetchCardDetails(cardName) {
    try {
        const response = await fetch(`${apis[apiToUse]['url']}?${apis[apiToUse]['parameter']}=${encodeURIComponent(cardName)}`);
        const data = await response.json();
        return apis[apiToUse]['body'] ? data[apis[apiToUse]['body']][0] : data[0];
    } catch (error) {
        console.error(`Error fetching details for ${cardName}:`, error);
        return null;
    }
}

function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function hideTabs() {
    document.getElementById('analyze').style.display = 'none';
    document.getElementById('tabs').style.display = 'none';
    let activeTab = document.getElementsByClassName('tab-content-active');
    if (activeTab.length > 0) {
        activeTab[0].classList.remove('tab-content-active');
    }
}

function showTabs() {
    document.getElementById('analyze').style.display = 'block';
    document.getElementById('tabs').style.display = 'flex';
    showTab('content1', 'tab1');

    calculateProbabilities(7);
    updateCompanionTable();
    seeDeckInfo();
}

class Card {
    constructor(json) {
        const parsedJson = this.parseJson(json);
        this.type = parsedJson['type'];
        this.cost = parsedJson['cost'];
        this.inkable = parsedJson['inkable'];
        this.text = parsedJson['text'];
    }

    parseJson(json) {
        switch (apiToUse) {
            case 'lorcana-api':
                return {'type': json.Type, 'cost': json.Cost, 'inkable': json.Inkable, 'text': json.Body_Text}
            case 'lorcast':
                return {'type': json.type, 'cost': json.cost, 'inkable': json.inkwell, 'text': json.text}
        }
    }
}