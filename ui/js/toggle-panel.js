const panelViewTriggers = document.querySelectorAll('.panels-bar__item');
const panels = document.querySelectorAll('.panel');

const setActivePanel = (panelViewTrigger, panelPos) => {
  panelViewTrigger.addEventListener('click', () => {
    panelViewTriggers.forEach(panelViewTriggerElem => {
      panelViewTriggerElem.classList.remove('active-panel-tab');
    }); 
    panelViewTrigger.classList.add('active-panel-tab');

    panels.forEach(panelElem => panelElem.classList.add('panel--hidden'));
    panels[panelPos].classList.remove('panel--hidden');
  });
};

for (let i = 0; i < panelViewTriggers.length; i++) {
  const panelViewTrigger = panelViewTriggers[i];
  setActivePanel(panelViewTrigger, i);
}
