export class Utils {
  options = [
    {
      code: 'phone',
      title: 'Телефон',
    },
    {
      code: 'email',
      title: 'E-mail',
    },
    {
      code: 'vk',
      title: 'Vk',
    },
    {
      code: 'facebook',
      title: 'Facebook',
    },
    {
      code: 'other',
      title: 'Другое',
    },
  ];

  getContactsCount(container) {
    const slots = container.querySelectorAll('.contact-wrapper');
    return slots.length;
  }

  getContacts(container) {
    const contacts = [];
    const slots = container.querySelectorAll('.contact-wrapper');
    for (const slot of slots) {
      const contact = {};
      const select = slot.querySelector('span');
      contact.type = select.textContent;
      contact.value = slot.querySelector('input').value;
      contacts.push(contact);
    }
    return contacts;
  }

  createContact(contact) {
    const contactWrapper = document.createElement('div');
    contactWrapper.classList.add('contact-wrapper');
    const selectWrapper = document.createElement('div');
    selectWrapper.classList.add('wrapper-left');
    const titleContactSave = document.createElement('span');
    titleContactSave.classList.add('title-contact-save', 'title-contact');
    selectWrapper.append(titleContactSave);
    const contactSaveWrapper = document.createElement('div');
    contactSaveWrapper.classList.add('contact-save-wrapper');
    selectWrapper.append(contactSaveWrapper);
    const labels = [];
    this.options.forEach((option) => {
      const optionElement = document.createElement('label');
      optionElement.classList.add('contact-save-label', 'contact-label');
      optionElement.textContent = option.title;
      labels.push(optionElement);

      if (contact.type === option.title) {
        titleContactSave.textContent = option.title;
        optionElement.classList.add('hidden');
        titleContactSave.setAttribute('data-save', option.code);
      }
      contactSaveWrapper.append(optionElement);
      optionElement.setAttribute('data-save', option.code);

      dropDownListContact(titleContactSave, selectWrapper, labels, 'data-save');
    });

    function dropDownListContact(title, wrapperLeft, label, data) {
      if (title !== undefined) {
        title.addEventListener('click', () => {
          // wrapperLeft.classList.toggle('active');
          const isactive = !wrapperLeft.classList.contains('active');
          document
            .querySelectorAll('.contact-wrapper > .wrapper-left')
            .forEach((wrapper) => {
              //  if (!wrapper.isSameNode(wrapperLeft)) {
              wrapper.classList.remove('active');
              // }
            });
          if (isactive) {
            wrapperLeft.classList.add('active');
          }
          for (let i = 0; i < label.length; i++) {
            label[i].addEventListener('click', (evt) => {
              title.textContent = evt.target.textContent;
              title.setAttribute(data, evt.target.getAttribute(data));
              const hidden = document.querySelectorAll('.hidden');
              for (const option of hidden) {
                option.classList.remove('hidden');
              }
              evt.target.classList.add('hidden');
              wrapperLeft.classList.remove('active');
            });
          }
        });
      }
    }

    const input = document.createElement('input');
    input.classList.add('save-data', 'enter-data');
    input.value = contact.value;

    const delButton = document.createElement('button');
    delButton.classList.add('save-btn-delete');

    delButton.addEventListener('click', (e) => {
      e.preventDefault();
      contactWrapper.remove();
    });

    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip-delete');
    const innerTooltipContacts = document.createElement('div');
    innerTooltipContacts.classList.add('inner-tooltip-contacts');
    innerTooltipContacts.append(tooltip);
    tooltip.innerHTML = `Удалить контакт`;
    delButton.append(innerTooltipContacts);

    contactWrapper.append(selectWrapper);
    contactWrapper.append(input);
    contactWrapper.append(delButton);

    return {
      contactWrapper,
      titleContactSave,
      input,
      delButton,
    };
  }
}
