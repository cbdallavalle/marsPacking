$(this).ready(() => {
  displayAllItems();
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
    const packed = item.packed ? 'checked' : 'not-checked';
    return (
      `<section>
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