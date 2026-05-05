let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* Live Validation */
function validateName() {
	let name = document.getElementById("name").value.trim();
	let nameError = document.getElementById("nameError");

	let namePattern = /^[A-Za-z ]+$/; // Only letters and spaces

	if (name === "") {
		nameError.innerText = "Item name is required";
	} else if (!namePattern.test(name)) {
		nameError.innerText = "Item name must contain only letters";
	} else {
		nameError.innerText = "";
	}
}


function validatePrice() {
	let price = document.getElementById("price").value;
	document.getElementById("priceError").innerText =
		price <= 0 ? "Price must be greater than 0" : "";
}

function validateQty() {
	let qty = document.getElementById("qty").value;
	document.getElementById("qtyError").innerText =
		qty <= 0 ? "Quantity must be greater than 0" : "";
}

/* Add Item */
function addItem() {
	let name = document.getElementById("name").value.trim();
	let price = Number(document.getElementById("price").value);
	let qty = Number(document.getElementById("qty").value);

	validateName();
	validatePrice();
	validateQty();

	if (name === "" || price <= 0 || qty <= 0) {
		alert("Please correct the errors before submitting");
		return;
	}

	let cart = JSON.parse(localStorage.getItem("cart")) || [];

	// Find existing item (case-insensitive)
	let existingItem = cart.find(item => item.name.toLowerCase() === name.toLowerCase());

	if (existingItem) {
		// If price changed, update it
		if (existingItem.price !== price) {
			existingItem.price = price;
		}

		// Increase quantity
		existingItem.qty += qty;

		alert(
			`Item already exists.\n` +
			`Price updated to: ${existingItem.price}\n` +
			`New quantity: ${existingItem.qty}`
		);
	} else {
		cart.push({ name, price, qty });
		alert(`Item Added Successfully!\n\nName: ${name}\nPrice: ${price}\nQuantity: ${qty}`);
	}

	localStorage.setItem("cart", JSON.stringify(cart));

	document.getElementById("name").value = "";
	document.getElementById("price").value = "";
	document.getElementById("qty").value = "";
}


/* Display Items */
function displayItems() {
	let tableBody = document.getElementById("tableBody");
	let cart = JSON.parse(localStorage.getItem("cart")) || [];

	tableBody.innerHTML = "";

	if (cart.length === 0) {
		tableBody.innerHTML = `
			<tr>
				<td colspan="5">No items in cart</td>
			</tr>`;
		return;
	}

	cart.forEach((item, index) => {
		let total = item.price * item.qty;
		tableBody.innerHTML += `
			<tr>
				<td>${item.name}</td>
				<td>${item.price}</td>
				<td>${item.qty}</td>
				<td>${total}</td>
				<td>
					<button onclick="deleteItem(${index})">Delete</button>
				</td>
			</tr>`;
	});
}
function deleteItem(index) {
	let cart = JSON.parse(localStorage.getItem("cart")) || [];

	// Remove the selected item
	cart.splice(index, 1);

	// Save updated cart
	localStorage.setItem("cart", JSON.stringify(cart));

	// Refresh table
	displayItems();
}
