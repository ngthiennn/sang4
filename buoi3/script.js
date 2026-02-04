let data = [];
let filtered = [];
let page = 1;
let pageSize = 10;
let sortField = "";
let sortAsc = true;
let selectedItem = null;

const API = "https://api.escuelajs.co/api/v1/products";

fetch(API)
  .then(res => res.json())
  .then(json => {
    data = json;
    filtered = data;
    render();
  });

document.getElementById("searchInput").addEventListener("input", e => {
  let keyword = e.target.value.toLowerCase();
  filtered = data.filter(p => p.title.toLowerCase().includes(keyword));
  page = 1;
  render();
});

document.getElementById("pageSize").addEventListener("change", e => {
  pageSize = +e.target.value;
  page = 1;
  render();
});

function render() {
  let start = (page - 1) * pageSize;
  let end = start + pageSize;
  let rows = filtered.slice(start, end);

  let html = "";
  rows.forEach(p => {
    html += `
      <tr data-bs-toggle="tooltip" data-bs-placement="top"
          title="${p.description}" onclick="openModal(${p.id})">
        <td>${p.id}</td>
        <td>${p.title}</td>
        <td>${p.price}</td>
        <td>${p.category.name}</td>
        <td>
          <img src="${p.images[0]}" width="60"
               onerror="this.src='https://picsum.photos/80'">
        </td>
      </tr>
    `;
  });

  document.getElementById("tableBody").innerHTML = html;
  document.getElementById("pageInfo").innerText = `Page ${page}`;

  // KÍCH HOẠT TOOLTIP BOOTSTRAP
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.map(el => new bootstrap.Tooltip(el));
}

function prevPage() {
  if (page > 1) page--;
  render();
}

function nextPage() {
  if (page * pageSize < filtered.length) page++;
  render();
}

function sortBy(field) {
  sortAsc = sortField === field ? !sortAsc : true;
  sortField = field;

  filtered.sort((a, b) => {
    if (a[field] > b[field]) return sortAsc ? 1 : -1;
    if (a[field] < b[field]) return sortAsc ? -1 : 1;
    return 0;
  });
  render();
}

function exportCSV() {
  let csv = "id,title,price,category\n";
  filtered.forEach(p => {
    csv += `${p.id},${p.title},${p.price},${p.category.name}\n`;
  });

  let blob = new Blob([csv], { type: "text/csv" });
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "products.csv";
  a.click();
}

function openModal(id) {
  selectedItem = data.find(p => p.id === id);
  document.getElementById("viewTitle").innerText = selectedItem.title;
  document.getElementById("viewDesc").innerText = selectedItem.description;
  document.getElementById("viewImage").src = selectedItem.images[0];
  document.getElementById("editPrice").value = selectedItem.price;

  new bootstrap.Modal(document.getElementById("viewModal")).show();
}

function updateItem() {
  fetch(API + "/" + selectedItem.id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ price: document.getElementById("editPrice").value })
  }).then(() => alert("Updated (fake API)"));
}

function addItem() {
  fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: addTitle.value,
      price: addPrice.value,
      description: addDesc.value,
      categoryId: 1,
      images: ["https://placeimg.com/640/480/any"]
    })
  }).then(() => alert("Added (fake API)"));
}
