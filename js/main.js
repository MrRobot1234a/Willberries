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
	modalWindow.style.overflow = `hidden`;
	body.style.overflow = `hidden`;
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

		document.querySelector(`${attributes}`).scrollIntoView({
			block: `start`,
			behavior: `smooth`
		});
	});
});	
