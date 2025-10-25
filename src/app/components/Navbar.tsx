import "./Navbar.css";

export default function Navbar() {
	return (
		<nav className="navbar">
			<ul className="nav-list">
				<li>
					<a href="/" className="navbar-title">Adon Omeri</a>
				</li>
				<li>
					<a href="/wallpapers" className="link">Wallpapers</a>
				</li>
				<li>
					<a href="#" className="link">Contact</a>
				</li>
			</ul>
		</nav>
	);
}
