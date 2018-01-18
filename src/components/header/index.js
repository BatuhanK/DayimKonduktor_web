import { h, Component } from 'preact';
import { Link } from 'preact-router/match';
import style from './style';

const Header = () => (
	<header class={style.header}>
		<h1>KarsRail</h1>
		<nav>
			<Link activeClassName={style.active} href="/">Anasayfa</Link>
		</nav>
	</header>
);
export default Header;
