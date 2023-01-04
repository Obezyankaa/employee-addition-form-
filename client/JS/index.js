import { DataService } from './dataService.js';
import { Utils } from './utils.js';

const dataService = new DataService();
const utils = new Utils();

function firstLetter(str) {
  if (str == '') return str;
  let strOne = str.toLowerCase().trim();
  let strTwo = strOne[0].toUpperCase() + strOne.slice(1);
  return strTwo;
}

const tableBtnAdd = document.querySelector('.table-btn-add');
const overlay = document.getElementById('overlay-modal');
const closeButtons = document.querySelectorAll('.close');
const newClient = document.querySelector('.newclient');
const saveClient = document.querySelector('.save-client');
let pagePosition = window.scrollY;

function openModal() {
  overlay.classList.add('active');
  document.body.classList.add('disable-scroll');
  document.body.dataset.position = pagePosition;
  document.body.style.top = -pagePosition + 'px';
  const rows = tableBody.querySelectorAll('tr');
  const newRows = Array.from(rows);
  newRows.forEach((row) => {
    row.classList.remove('sublight');
  });
}

function closeModal() {
  newClient.classList.remove('active');
  deleteclientModal.classList.remove('active');
  overlay.classList.remove('active');
  changeId.classList.remove('active');
  document.body.classList.remove('disable-scroll');
  clientBtnCancel.forEach((btnCancel) => {
    btnCancel.classList.remove('active');
  });
  newclientBtnDelete.classList.remove('active');
  newclientBtnSave.classList.remove('active');
  chacgeclientBtnSave.classList.remove('active');
  saveClient.textContent = '';
  saveClient.classList.remove('overflow');
  newCheckQuantity.classList.remove('active');
  newCheckQuantity.textContent = '';
  cardId.classList.remove('active');
  newClientBtnAdd.forEach((btnAdd) => {
    btnAdd.classList.remove('active');
  });
  inputWrapperName.classList.remove('active');
  inputWrapperSurname.classList.remove('active');
  errorsModal.classList.remove('active');
  errorsNumber.textContent = '';
  errorsHeader.textContent = '';
  location.hash = '';
  clearInput();
}

closeButtons.forEach((closeBtn) => {
  closeBtn.addEventListener('click', (e) => {
    closeModal();
  });
});

window.addEventListener('click', (e) => {
  if (e.target == overlay) {
    closeModal();
  }
});

function clearInput() {
  for (let i = 0; i < newclientInput.length; i++) {
    newclientInput[i].value = '';
  }
}

const errorsModal = document.querySelector('.errors');
const errorsHeader = document.querySelector('.errors-body');
const errorsNumber = document.querySelector('.errors-number');

function errors404() {
  errorsModal.classList.add('active');
  errorsNumber.textContent = 'Ошибка 404';
  errorsHeader.textContent =
    'Переданный в запросе метод не существует или запрашиваемый элемент не найден в базе данных';
}

function errors500() {
  errorsModal.classList.add('active');
  errorsNumber.textContent = 'Ошибка 500';
  errorsHeader.textContent = 'Cтранно, но сервер сломался :(';
}

function addFindErrors(data) {
  data.then((response) => {
    const { data, status } = response;
    switch (status) {
      case 200:
      case 201:
        makeTable();
        break;
      case 404:
        errors404();
        break;
      case 500:
        errors500();
        break;
      case 422:
        for (let error of data.errors) {
          if (error.field == 'surname') {
            inputWrapperSurname.classList.add('active');
            newCheckQuantity.classList.add('active');
            newCheckQuantity.innerHTML += ` <br>${error.message}  `;
          }
          if (error.field == 'name') {
            inputWrapperName.classList.add('active');
            newCheckQuantity.classList.add('active');
            newCheckQuantity.textContent += `${error.message}  `;
          }
        }
        break;
      default:
        return;
    }
  });
  if (newclientName.value !== '' && newclientSurname.value !== '') {
    closeModal();
  }
}
function deleteFindErrors(data) {
  data.then((response) => {
    const { status } = response;
    switch (status) {
      case 200:
      case 201:
        makeTable();
        closeModal();
        break;
      case 404:
        errors404();
        makeTable();
        break;
      case 500:
        errors500();
        makeTable();
        break;
      default:
        return;
    }
  });
}
const newclientSurname = document.querySelector('.newclient-surname');
const newclientName = document.querySelector('.newclient-name');
const newclientlastName = document.querySelector('.newclient-lastname');
const clientBtnCancel = document.querySelectorAll('.client-btn-cancel');
const newclientBtnDelete = document.querySelector('.newclient-btn-delete');
const newclientForm = document.querySelector('.newclient-form');
const newclientInput = newclientForm.getElementsByClassName('newclient-input');
const newclientBtnSave = document.querySelector('.newclient-btn-save');
const chacgeclientBtnSave = document.querySelector('.chacgeclient-btn-save');
const newclientHeader = document.querySelector('.newclient-header');
const changeId = document.querySelector('.change-id');
const cardId = document.querySelector('.card-id');

function contactsCard(contact) {
  const wrapperContactsCard = document.createElement('div');
  wrapperContactsCard.classList.add('wrapper-contacts-card');
  const contactsCardLeft = document.createElement('div');
  contactsCardLeft.classList.add('contacts-card-left');
  const contactsCardRight = document.createElement('div');
  contactsCardRight.classList.add('contacts-card-right');
  saveClient.append(wrapperContactsCard);
  wrapperContactsCard.append(contactsCardLeft, contactsCardRight);
  if (contact) {
    contactsCardLeft.textContent = contact.type;
    contactsCardRight.textContent = contact.value;
  }
  return saveClient;
}
tableBtnAdd.addEventListener('click', (e) => {
  openModal();
  newClient.classList.add('active');
  newclientBtnSave.classList.add('active');
  newCheckQuantity.classList.remove('active');
  clientBtnCancel.forEach((btnCancel) => {
    btnCancel.classList.add('active');
    btnCancel.addEventListener('click', () => {
      closeModal();
    });
  });
  newclientHeader.textContent = 'Новый клиент';
});

const newClientBtnAdd = document.querySelectorAll('.newclient-btn-add-wrapper');
const newCheckQuantity = document.querySelector('.new-check-quantity');

newClientBtnAdd.forEach((btnAdd) => {
  btnAdd.addEventListener('click', (e) => {
    e.preventDefault();
    const contactsCount = utils.getContactsCount(saveClient);
    if (contactsCount > 4) {
      saveClient.classList.add('overflow');
    }
    if (contactsCount < 10) {
      const result = utils.createContact({
        type: 'Телефон',
        code: '',
        title: '',
        value: '',
      });
      saveClient.prepend(result.contactWrapper);
    } else {
      newCheckQuantity.classList.add('active');
      newCheckQuantity.textContent = 'Можно добавить только 10 контактов!';
    }
  });
});
const inputWrapperSurname = document.querySelector('.input-wrapper-surname');
const inputWrapperName = document.querySelector('.input-wrapper-name');
const inputWrapperLastname = document.querySelector('.input-wrapper-lastname');

newclientBtnSave.addEventListener('click', async (e) => {
  e.preventDefault();
  inputWrapperName.classList.remove('active');
  inputWrapperSurname.classList.remove('active');
  newCheckQuantity.classList.remove('active');
  const contacts = utils.getContacts(saveClient);
  const notEmptyContacts = contacts.filter((contact) => contact.value !== '');
  newCheckQuantity.textContent = '';
  addFindErrors(
    dataService.createClient(
      firstLetter(newclientName.value),
      firstLetter(newclientSurname.value),
      firstLetter(newclientlastName.value),
      notEmptyContacts
    )
  );
});

const deleteclientModal = document.querySelector('.deleteclient-modal');
const deleteclientBtn = document.querySelector('.deleteclient-btn');
const table = document.getElementById('sortable');
const tableBody = table.querySelector('tbody');
const headers = table.querySelectorAll('th');

function deleteClientModal(id) {
  openModal();
  deleteclientModal.classList.add('active');
  clientBtnCancel.forEach((btnCancel) => {
    btnCancel.classList.add('active');
    btnCancel.addEventListener('click', (e) => {
      closeModal();
    });
  });
  const handleDelete = () => {
    deleteFindErrors(dataService.deleteClient(id));
    deleteclientBtn.removeEventListener('click', handleDelete);
  };
  deleteclientBtn.addEventListener('click', handleDelete);
}

async function changeClientModal(id) {
  openModal();
  newClient.classList.add('active');
  newclientHeader.textContent = 'Изменить данные';
  changeId.classList.add('active');
  chacgeclientBtnSave.classList.add('active');
  newclientBtnDelete.classList.add('active');
  newclientBtnDelete.addEventListener('click', () => {
    deleteFindErrors(dataService.deleteClient(id));
  });
  await dataService.searchClientsId(id).then((response) => {
    const { data, status } = response;
    switch (status) {
      case 200:
      case 201:
        changeClientData(data.contacts);
        if (data.contacts.length > 4) {
          saveClient.classList.add('overflow');
        }
        changeId.textContent = `ID: ${data.id}`;
        changeId.setAttribute('data-id', data.id);
        newclientSurname.value = data.surname;
        newclientName.value = data.name;
        newclientlastName.value = data.lastName;
        break;
      case 404:
        errors404();
        makeTable();
        break;
      case 500:
        errors500();
        makeTable();
        break;
      default:
        return;
    }
  });
}

function changeClientData(clientContacts) {
  saveClient.textContent = '';
  if (clientContacts) {
    for (const clientContact of clientContacts) {
      const result = utils.createContact(clientContact);
      saveClient.append(result.contactWrapper);
    }
  } else {
    networkErrorHandler();
    closeModal();
    makeTable();
  }
}
async function cardClient(id) {
  openModal();
  newClient.classList.add('active');
  newclientHeader.textContent = 'Карточка клиента';
  cardId.classList.add('active');
  newClientBtnAdd.forEach((btnAdd) => {
    btnAdd.classList.add('active');
  });
  await dataService.searchClientsId(id).then((response) => {
    const { data, status } = response;
    switch (status) {
      case 200:
      case 201:
        for (const contact of data.contacts) {
          contactsCard(contact);
        }
        location.hash = data.id;
        cardId.textContent = `ID: ${data.id}`;
        cardId.setAttribute('data-id', data.id);
        newclientSurname.value = data.surname;
        newclientName.value = data.name;
        inputWrapperLastname.classList.remove('active');
        if (data.lastName) {
          newclientlastName.value = data.lastName;
        } else {
          inputWrapperLastname.classList.add('active');
        }
        break;
      case 404:
        errors404();
        makeTable();
        break;
      case 500:
        errors500();
        makeTable();
        break;
      default:
        return;
    }
  });
}
if (location.hash) {
  const id = location.hash.slice(1);
  cardClient(id);
}

chacgeclientBtnSave.addEventListener('click', (e) => {
  e.preventDefault();
  inputWrapperName.classList.remove('active');
  inputWrapperSurname.classList.remove('active');
  let id = changeId.getAttribute('data-id');
  const contacts = utils.getContacts(saveClient);
  const notEmptyContacts = contacts.filter((contact) => contact.value !== '');
  addFindErrors(
    dataService.changeClient(
      id,
      firstLetter(newclientName.value),
      firstLetter(newclientSurname.value),
      firstLetter(newclientlastName.value),
      notEmptyContacts
    )
  );
});

function tableAddImgContact(contacts) {
  const allIcons = document.createElement('div');
  let wrapperсontact = document.createElement('div');
  wrapperсontact.classList = 'contacs';
  allIcons.append(wrapperсontact);
  let i = 0;
  for (const data of contacts) {
    const сontact = document.createElement('div');
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    const innerTooltipContacts = document.createElement('div');
    innerTooltipContacts.classList.add('inner-tooltip-contacts');
    const link = document.createElement('a');
    const tooltipText = document.createElement('div');
    tooltipText.classList.add('tooltip-text');
    tooltipText.textContent = data.type;
    if (data.type == 'Vk')
      link.setAttribute('href', 'https://vk.com/' + data.value);
    if (data.type == 'Телефон') link.setAttribute('href', 'tel:' + data.value);
    if (data.type == 'E-mail')
      link.setAttribute('href', 'mailto:' + data.value);
    if (data.type == 'Facebook')
      link.setAttribute(
        'href',
        'https://www.facebook.com/profile.php?' + data.value
      );
    if (data.type == 'Другое') link.setAttribute('href', data.value);

    link.setAttribute('target', '_blank');
    link.classList.add('tooltip-link');
    tooltip.append(tooltipText, link);
    link.textContent = data.value;
    innerTooltipContacts.append(tooltip, сontact);
    wrapperсontact.append(innerTooltipContacts);
    if (data.type == 'Vk') сontact.classList.add('vk', 'contacts-img');
    if (data.type == 'Телефон') сontact.classList.add('phone', 'contacts-img');
    if (data.type == 'E-mail') сontact.classList.add('mail', 'contacts-img');
    if (data.type == 'Facebook') сontact.classList.add('fb', 'contacts-img');
    if (data.type == 'Другое') сontact.classList.add('other', 'contacts-img');

    сontact.addEventListener('click', () => {
      const isactive = !tooltip.classList.contains('active');
      document
        .querySelectorAll('.inner-tooltip-contacts > .tooltip')
        .forEach((tooltip) => {
          tooltip.classList.remove('active');
        });
      if (isactive) {
        tooltip.classList.add('active');
      }
    });
    window.addEventListener('click', (e) => {
      if (e.target !== сontact) {
        tooltip.classList.remove('active');
      }
    });
    i++;
    if (i == 5 && contacts.length > 5) {
      const btn = document.createElement('div');
      btn.classList.add('othersix', 'contacts-img');
      btn.textContent = `+ ${contacts.length - 5}`;
      wrapperсontact.append(btn);
      wrapperсontact = document.createElement('div');
      wrapperсontact.classList = 'contacs';
      wrapperсontact.style.display = 'none';

      btn.addEventListener('click', () => {
        btn.style.display = 'none';
        wrapperсontact.style.display = '';
      });
    }
    allIcons.append(wrapperсontact);
  }
  return allIcons;
}

function tableAddChangeClient() {
  const divWrapperChange = document.createElement('div');
  const divInside = document.createElement('div');
  const btn = document.createElement('button');
  divWrapperChange.append(divInside, btn);
  divWrapperChange.classList = 'change-wrapper';
  divInside.classList = 'img-change';
  btn.classList = 'btn-change';
  btn.textContent = 'Изменить';
  return divWrapperChange;
}

function tableAddDeleteClient() {
  const divWrapperDelete = document.createElement('div');
  const divInside = document.createElement('div');
  const btn = document.createElement('button');
  divWrapperDelete.append(divInside, btn);
  divWrapperDelete.classList = 'delete-wrapper';
  divInside.classList = 'img-delete';
  btn.classList = 'btn-delete';
  btn.textContent = 'Удалить';
  return divWrapperDelete;
}

function tableRemakeTime(time) {
  const receivedData = new Date(time).toLocaleDateString();
  const receivedTime = new Date(time).toLocaleTimeString();
  const tableData = document.createElement('div');
  const tableTime = document.createElement('div');
  const wrapperTime = document.createElement('div');
  wrapperTime.classList.add('wrapper-time');
  tableTime.classList = 'table-time';
  tableData.classList = 'table-data';
  tableData.textContent = receivedData;
  tableTime.textContent = receivedTime;
  wrapperTime.append(tableData, tableTime);
  return wrapperTime;
}

function tableRemakeId(id) {
  const receivedId = document.createElement('div');
  receivedId.classList = 'table-id-text';
  receivedId.textContent = id;
  return receivedId;
}

async function makeTable() {
  const tableBody = document.querySelector('.table-body');
  if (tableBody.textContent) {
    tableBody.textContent = '';
    tableBtnAdd.classList.add('active');
    const waitDownload = document.createElement('div');
    waitDownload.classList.add('wait');
    tableBody.append(waitDownload);
  }
  setTimeout(() => {
    dataService.fetchClients().then((response) => {
      const { data, status } = response;
      switch (status) {
        case 200:
        case 201:
          renderTable(data);
          break;
        case 404:
          errors404();
          break;
        case 500:
          errors500();
          break;
        default:
          return;
      }
    });
  }, 1000);
}
makeTable();

function renderTable(contacts) {
  const tableBody = document.querySelector('.table-body');
  tableBody.textContent = '';
  tableBtnAdd.classList.remove('active');

  for (let data of contacts) {
    const dataUpdatedAt = new Date(data.updatedAt);
    const dataCreatedAt = new Date(data.createdAt);
    const timeCreat = dataCreatedAt.getTime();
    const timeUpdate = dataUpdatedAt.getTime();

    const fio = `${data.surname} ${data.name}  ${data.lastName}`;
    const td1 = document.createElement('td');
    const td2 = document.createElement('td');
    const td3 = document.createElement('td');
    const td4 = document.createElement('td');
    const td5 = document.createElement('td');
    const td6 = document.createElement('td');
    const td7 = document.createElement('td');
    const divActions = document.createElement('div');

    const text1 = tableRemakeId(data.id);
    const text2 = document.createTextNode(fio);
    const text3 = tableRemakeTime(data.createdAt);
    const text4 = tableRemakeTime(data.updatedAt);
    const text5 = tableAddImgContact(data.contacts);
    const text6 = tableAddChangeClient();
    const text7 = tableAddDeleteClient();

    const tr = document.createElement('tr');

    td1.append(text1);
    td1.setAttribute('data-id', data.id);
    td2.append(text2);
    td3.append(text3);
    td3.setAttribute('data-creat', timeCreat);
    td4.append(text4);
    td4.setAttribute('data-update', timeUpdate);
    td5.append(text5);
    td5.setAttribute('data-contacts', 'contact');
    divActions.append(text6);
    divActions.classList.add('wrapper-btn-table');
    divActions.append(text7);
    td6.append(divActions);
    td2.addEventListener('click', () => {
      cardClient(data.id);
    });
    text6.addEventListener('click', () => {
      changeClientModal(data.id);
    });

    text7.addEventListener('click', () => {
      deleteClientModal(data.id);
    });
    tr.append(td1, td2, td3, td4, td5, td6, td7);
    tr.setAttribute('data-tr', data.id);
    tableBody.append(tr);
    sortId();
  }
}

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    sortColumn(index);
  });
});
const directions = Array.from(headers).map(() => {
  return '';
});
function transform(index, cell) {
  const type = headers[index].getAttribute('data-name');

  if (type === 'time-creat') {
    return cell.getAttribute('data-creat');
  }
  if (type === 'time-update') {
    return cell.getAttribute('data-update');
  }
  if (type === 'id') {
    return cell.getAttribute('data-id');
  }
  if (type === 'contacts') {
    return cell.getAttribute('data-contacts');
  } else {
    return cell.textContent;
  }
}
const thTitle = document.querySelectorAll('.th-title');
thTitle.forEach((title) => {
  title.addEventListener('click', () => {
    title.classList.toggle('active');
  });
});
const thTitleId = document.querySelector('.th-title-id');
thTitleId.addEventListener('click', () => {
  thTitleId.classList.toggle('active');
});

function sortId() {
  const rows = tableBody.querySelectorAll('tr');
  const newRows = Array.from(rows);
  newRows.sort((rowA, rowB) => {
    const cellA = rowA.querySelectorAll('td')[0];
    const cellB = rowB.querySelectorAll('td')[0];
    const a = cellA.getAttribute('data-id');
    const b = cellB.getAttribute('data-id');
    if (a > b) {
      return 1;
    }
    if (a < b) {
      return -1;
    }
    if (a === b) {
      return 0;
    }
  });
  rows.forEach((row) => {
    tableBody.removeChild(row);
  });

  newRows.forEach((newRow) => {
    tableBody.appendChild(newRow);
  });
}
function sortColumn(index) {
  const rows = tableBody.querySelectorAll('tr');
  const direction = directions[index] || 'desc';
  const multiplier = direction === 'desc' ? -1 : 1;
  const newRows = Array.from(rows);
  newRows.sort((rowA, rowB) => {
    const cellA = rowA.querySelectorAll('td')[index];
    const cellB = rowB.querySelectorAll('td')[index];
    const a = transform(index, cellA);
    const b = transform(index, cellB);
    if (a > b) {
      return 1 * multiplier;
    }
    if (a < b) {
      return -1 * multiplier;
    }
    if (a === b) {
      return 0;
    }
  });
  directions[index] = direction === 'desc' ? 'asc' : 'desc';
  rows.forEach((row) => {
    tableBody.removeChild(row);
  });
  newRows.forEach((newRow) => {
    tableBody.appendChild(newRow);
  });
}
const headerInputSearch = document.querySelector('.header-input');
const headerImg = document.querySelector('.header-img');
const headerWrapper = document.querySelector('.header-wrapper');
headerImg.addEventListener('click', () => {
  headerInputSearch.classList.toggle('active');
  headerWrapper.classList.toggle('active');
});

const headerSearh = document.querySelector('.header-search');

headerInputSearch.addEventListener('keyup', (e) => {
  headerSearh.classList.remove('active');
  headerSearh.innerHTML = '';
  e.preventDefault();
  if (headerInputSearch.value) {
    dataService.searchAutoFill(headerInputSearch.value).then((response) => {
      const data = response;
      if (data.length > 0) {
        headerSearh.classList.add('active');
        for (const contact of data) {
          const searchLines = document.createElement('div');
          searchLines.classList.add('search-lines');
          headerSearh.append(searchLines);
          searchLines.textContent = `${contact.surname} ${contact.name} ${contact.lastName} `;
          searchLines.addEventListener('click', () => {
            const rows = tableBody.querySelectorAll('tr');
            const newRows = Array.from(rows);
            newRows.forEach((row) => {
              row.classList.remove('sublight');
              if (row.getAttribute('data-tr') == contact.id) {
                row.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                });
                row.classList.add('sublight');
                headerSearh.classList.remove('active');
              }
            });
          });
          window.addEventListener('click', (e) => {
            if (e.target !== headerSearh) {
              headerInputSearch.value = '';
              headerSearh.classList.remove('active');
            }
          });
        }
      }
    });
  }
});
