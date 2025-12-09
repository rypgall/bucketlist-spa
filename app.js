// Load items
let items = JSON.parse(localStorage.getItem("bucketItems")) || [];
let editingId = null;

// Save to storage
function saveItems() {
localStorage.setItem("bucketItems", JSON.stringify(items));
}

// Elements
const listSection = document.getElementById("listSection");
const modalOverlay = document.getElementById("modalOverlay");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const addFloatingBtn = document.getElementById("addFloatingBtn");
const modalTitle = document.getElementById("modalTitle");

// Input fields
const titleInput = document.getElementById("titleInput");
const descInput = document.getElementById("descInput");
const imageInput = document.getElementById("imageInput");
const locationInput = document.getElementById("locationInput");
const linkInput = document.getElementById("linkInput");
const categoryInput = document.getElementById("categoryInput");

// Category colors (rainbow)
const categoryColors = {
travel: "#ff6b6b",
food: "#feca57",
nature: "#1dd1a1",
adventure: "#48dbfb",
culture: "#5f27cd",
default: "#ff9ff3"
};

// Open modal (for add or edit)
function openModal(isEdit = false) {
modalOverlay.classList.remove("hidden");
modalTitle.textContent = isEdit ? "Edit Item" : "Add Item";
}

// Close modal
function closeModal() {
modalOverlay.classList.add("hidden");
editingId = null;
titleInput.value = "";
descInput.value = "";
imageInput.value = "";
locationInput.value = "";
linkInput.value = "";
categoryInput.value = "";
}

// Handle Save (add or edit)
saveBtn.addEventListener("click", () => {
const data = {
title: titleInput.value,
desc: descInput.value,
image: imageInput.value,
location: locationInput.value,
link: linkInput.value,
category: categoryInput.value.toLowerCase(),
completed: false
};

if (editingId) {
const index = items.findIndex(item => item.id === editingId);
items[index] = { ...items[index], ...data };
} else {
items.push({ id: Date.now(), ...data });
}

saveItems();
renderItems();
closeModal();
});

// Cancel modal
cancelBtn.addEventListener("click", closeModal);

// Floating Add button opens modal
addFloatingBtn.addEventListener("click", () => openModal(false));

// Render cards
function renderItems(filterText = "") {
listSection.innerHTML = "";

const filtered = items.filter(item => {
const t = filterText.toLowerCase();
return (
item.title.toLowerCase().includes(t) ||
item.desc.toLowerCase().includes(t) ||
item.location.toLowerCase().includes(t) ||
item.category.toLowerCase().includes(t)
);
});

filtered.forEach(item => {
const card = document.createElement("div");
card.className = "card";
const tagColor = categoryColors[item.category] || categoryColors.default;

card.innerHTML = 
  '<div class="category-tag" style="background:' + tagColor + '">' +
    item.category +
  '</div>' +
  '<h3>' + item.title + '</h3>' +
  '<p>' + item.desc + '</p>' +
  (item.image ? '<img src="' + item.image + '">' : '') +
  '<p><strong>Location:</strong> ' + item.location + '</p>' +
  (item.link ? '<a href="' + item.link + '" target="_blank">More Info</a>' : '') +
  '<br>' +
  '<button class="complete-btn">Complete</button>' +
  '<button class="edit-btn">Edit</button>' +
  '<button class="delete-btn">Delete</button>';

// Complete
card.querySelector(".complete-btn").addEventListener("click", () => {
  item.completed = !item.completed;
  saveItems();
  renderItems(filterText);
});

// Edit
card.querySelector(".edit-btn").addEventListener("click", () => {
  editingId = item.id;
  openModal(true);

  titleInput.value = item.title;
  descInput.value = item.desc;
  imageInput.value = item.image;
  locationInput.value = item.location;
  linkInput.value = item.link;
  categoryInput.value = item.category;
});

// Delete
card.querySelector(".delete-btn").addEventListener("click", () => {
  items = items.filter(x => x.id !== item.id);
  saveItems();
  renderItems(filterText);
});

listSection.appendChild(card);
});
}

// Search
document.getElementById("searchInput").addEventListener("input", e => {
renderItems(e.target.value);
});

// Initial render
renderItems();