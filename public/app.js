document.addEventListener('DOMContentLoaded', () => {
    const itemsContainer = document.getElementById('items-container');
    const addItemButton = document.getElementById('add-item-button');

    const fetchItems = async () => {
        const response = await fetch('/items');
        const items = await response.json();
        itemsContainer.innerHTML = items.map(item => `
            <div>
                <h2>${item.name}</h2>
                <p>${item.description || 'No description'}</p>
                <button onclick="deleteItem(${item.id})">Delete</button>
            </div>
        `).join('');
    };

    const deleteItem = async (id) => {
        await fetch(`/items/${id}`, { method: 'DELETE' });
        fetchItems();
    };

    addItemButton.addEventListener('click', async () => {
        const name = prompt('Enter item name:');
        const description = prompt('Enter item description:');
        await fetch('/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description })
        });
        fetchItems();
    });

    fetchItems();
});
