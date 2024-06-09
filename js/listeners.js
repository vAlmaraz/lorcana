document.getElementById('tab1').addEventListener('click', function() {
    showTab('content1', 'tab1');
});

document.getElementById('tab2').addEventListener('click', function() {
    showTab('content2', 'tab2');
});

document.getElementById('probabilitiesStartFirst').addEventListener('click', function() {
    processTextData();
    calculateProbabilities(7);
});

document.getElementById('probabilitiesStartSecond').addEventListener('click', function() {
    processTextData();
    calculateProbabilities(8);
});

document.getElementById('companionInitialize').addEventListener('click', function() {
    processTextData();
    updateCompanionTable();
});

document.getElementById('companionDrawSeven').addEventListener('click', function() {
    processTextData();
    selectTopCards(7);
});

document.getElementById('companionRemainingCards').addEventListener('click', function() {
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
