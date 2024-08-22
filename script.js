const submit = document.querySelector(".submit-btn");
const myGrocery = document.querySelector(".grocery-form");
const clearItems = document.querySelector(".clear-btn");
const entire = document.querySelector(".entire");
const inputValue = document.getElementById("grocery");
const alert = document.querySelector(".alert");
const formControl = document.querySelector(".form-control");
const groceryContainer = document.querySelector(".grocery-container");
const groceryList = document.querySelector(".grocery-list");

// let inputMessage = inputValue.value;
let editElement;
let isTrue = false;
let editId = "";

myGrocery.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = inputValue.value;
  const id = new Date().getTime().toString();

  if (value && !isTrue) {
    createElement(id, value);

    alertFunction("Item added to list", "success");
    groceryContainer.classList.add("display-container");

    addToLocalStorage(id, value);
    setBackToDefault();
  } else if (value && isTrue) {
    editElement.innerHTML = value;
    alertFunction("item edited", "success");
    editLocalStorage(editId, value);
    setBackToDefault();
  } else {
    alertFunction("please add item", "danger");
  }
});

// localstorage

window.addEventListener("DOMContentLoaded", () => {
  let items = storageFunction();
  if (items.length > 0) {
    items.forEach((item) => {
      createElement(item.id, item.value);
    });
    groceryContainer.classList.add("display-container");
  }
});
// clear item

clearItems.addEventListener("click", () => {
  const items = document.querySelectorAll(".grocery-item");

  if (items.length > 0) {
    items.forEach((item) => {
      groceryList.removeChild(item);
    });
  }
  groceryContainer.classList.remove("display-container");
  alertFunction("empty list", "success");
  setBackToDefault();
  localStorage.removeItem("groceryList");
});
const alertFunction = (text, action) => {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
};
const setBackToDefault = () => {
  inputValue.value = "";
  isTrue = false;
  editId = "";
  submit.textContent = "Submit";
};
const addToLocalStorage = (id, value) => {
  const grocery = { id: id, value: value };
  let items = storageFunction();

  items.push(grocery);
  localStorage.setItem("groceryList", JSON.stringify(items));
};

const removeFromLocalStorage = (id) => {
  let items = storageFunction();
  items = items.filter((item) => {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("groceryList", JSON.stringify(items));
};

const editLocalStorage = (id, value) => {
  let items = storageFunction();
  items = items.map((item) => {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("groceryList", JSON.stringify(items));
};

const storageFunction = () => {
  return localStorage.getItem("groceryList")
    ? JSON.parse(localStorage.getItem("groceryList"))
    : [];
};

const createElement = (id, value) => {
  const element = document.createElement("article");
  element.classList.add("grocery-item");
  const attribute = document.createAttribute("data-id");
  attribute.value = id;
  element.setAttributeNode(attribute);
  element.innerHTML = `<p class="title">${value}</p>
  <div class="btn-container">
    <button type="button" class="edit-btn">
      <i class="fas fa-edit"></i>
    </button>
    <button type="button" class="delete-btn">
      <i class="fas fa-trash"></i>
    </button>
  </div>`;
  const editBtn = element.querySelector(".edit-btn");
  const deleteBtn = element.querySelector(".delete-btn");

  // delete event

  deleteBtn.addEventListener("click", (e) => {
    const items = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    groceryList.removeChild(items);
    alertFunction("delete item", "success");
    if (groceryList.children.length === 0) {
      groceryContainer.classList.remove("display-container");
      alertFunction("empty list", "success");
    }
    setBackToDefault();
    removeFromLocalStorage(id);
  });

  // edit event
  editBtn.addEventListener("click", (e) => {
    const items = e.currentTarget.parentElement.parentElement;
    editElement = e.currentTarget.parentElement.previousElementSibling;
    inputValue.value = editElement.innerHTML;
    isTrue = true;
    editId = element.dataset.id;
    submit.textContent = "edit";
  });

  groceryList.appendChild(element);
};
