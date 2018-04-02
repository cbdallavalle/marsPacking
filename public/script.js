$(this).ready(() => {
  displayAllItems();
})

$('form').submit((event) => {
  event.preventDefault();
  addItem();
})

$('article').on('click', 'button', function() {
  const idToDelete = $(this).parent().attr('id');
  deleteItem(idToDelete);
  $(`#${idToDelete}`).remove();
})

$('article').on('click', '.checkbox', function() {
  const updatedPackedId = $(this).attr('id') === 'packed' ? "not-packed" : "packed";
  $(this).prop('id', updatedPackedId)
  const idToUpdate = $(this).closest('section').attr('id');
  updateItem(idToUpdate, updatedPackedId);
})

const displayAllItems = async () => {
  const items = await getItems();
  const itemsHTML = getItemHTML(items).join('');
  $('article').prepend(`${ itemsHTML }`);
}

const getItems = async () => {
  const response = await fetch('/api/v1/mars_items');
  return await response.json();
}

const getItemHTML = (items) => {
  return items.map( item => {
    const packed = item.packed === true ? 'packed' : 'not-packed';
    return (
      `<section id=${item.id}>
         <h2>${ item.name }</h2>
         <div class="packed-cont">
           <div class="checkbox" id="${ packed }"></div>
           <p>Packed</p>
         </div>
         <button type="button">Delete</button>
       </section>`
    )
  })
}

const addItem = async () => {
  const item = {
    name: $('input').val(),
    packed: "false"
  }

  try {
    const itemId = await postItem(item);
    $('input').val('');
    appendNewItem(item, itemId.id);
  } catch (error) {
    console.log(error)
  }
}

const postItem = async (item) => {
  try {
    const response = await fetch('/api/v1/mars_items', {
      method: 'POST',
      body: JSON.stringify(item), 
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
    return await response.json();
  } catch (error) {
    throw new Error({ error: error.message })
  }
}

const appendNewItem = (item, itemId) => {
  const itemHTML = getItemHTML([item]).join();
  $('section').last().append(itemHTML);
  $('section').last().prop('id', itemId)
}

const deleteItem = async (id) => {
  await fetch(`/api/v1/mars_items/${id}`, {
    method: 'DELETE'
  }); 
}

const updateItem = async (id, updatedPackedId) => {
  const packed = updatedPackedId === "packed" ? "true" : "false";
  const itemToUpdate = { packed };

  try {
    const response = await fetch(`/api/v1/mars_items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemToUpdate), 
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
  } catch (error) {
    throw new Error({ error: error.message })
  }
}