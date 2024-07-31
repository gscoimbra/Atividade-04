document.addEventListener('DOMContentLoaded', () => {
    loadItems();

    const form = document.getElementById('item-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = document.getElementById('item-input');
        const item = input.value.trim();

        if (item) {
            if (form.dataset.editIndex !== undefined) {
                await updateItem(form.dataset.editIndex, item);
                delete form.dataset.editIndex;  // Clear edit index
                setButtonToAdd();
            } else {
                await addItem(item);
            }
            input.value = '';
        }
    });

    // Set the initial button text to "Adicionar"
    setButtonToAdd();
});

async function fetchItems() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(JSON.parse(localStorage.getItem('items')) || []);
        }, 100);
    });
}

async function addItem(item) {
    const items = await fetchItems();
    items.push(item);
    localStorage.setItem('items', JSON.stringify(items));
    displayItems();
}

async function updateItem(index, newItem) {
    const items = await fetchItems();
    items[index] = newItem;
    localStorage.setItem('items', JSON.stringify(items));
    displayItems();
}

async function deleteItem(index) {
    const items = await fetchItems();
    items.splice(index, 1);
    localStorage.setItem('items', JSON.stringify(items));
    displayItems();
}

async function loadItems() {
    displayItems();
}

async function displayItems() {
    const items = await fetchItems();
    const itemList = document.getElementById('item-list');
    itemList.innerHTML = '';
    items.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.innerHTML = `
            ${item}
            <button onclick="editItem(${index})">Editar</button>
            <button onclick="deleteItem(${index})">Excluir</button>
        `;
        itemList.appendChild(itemDiv);
    });
}

function editItem(index) {
    const input = document.getElementById('item-input');
    const form = document.getElementById('item-form');
    
    fetchItems().then(items => {
        input.value = items[index];
        form.dataset.editIndex = index;
        setButtonToEdit();
    });
}

function setButtonToEdit() {
    const button = document.querySelector('#item-form button');
    button.textContent = 'Editar';
}

function setButtonToAdd() {
    const button = document.querySelector('#item-form button');
    button.textContent = 'Adicionar';
}
