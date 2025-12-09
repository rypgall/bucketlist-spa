// Load items
let items = [];
let editingId = null;

async function loadItems() {
  items = [];
  const querySnapshot = await getDocs(coll(db, "bucketlist"));
  querySnapshot.forEach((d) => {
    items.push({ id: d.id, ...d.data() });
  });
  renderItems();
}

async function saveItemToDB(item) {
  await addDoc(coll(db, "bucketlist"), item);
}

async function updateItemInDB(id, data) {
  await updateDoc(docRef(db, "bucketlist", id), data);
}

async function deleteItemInDB(id) {
  await deleteDoc(docRef(db, "bucketlist", id));
}
/*
// Load items from Firestore
async function loadItems() {
  items = [];
  const querySnapshot = await getDocs(collection(db, "bucketlist"));
  querySnapshot.forEach((d) => {
    items.push({ id: d.id, ...d.data() });
  });
  renderItems();
}

// Save new item
async function saveItemToDB(item) {
  await addDoc(collection(db, "bucketlist"), item);
}

// Update item
async function updateItemInDB(id, data) {
  await updateDoc(doc(db, "bucketlist", id), data);
}

// Delete item
async function deleteItemInDB(id) {
  await deleteDoc(doc(db, "bucketlist", id));
}

*/




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
saveBtn.addEventListener("click", async () => {
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
    await updateItemInDB(editingId, data);
  } else {
    await saveItemToDB(data);
  }

  await loadItems();
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
card.querySelector(".complete-btn").addEventListener("click", async () => {
  await updateItemInDB(item.id, { completed: !item.completed });
  await loadItems();
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
card.querySelector(".delete-btn").addEventListener("click", async () => {
  await deleteItemInDB(item.id);
  await loadItems();
});

listSection.appendChild(card);
});
}

// Search
document.getElementById("searchInput").addEventListener("input", e => {
renderItems(e.target.value);
});

// Initial render
loadItems();