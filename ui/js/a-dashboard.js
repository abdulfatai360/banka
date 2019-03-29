const acctTypeTabs = document.querySelectorAll('.acct-type-bar__item');
const acctTypeSections = document.querySelectorAll('.users-accts__inner > section');

function setCurrentAcctType(acctTypeTab, index) {
  acctTypeTab.addEventListener('click', () => {
    acctTypeTabs.forEach(tabElem => tabElem.classList.remove('active-tab'));

    acctTypeTab.classList.add('active-tab');

    acctTypeSections.forEach(sectionElem => {
      sectionElem.classList.remove('visible-acct-type-section');
    });

    acctTypeSections[index].classList.add('visible-acct-type-section');
  });
}

for (let i = 0; i < acctTypeTabs.length; i++) {
  const tab = acctTypeTabs[i];
  setCurrentAcctType(tab, i);
}
