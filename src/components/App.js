import React, { createContext, useContext, useReducer } from "react";
import "../styles/App.css";

const initialCart = [
	{
		id: 1,
		title: "Samsung Galaxy S7",
		price: 599.99,
		img: "https://res.cloudinary.com/diqqf3eq2/image/upload/v1583368215/phone-2_ohtt5s.png",
		amount: 1,
	},
	{
		id: 2,
		title: "Google Pixel",
		price: 499.99,
		img: "https://res.cloudinary.com/diqqf3eq2/image/upload/v1583371867/phone-1_gvesln.png",
		amount: 1,
	},
	{
		id: 3,
		title: "Xiaomi Redmi Note 2",
		price: 699.99,
		img: "https://res.cloudinary.com/diqqf3eq2/image/upload/v1583368224/phone-3_h2s6fo.png",
		amount: 1,
	},
];

const CartContext = createContext(null);

function cartReducer(state, action) {
	switch (action.type) {
		case "increment":
			return state.map((item) =>
				item.id === action.id ? { ...item, amount: item.amount + 1 } : item
			);
		case "decrement":
			return state
				.map((item) =>
					item.id === action.id ? { ...item, amount: item.amount - 1 } : item
				)
				.filter((item) => item.amount > 0);
		case "remove":
			return state.filter((item) => item.id !== action.id);
		case "clear":
			return [];
		default:
			return state;
	}
}

function CartProvider({ children }) {
	const [items, dispatch] = useReducer(cartReducer, initialCart);
	const itemCount = items.reduce((count, item) => count + item.amount, 0);
	const total = items.reduce((amount, item) => amount + item.price * item.amount, 0);

	return (
		<CartContext.Provider value={{ items, dispatch, itemCount, total }}>
			{children}
		</CartContext.Provider>
	);
}

function CartIcon() {
	return (
		<svg aria-hidden="true" viewBox="0 0 32 32" className="cart-icon">
			<path d="M4 6h3l3.2 14.1a2 2 0 0 0 2 1.6h11.5a2 2 0 0 0 1.9-1.4L29 11H9" />
			<circle cx="13" cy="26" r="1.7" />
			<circle cx="24" cy="26" r="1.7" />
		</svg>
	);
}

function Navbar() {
	const { itemCount } = useContext(CartContext);

	return (
		<header className="topbar">
			<a className="wordmark" href="#main" aria-label="useReducer cart home">
				<span className="wordmark-mark">u</span>
				<span>useReducer</span>
			</a>
			<div className="nav-cart" aria-label={`Cart, ${itemCount} items`}>
				<CartIcon />
				<span className="nav-cart-count" id="nav-cart-item-count" aria-live="polite">
					{itemCount}
				</span>
			</div>
		</header>
	);
}

function CartItem({ item, dispatch }) {
	return (
		<li className="cart-item">
			<div className="product-image-wrap">
				<img src={item.img} alt={item.title} className="product-image" />
			</div>
			<div className="item-details">
				<div className="item-copy">
					<h2>{item.title}</h2>
					<p className="item-price" id={`cart-item-price-${item.id}`}>
						${item.price.toFixed(2)}
					</p>
					<button
						className="remove-item"
						type="button"
						onClick={() => dispatch({ type: "remove", id: item.id })}
						aria-label={`Remove ${item.title} from cart`}
					>
						Remove
					</button>
				</div>
				<div className="quantity-control" aria-label={`${item.title} quantity`}>
					<button
						className="quantity-button"
						type="button"
						id={`decrement-btn-${item.id}`}
						onClick={() => dispatch({ type: "decrement", id: item.id })}
						aria-label={`Decrease ${item.title} quantity`}
					>
						−
					</button>
					<span id={`cart-amount-${item.id}`} aria-live="polite">
						{item.amount}
					</span>
					<button
						className="quantity-button"
						type="button"
						id={`increment-btn-${item.id}`}
						onClick={() => dispatch({ type: "increment", id: item.id })}
						aria-label={`Increase ${item.title} quantity`}
					>
						+
					</button>
				</div>
			</div>
		</li>
	);
}

function Cart() {
	const { items, dispatch, itemCount, total } = useContext(CartContext);

	return (
		<main id="main" className="page-shell">
			<section className="cart-heading" aria-labelledby="page-title">
				<div>
					<p className="eyebrow">YOUR SELECTION</p>
					<h1 id="page-title">Shopping cart</h1>
				</div>
				<p className="item-summary">{itemCount} {itemCount === 1 ? "item" : "items"}</p>
			</section>

			{items.length === 0 ? (
				<section className="empty-cart" aria-live="polite">
					<div className="empty-cart-icon"><CartIcon /></div>
					<h2>Cart is currently empty</h2>
					<p>Your next favorite thing is still out there.</p>
				</section>
			) : (
				<>
					<ul id="cart-items-list" className="cart-items-list">
						{items.map((item) => (
							<CartItem key={item.id} item={item} dispatch={dispatch} />
						))}
					</ul>
					<section className="cart-footer" aria-label="Order total">
						<div className="total-copy">
							<span className="total-label">Total</span>
							<span className="total-note">Taxes and shipping calculated at checkout</span>
						</div>
						<p className="total-amount" id="cart-total-amount">${total.toFixed(2)}</p>
					</section>
					<button
						className="clear-cart"
						id="clear-all-cart"
						type="button"
						onClick={() => dispatch({ type: "clear" })}
					>
						Clear cart
					</button>
				</>
			)}
		</main>
	);
}

export default function App() {
	return (
		<CartProvider>
			<Navbar />
			<Cart />
		</CartProvider>
	);
}

