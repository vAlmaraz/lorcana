document.getElementById('analyze').addEventListener('click', function() {
    analyzeDeck();
});

document.getElementById('reset').addEventListener('click', function() {
    localStorage.clear();
    window.location.reload();
});

document.getElementById('tab1').addEventListener('click', function() {
    showTab('content1', 'tab1');
});

document.getElementById('tab2').addEventListener('click', function() {
    showTab('content2', 'tab2');
});

document.getElementById('tab3').addEventListener('click', function() {
    showTab('content3', 'tab3');
});

document.getElementById('probabilitiesStartFirst').addEventListener('click', function() {
    calculateProbabilities(7);
});

document.getElementById('probabilitiesStartSecond').addEventListener('click', function() {
    calculateProbabilities(8);
});

document.getElementById('companionDrawSeven').addEventListener('click', function() {
    selectTopCards(7);
});

document.getElementById('companionRemainingCards').addEventListener('click', function() {
    generateRemainingCardsTable();
});

document.getElementById('deckInfoCalculate').addEventListener('click', function() {
    calculateGoalPercentages();
});

Array.from(document.getElementsByClassName('closeModal')).forEach(function(closeModalButton) {
    closeModalButton.addEventListener('click', function() {
        closeModal();
    });
});

document.getElementById('modal-overlay').addEventListener('click', function() {
    closeModal();
});

function showTab(contentId, tabId) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('tab-content-active'));

    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('tab-active'));

    document.getElementById(contentId).classList.add('tab-content-active');
    document.getElementById(tabId).classList.add('tab-active');
}

function closeModal() {
    Array.from(document.getElementsByClassName('modal')).forEach(function(element) {
        element.style.display = 'none';
    });
    document.getElementById('modal-overlay').style.display = 'none';
}
