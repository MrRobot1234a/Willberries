'use strict';

const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

const buttonCart = document.querySelector(`.button-cart`),
	  modalCart = document.querySelector(`#modal-cart`),
	  modalWindow = document.querySelector(`#modal-window`),
	  modalClose = document.querySelector(`.modal-close`),
	  body = document.querySelector(`body`),
	  parentModalWindow = document.querySelector(`.overlay`);

//Modal Cart
function showModalCart(selector) {
	selector.classList.add(`show`);
	body.style.overflow = `hidden`;
	cart.renderCart();
}

function hideModalCart(selector) {
	selector.classList.remove(`show`);
	body.style.overflow = ``;
}

buttonCart.addEventListener(`click`, (e) => {
	showModalCart(modalCart);
});

modalClose.addEventListener(`click`, (e) => {
	hideModalCart(modalCart);
});

parentModalWindow.addEventListener(`click`, (e) => {
	const target = e.target;

	if (target && target === modalCart) {
		hideModalCart(modalCart);
	}
});

//scroll smooth

const scrollsUp = document.querySelectorAll(`a.scroll-link`);

scrollsUp.forEach(btns => {
	btns.addEventListener(`click`, (e) => {
		e.preventDefault();


		const attributes = btns.getAttribute(`href`);
		// console.log(attributes);

		document.querySelector(`${attributes}`).scrollIntoView({
			block: `start`,
			behavior: `smooth`
		});
	});
});	

//Cards

const more = document.querySelector(`.more`),
	  navigationLink = document.querySelectorAll(`.navigation-link`),
	  longGoodsList = document.querySelector(`.long-goods-list`),
	  footer = document.querySelector(`#footer`);
	
// console.log(more, navigationLink, longGoodsList);

const getGoods = async url => {
	const result = await fetch(url);

	if (!result.ok) {
		throw new Error(`Ошибка: ${result.status}`);
	}

	return await result.json();
};

class Cards {
	constructor(id, img, name, label, description, price, category, gender, parentDiv) {
		this.id = id;
		this.img = img;
		this.name = name;
		this.label = label;
		this.description = description;
		this.price = price;
		this.category = category;
		this.gender = gender;
		this.parentDiv = parentDiv;
	}

	render() {
		const div = document.createElement(`div`);

		div.classList.add(`col-lg-3`, `col-sm-6`);

		div.innerHTML = `
		<div class="goods-card">
			${this.label ? `<span class="label">${this.label}</span>` : ``}
			
			<img src="db/${this.img}" alt="${this.name}" class="goods-image">
			<h3 class="goods-title">${this.name}</h3>
			<p class="goods-description">${this.description}</p>
			<button class="button goods-card-btn add-to-cart" data-id="${this.id}">
				<span class="button-price">${this.price}</span>
			</button>
		</div>
		`;


		this.parentDiv.append(div);
	}
}



more.addEventListener(`click`, (e) => {
	e.preventDefault();
	console.log(`click`);
	
	longGoodsList.textContent = ``;
	document.body.classList.add(`show-goods`);

	getGoods(`db/db.json`)
		.then(data => {
			console.log(data);
			data.forEach(({id, img, name, label, description, price, category, gender}) => {
				new Cards(id, img, name, label, description, price, category, gender, longGoodsList).render();
			});
		});
});


const filter = (key, value) => {
	getGoods(`db/db.json`)
		.then(data => {
			const result = data.filter(good => {
				return good[key] === value;
			});
			return result;
		})
		.then(data => {
			data.forEach(({id, img, name, label, description, price, category, gender}) => {
				new Cards(id, img, name, label, description, price, category, gender, longGoodsList).render();
			});
		});
};


navigationLink.forEach(link => {
	link.addEventListener(`click`, (e) => {
		e.preventDefault();
		longGoodsList.textContent = ``;
		document.body.classList.add(`show-goods`);
		const field = link.getAttribute(`data-field`);
		const value = link.textContent;

		filter(field, value);

		if (value === `All`) {
			getGoods(`db/db.json`)
			.then(data => {
				console.log(data);
				data.forEach(({id, img, name, label, description, price, category, gender}) => {
					new Cards(id, img, name, label, description, price, category, gender, longGoodsList).render();
				});
			});
		}
	});
});


//basket 

const cartTableGoods = document.querySelector(`.cart-table__goods`),
	  cardTableTotal = document.querySelector(`.card-table__total`),
	  cartCount = document.querySelector(`.cart-count`),
	  clearBasket = document.querySelector(`.clear-basket`);



const cart = {
	cartGoods: [],
	renderCart() {
		cartTableGoods.textContent = ``;
		this.cartGoods.forEach(({id, name, price, count}) => {
			const tr = document.createElement(`tr`);
			tr.className = `cart-item`;
			tr.innerHTML = `
				<td>${name}</td>
				<td>${price}$</td>
				<td><button class="cart-btn-minus">-</button></td>
				<td>${count}</td>
				<td><button class="cart-btn-plus">+</button></td>
				<td>${count * price}$</td>
				<td><button class="cart-btn-delete">x</button></td>
			`;
			tr.setAttribute(`id`, id);

			cartTableGoods.append(tr);
		});

		// this.totalCounts();
		
	},
	deleteGood(id) {
		this.cartGoods = this.cartGoods.filter(item => id !== item.id);
		this.renderCart();
	},
	minusGood(id) {
		this.cartGoods.forEach(item => {
			if (item.id === id) {
				if (item.count <= 1) {
					this.deleteGood(id);
				} else {
					item.count--;
				}
				this.renderCart();
			}
		});
	},
	plusGood(id) {
		this.cartGoods.forEach(item => {
			if (item.id === id) {
				item.count++;
				this.renderCart();
				this.totalCounts();
			}
		});
	},
	addCartGoods(id) {
		const goodItem = this.cartGoods.find(item => item.id === id);
		if (goodItem) {
			this.plusGood(id);
		} else {
			this.totalCounts();
			getGoods(`db/db.json`)
				.then(data => data.find(item => item.id === id))
				.then(({id, name, price}) => {
					this.cartGoods.push({
						id,
						name,
						price,
						count: 1
					});
					this.totalCounts();
				});
		}
	},
	totalCounts() {
		let totalGoods = this.cartGoods.reduce((sum, item) => {
			return sum + item.count;
		}, 0);
		if (totalGoods !== 0) {
			cartCount.textContent = totalGoods;
		} else {
			cartCount.textContent = ``;
		}
		
	}
};

cart.totalCounts();

clearBasket.addEventListener(`click`, (e) => {
	cart.cartGoods.splice(0, cart.cartGoods.length);
	cart.renderCart();
	cart.totalCounts();
});

document.body.addEventListener(`click`, (e) => {
	const target = e.target.closest(`.add-to-cart`);
	if (target) {
		cart.addCartGoods(target.getAttribute(`data-id`));
		console.log(target.getAttribute(`data-id`));
		
	}
});

cartTableGoods.addEventListener(`click`, (e) => {
	const target = e.target;
	if (target.tagName === `BUTTON`) {
		const parentId = target.closest(`.cart-item`).getAttribute(`id`);
		if (target.classList.contains(`cart-btn-delete`)) {
			cart.deleteGood(parentId);
			cart.totalCounts();
		}

		if (target.classList.contains(`cart-btn-minus`)) {
			cart.minusGood(parentId);
			cart.totalCounts();
		}

		if (target.classList.contains(`cart-btn-plus`)) {
			cart.plusGood(parentId);
			cart.totalCounts();
		}
	}
});