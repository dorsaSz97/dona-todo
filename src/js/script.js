'use strict';

// First we have a sign up form which only has one input field for the user to enter their full name. Then using the name, we create a username with the initials and a random 4 digit number as the password. Afterwards we email them these information so they can sign in.
// Now we imagine these are the data in the database
// *******************************
// TODO: local storage
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

let currentUser;
let currentList = 'All';
let currentListIndex = 0;

// /////////////////////////////////////////////////
// User Data
// /////////////////////////////////////////////////
// TODO: Sign up new users from the app
const user1 = {
  fullName: 'Dorsa Safari Zadeh',
  lists: [
    {
      listName: 'All',
      tasks: [],
    },
  ],
  pin: 1111,
  username: '',
};
const users = [user1];

// Creating username for each user, depending on their fullname's initials
const createUsernames = function (users) {
  users.forEach(user => {
    user.username = user.fullName
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');

    // new Date() * 1000;

    // TODO: show this to the user to let them know their username
    // console.log(user.username);
  });
};
createUsernames(users);

// /////////////////////////////////////////////////
// LOGIN FORM DONE
// /////////////////////////////////////////////////
btnLogin.addEventListener('click', e => {
  // Prevent form from submitting and page from reloading
  e.preventDefault();

  // Restart inputs errors before the next click checking happens
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
    } else if (inputPIN.value === '') {
      // PIN input empty
      fieldPIN.classList.add('isWrong');
      errorPIN.innerText = 'PIN field is required';
    } else if (inputUsername.value === '') {
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
// UPDATE UI
/////////////////////////////////////////////////
const createNewTaskHTML = function (task) {
  // Create task HTML
  const taskItemHTML = `<li class="task" style="${
    task.isChecked
      ? 'text-decoration-color: black'
      : 'text-decoration-color: transparent'
  }">
  <span data-checked=${task.isChecked} class="task__checkbox ${
    task.isChecked ? 'checked' : ''
  }"></span>
  <p>${task.value}</p>
  <button class="task__more">
      :
    <ul class="task__options">
      <li class="task__btn--delete">Delete</li>
    </ul>
  </button>
</li>`;

  // Add task HTML to the tasks container
  containerTasks.insertAdjacentHTML('afterbegin', taskItemHTML);
};
const displayHeaderText = function () {
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
  const firstName = currentUser.fullName.split(' ')[0];
  labelWelcomeMessage.textContent = `Good${daylight}, ${firstName}`;

  // 3) date
  labelDate.textContent = `It's ${weekday}, ${
    month.length > 5 ? month.slice(0, 3) : month
  } ${day} `;
};
const displayLists = function () {
  currentUser.lists.forEach(list => {
    // 'All' list is the default list and already exists in the HTML
    if (list.listName !== 'All') {
      const listHTML = `<li class="list">${list.listName}<button class="list__btn--trash">╳</button></li>`;
      containerLists.insertAdjacentHTML('beforeend', listHTML);
    }
  });
};
const displayTasks = function (currentList = 'All') {
  // Remove all the prev tasks when we want to update the new clicked list
  containerTasks.innerHTML = '';

  // The All list needs to show all the tasks in every list the user has
  if (currentList !== 'All') {
    const currListIndex = currentUser.lists.findIndex(
      list => list.listName === currentList
    );
    currentUser.lists[currListIndex].tasks.forEach(task => {
      createNewTaskHTML({ isChecked: task.isChecked, value: task.value });
    });
  } else {
    currentUser.lists.forEach(list =>
      list.tasks.forEach(task => {
        createNewTaskHTML({ isChecked: task.isChecked, value: task.value });
      })
    );
  }

  document.querySelectorAll('.list').forEach((list, i) => {
    if (i === currentListIndex) {
      list.style.backgroundColor = '#e4e4ea6d';
    }
  });
};

function updateUI(user) {
  displayHeaderText();
  displayLists();
  displayTasks();
}

/////////////////////////////////////////////////
// ADDING + DELETING LIST DONE
/////////////////////////////////////////////////
let newList;
let isCreating = true;

btnAddList.addEventListener('click', () => {
  // Check if we are in the middle of creating a new list
  if (isCreating) {
    newList = document.createElement('li');
    newList.classList.add('list');
    newList.setAttribute('contenteditable', true);

    containerLists.appendChild(newList);

    newList.focus();
    isCreating = false;
  } else {
    newList.focus();
  }
});

containerLists.addEventListener('keydown', e => {
  if (e.target.getAttribute('contenteditable') === 'true') {
    if (e.key === 'Enter') {
      // Prevent going to the next line
      e.preventDefault();

      if (e.target.textContent === '') {
        e.target.remove();
        isCreating = true;
      } else {
        // Create new list object to add to the currenUsers lists array
        const list = { listName: newList.innerText, tasks: [] };

        currentUser.lists.push(list);
        const btnDelList = `<button class="list__btn--trash">╳</button>`;
        newList.insertAdjacentHTML('beforeend', btnDelList);
        e.target.setAttribute('contenteditable', false);
        isCreating = true;
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

    displayTasks();
    // btnHideCompleted.style.backgroundColor = 'transparent';
    // btnMoreClicked = false;
  }

  // clicking on a list name
  if (e.target.classList.contains('list')) {
    console.log(e.target.innerText.split('\n')[0]);
    currentListIndex = currentUser.lists.findIndex(
      list => list.listName === e.target.innerText.split('\n')[0]
    );
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
    displayTasks(currentList);
    // btnCompleted.style.backgroundColor = 'transparent';
    // sortClicked = false;
    document.querySelectorAll('.list').forEach((list, i) => {
      list.style.backgroundColor = 'transparent';
      if (i === currentListIndex) list.style.backgroundColor = '#e4e4ea6d';
    });
  }
});

/////////////////////////////////////////////////
// TASK INPUT AND ADDING NEW TASKS DONE
/////////////////////////////////////////////////
const addNewTask = function (value) {
  createNewTaskHTML({ value, isChecked: false });

  currentUser.lists[currentListIndex].tasks.unshift({
    value,
    isChecked: false,
  });

  inputTask.value = '';
};

inputTask.addEventListener('focusin', () => {
  btnAddTask.classList.add('isFocused');
  inputTask.classList.add('isFocused');
});
inputTask.addEventListener('focusout', () => {
  btnAddTask.classList.remove('isFocused');
  inputTask.classList.remove('isFocused');
});
inputTask.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    // Prevent from going to the next line
    // e.preventDefault();
    if (e.target.value !== '') addNewTask(e.target.value);
    inputTask.blur();
  }
});

btnAddTask.addEventListener('click', () => {
  if (inputTask.value !== '') addNewTask(inputTask.value);
  inputTask.blur();
});

/////////////////////////////////////////////////
// CHECKING + DELETING TASKS
/////////////////////////////////////////////////
let btnMoreClicked = false;

const toggleMoreMenu = function (btnEl) {
  btnMoreClicked = !btnMoreClicked;
  if (btnMoreClicked) {
    btnEl.querySelector('.task__options').classList.add('show');
  } else {
    btnEl.querySelector('.task__options').classList.remove('show');
  }
};

containerTasks.addEventListener('click', e => {
  const taskEl = e.target.closest('.task');
  const taskText = taskEl.querySelector('p').innerText;

  // Checkbox click
  if (e.target.classList.contains('task__checkbox')) {
    const checkboxEl = e.target;

    let isChecked = checkboxEl.dataset.checked === 'false' ? true : false;
    checkboxEl.dataset.checked = `${isChecked}`;

    // Change styles
    taskEl.querySelector('p').style.textDecorationColor = isChecked
      ? 'black'
      : 'transparent';
    isChecked
      ? checkboxEl.classList.add('checked')
      : checkboxEl.classList.remove('checked');

    // Hide from the lists
    if (currentListIndex !== 0) {
      currentUser.lists[currentListIndex].tasks.forEach(task => {
        if (task.value === taskText) task.isChecked = isChecked ? true : false;
      });
    } else {
      currentUser.lists.forEach(list => {
        const taskIndex = list.tasks.findIndex(task => task.value === taskText);
        if (taskIndex !== -1)
          list.tasks[taskIndex].isChecked = isChecked ? true : false;
      });
    }

    toggleDisplayCompletedTasks();
  }

  // More button click
  if (e.target.classList.contains('task__more')) toggleMoreMenu(e.target);

  // Delete button click
  if (e.target.classList.contains('task__btn--delete')) {
    // Delete from the lists
    currentUser.lists.forEach(list => {
      const taskIndex = list.tasks.findIndex(task => task.value === taskText);
      if (taskIndex !== -1) list.tasks.splice(taskIndex, 1);
    });

    toggleMoreMenu(e.target.closest('.task__more'));
    displayTasks(currentList);
  }
});

/////////////////////////////////////////////////
// HIDE/SHOW COMPLETED TASKS DONE
/////////////////////////////////////////////////
const btnHideCompleted = document.querySelector('.circle');
let hideClicked = false;

btnHideCompleted.addEventListener('click', () => {
  hideClicked = !hideClicked;
  toggleDisplayCompletedTasks();
});

const toggleDisplayCompletedTasks = function () {
  if (hideClicked) {
    Array.from(containerTasks.children, child => {
      child.querySelector('.task__checkbox').classList.contains('checked')
        ? (child.style.display = 'none')
        : (child.style.display = 'flex');
    });
    btnHideCompleted.style.backgroundColor = 'black';
  } else {
    Array.from(
      containerTasks.children,
      child => (child.style.display = 'flex')
    );
    btnHideCompleted.style.backgroundColor = 'transparent';
  }
};
