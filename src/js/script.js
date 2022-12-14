'use strict';

// First we have a sign up form which only has one input field for the user to enter their full name. Then using the name, we create a username with the initials and a random 4 digit number as the password. Afterwards we email them these information so they can sign in.
// Now we imagine these are the data in the database
// *******************************

// /////////////////////////////////////////////////
// Selectors
// /////////////////////////////////////////////////

const sectionLogin = document.querySelector('.section-login');
const fieldUsername = document.querySelector('.login__field--username');
const fieldPIN = document.querySelector('.login__field--pin');
const inputUsername = document.querySelector('.login__input--username');
const inputPIN = document.querySelector('.login__input--pin');
const errorUsername = document.querySelector(
  '.login__field--username .login__error'
);
const errorPIN = document.querySelector('.login__field--pin .login__error');
const btnLogin = document.querySelector('.login__btn');

const labelDate = document.querySelector('.date');
const labelWelcomeMessage = document.querySelector('.welcome-message');

const containerLists = document.querySelector('.lists');
const containerTasks = document.querySelector('.tasks__list');
const btnAddList = document.querySelector('.lists__btn');
const btnMoreOptions = document.querySelector('.task__more');
const containerOptions = document.querySelector('.task__options');
const btnAddTask = document.querySelector('.tasks__btn--add');
const inputTask = document.querySelector('.tasks__input');
const containerInputTask = document.querySelector('.tasks__input-container');

let currentUser;
let currentList = 'All';

// /////////////////////////////////////////////////
// User Data
// /////////////////////////////////////////////////
const user1 = {
  fullName: 'Dorsa Safari Zadeh',
  lists: [
    {
      listName: 'All',
      tasks: new Map([]),
    },
  ],
  pin: 1111,
};

const user2 = {
  fullName: 'Mahta Jannatifar',
  lists: [
    {
      listName: 'All',
      tasks: new Map([]),
    },
  ],
  pin: 1234,
};

const user3 = {
  fullName: 'Ali Moghaddam',
  lists: [
    {
      listName: 'All',
      tasks: new Map([]),
    },
  ],
  pin: 3333,
};

const user4 = {
  fullName: 'Kamyab Geranmayeh',
  lists: [
    {
      listName: 'All',
      tasks: new Map([]),
    },
  ],
  pin: 9102,
};

const users = [user1, user2, user3, user4];

// Creating username for each user, depending on their fullname's initials
const createUsernames = function (users) {
  users.forEach(
    user =>
      (user.username = user.fullName
        .toLowerCase()
        .split(' ')
        .map(name => name[0])
        .join(''))
  );
};
createUsernames(users);

// /////////////////////////////////////////////////
// LOGIN FORM DONE
// /////////////////////////////////////////////////
btnLogin.addEventListener('click', e => {
  // Prevent form from submitting and page from reloading
  e.preventDefault();

  // Restart inputs errors befor the next click checking happens
  fieldUsername.classList.remove('isWrong');
  fieldPIN.classList.remove('isWrong');
  errorUsername.innerText = '';
  errorPIN.innerText = '';

  if (inputUsername.value === '' || inputPIN.value === '') {
    if (inputUsername.value === '' && inputPIN.value === '') {
      // both inputs empty
      fieldUsername.classList.add('isWrong');
      errorUsername.innerText = 'Username field is required';
      fieldPIN.classList.add('isWrong');
      errorPIN.innerText = 'PIN field is required';
    } else if (inputUsername.value !== '' && inputPIN.value === '') {
      // PIN input empty
      fieldPIN.classList.add('isWrong');
      errorPIN.innerText = 'PIN field is required';
    } else if (inputUsername.value === '' && inputPIN.value !== '') {
      // username input empty
      fieldUsername.classList.add('isWrong');
      errorUsername.innerText = 'Username field is required';
    }
  } else {
    // both inputs filled

    currentUser = users.find(user => user.username === inputUsername.value);

    if (!currentUser) {
      // wrong username
      fieldUsername.classList.add('isWrong');
      errorUsername.innerText = 'Username not found';
    } else if (+inputPIN.value !== currentUser.pin) {
      // wrong PIN
      fieldPIN.classList.add('isWrong');
      errorPIN.innerText = 'Wrong pin';
    } else {
      // both inputs correct

      // Update the UI
      sectionLogin.classList.add('hide');
      updateUI(currentUser);
    }
  }
});

/////////////////////////////////////////////////
// UPDATE UI DONE
/////////////////////////////////////////////////
const createNewTaskHTML = function (user, isChecked, task) {
  // Create task HTML
  const taskItemHTML = `<li class="task" style="${
    isChecked
      ? 'text-decoration-color:black'
      : 'text-decoration-color: transparent'
  }">
  <span data-checks='0' class="task__checkbox ${
    isChecked ? 'checked' : ''
  }"></span>${task}
  <button class="task__more">
    :
    <ul class="task__options">
      <li class="task__btn--delete">Delete</li>
    </ul>
  </button>
</li>`;

  // Add task html to the tasks container
  containerTasks.insertAdjacentHTML('afterbegin', taskItemHTML);
};
const displayHeaderText = function (user) {
  // configurations object
  const options = {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    weekday: 'long',
    hour12: false,
  };
  const now = new Intl.DateTimeFormat('en-US', options).formatToParts(
    new Date()
  ); // this is an array of all the time parts

  const weekday = now.find(part => part.type === 'weekday').value;
  const month = now.find(part => part.type === 'month').value;
  const day = now.find(part => part.type === 'day').value;
  const hour = now.find(part => part.type === 'hour').value;

  // 1) daylight
  let daylight;
  if (hour >= 0 && hour < 12) {
    daylight = ' morning';
  } else if (hour >= 12 && hour < 16) {
    daylight = ' afternoon';
  } else if (hour >= 16 && hour < 19) {
    daylight = ' evening';
  } else {
    daylight = 'night';
  }

  // 2) name
  const firstName = user.fullName.split(' ')[0];
  labelWelcomeMessage.textContent = `Good${daylight}, ${firstName}`;

  // 3) date
  labelDate.textContent = `It's ${weekday}, ${
    month.length > 5 ? month.slice(0, 3) : month
  } ${day} `;
};
const displayLists = function (user) {
  user.lists.forEach(list => {
    // All list is the default list and already exists in the HTML
    if (list.listName !== 'All') {
      const listItemHTML = `<li class="list">${list.listName}<button class="list__btn--trash">???</button></li>`;
      containerLists.insertAdjacentHTML('beforeend', listItemHTML);
    }
  });
};
const displayTasks = function (user, currentList = 'All') {
  // Remove all the prev tasks when we want to update the new clicked list
  containerTasks.innerHTML = '';

  // The All list needs to show all the tasks in every list the user has
  if (currentList !== 'All') {
    const currListIndex = user.lists.findIndex(
      list => list.listName === currentList
    );
    user.lists[currListIndex].tasks.forEach((isChecked, task) => {
      createNewTaskHTML(user, isChecked, task);
    });
  } else {
    user.lists.forEach(list => {
      list.tasks.forEach((isChecked, task) => {
        createNewTaskHTML(user, isChecked, task);
      });
    });
  }

  if (document.querySelector('.list').textContent === 'All') {
    document.querySelector('.list').style.backgroundColor = '#e4e4ea6d';
  }
};

function updateUI(user) {
  displayHeaderText(user);
  displayLists(user);
  displayTasks(user);
}

/////////////////////////////////////////////////
// LIST ADDING/DELETING DONE
/////////////////////////////////////////////////
let isEditDone = true;
let listNew;
btnAddList.addEventListener('click', () => {
  // Check if we are in the middle of creating a new list
  if (isEditDone) {
    listNew = document.createElement('li');

    containerLists.appendChild(listNew);

    listNew.classList.add('list');
    listNew.setAttribute('contenteditable', true);
    listNew.focus();

    isEditDone = false;
  } else {
    listNew.focus();
  }
});

containerLists.addEventListener('keydown', e => {
  if (e.target.getAttribute('contenteditable') === 'true') {
    if (e.key === 'Enter') {
      // Prevent going to the next line
      e.preventDefault();

      if (e.target.textContent === '') {
        e.target.remove();
        isEditDone = true;
      } else {
        // Create new list object to add to the currenUsers lists array
        const list = new Object();
        list.listName = listNew.innerText;
        list.tasks = new Map();

        currentUser.lists.push(list);
        const btnDelList = `<button class="list__btn--trash">???</button>`;
        listNew.insertAdjacentHTML('beforeend', btnDelList);
        e.target.setAttribute('contenteditable', false);
        isEditDone = true;
      }
    }
  }
});

containerLists.addEventListener('click', e => {
  if (e.target.classList.contains('list__btn--trash')) {
    const currentDeleteBtn = e.target;
    const textListLength = currentDeleteBtn.closest('.list').textContent.length;
    const textList = currentDeleteBtn
      .closest('.list')
      .textContent.split('')
      .splice(0, textListLength - 1)
      .join('');

    const currListIndex = currentUser.lists.findIndex(
      list => list.listName === textList
    );

    currentDeleteBtn.closest('.list').style.opacity = 0;
    currentDeleteBtn.closest('.list').style.visibility = 'hidden';
    currentDeleteBtn.closest('.list').remove();

    // Delete the list object from the currenUsers lists array
    currentUser.lists.splice(currListIndex, 1);

    displayTasks(currentUser, 'All');
    btnCompleted.style.backgroundColor = 'transparent';
    sortClicked = false;
  }

  // clicking on a list name
  if (e.target.classList.contains('list')) {
    if (!e.target.textContent.includes('All')) {
      const textListLength = e.target.textContent.length;
      const textList = e.target.textContent
        .split('')
        .splice(0, textListLength - 1)
        .join('');
      currentList = textList;
    } else {
      currentList = 'All';
    }
    // adding new ones
    displayTasks(currentUser, currentList);
    btnCompleted.style.backgroundColor = 'transparent';
    sortClicked = false;
    document
      .querySelectorAll('.list')
      .forEach(list => (list.style.backgroundColor = 'transparent'));
    e.target.style.backgroundColor = '#e4e4ea6d';
  }
});

/////////////////////////////////////////////////
// TASK INPUT AND ADDING NEW TASKS DONE
/////////////////////////////////////////////////
const addTask = function () {
  createNewTaskHTML(currentUser, false, inputTask.value);
  const currListIndex = currentUser.lists.findIndex(
    list => list.listName === currentList
  );
  currentUser.lists[currListIndex].tasks.set(inputTask.value, false);
  inputTask.value = '';
};

containerInputTask.addEventListener('focusin', e => {
  if (e.target.classList.contains('tasks__input')) {
    btnAddTask.classList.add('isTyping');
    inputTask.classList.add('isTyping');
  }
});

containerInputTask.addEventListener('focusout', () => {
  btnAddTask.classList.remove('isTyping');
  inputTask.classList.remove('isTyping');
});

inputTask.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    // Prevent going to the next line
    e.preventDefault();

    if (e.target.value === '') {
      inputTask.blur();
    } else {
      addTask();
      inputTask.blur();
    }
  }
});

btnAddTask.addEventListener('click', e => {
  if (e.target.parentElement.querySelector('.tasks__input').value !== '') {
    addTask();
  } else {
    inputTask.blur();
  }
});

/////////////////////////////////////////////////
// TASKS CONTAINER AND CHECKING/DELETING TASKS DONE
/////////////////////////////////////////////////
let isMoreClicked = true;
containerTasks.addEventListener('click', e => {
  let currentListIndex = currentUser.lists.findIndex(
    list => list.listName === currentList
  );

  // Checkbox click
  if (e.target.classList.contains('task__checkbox')) {
    const clickedCheckbox = e.target;
    clickedCheckbox.dataset.checks++;
    if (clickedCheckbox.dataset.checks % 2 === 0) {
      // checked
      clickedCheckbox.parentElement.style.textDecorationColor = 'transparent';
      clickedCheckbox.classList.remove('checked');
      currentUser.lists[currentListIndex].tasks.set(
        clickedCheckbox.closest('.task').innerText.split('\n')[0],
        false
      );
    } else {
      // not checked
      clickedCheckbox.parentElement.style.textDecorationColor = 'black';
      clickedCheckbox.classList.add('checked');
      currentUser.lists[currentListIndex].tasks.set(
        clickedCheckbox.closest('.task').innerText.split('\n')[0],
        true
      );
    }
  }

  // More button click
  if (e.target.classList.contains('task__more')) {
    const clickedMoreBtn = e.target;
    if (isMoreClicked) {
      clickedMoreBtn.querySelector('.task__options').classList.add('show');
      isMoreClicked = false;
    } else {
      clickedMoreBtn.querySelector('.task__options').classList.remove('show');
      isMoreClicked = true;
    }
  }

  // Delete button click
  if (e.target.classList.contains('task__btn--delete')) {
    const clickedDeleteBtn = e.target;
    const textTask = clickedDeleteBtn.closest('.task').innerText.split('\n')[0];

    // Delete the task from the current list object
    currentUser.lists[currentListIndex].tasks.delete(textTask);
    clickedDeleteBtn.closest('.task').remove();
    clickedDeleteBtn.parentElement.classList.remove('show');
    isMoreClicked = true;
  }
});

/////////////////////////////////////////////////
// HIDE COMPLETED TASKS/ ALL DONE
/////////////////////////////////////////////////
let sortClicked = false;
const btnCompleted = document.querySelector('.circle');
btnCompleted.addEventListener('click', e => {
  if (!sortClicked) {
    Array.from(containerTasks.children).forEach(child => {
      child.querySelector('.task__checkbox').classList.contains('checked')
        ? (child.style.display = 'none')
        : (child.style.display = 'flex');
    });
    btnCompleted.style.backgroundColor = 'black';
    sortClicked = !sortClicked;
  } else {
    Array.from(containerTasks.children).forEach(child => {
      child.style.display = 'flex';
    });
    btnCompleted.style.backgroundColor = 'transparent';
    sortClicked = !sortClicked;
  }
});

// localstorage TODO
