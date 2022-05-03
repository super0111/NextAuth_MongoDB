import styles from '../../styles/Home.module.css';
import HomeFooter from '../HomeFooter';
import NavbarTop from '../NavbarTop';

const Layout = ({ children }) => {
	return (
		<>
			<NavbarTop />
			<div className={styles.container} >
				<main className={styles.main} >
					{children}
				</main>
			</div>
			{/* <HomeFooter/> */}
		</>
	);
};

export default Layout;
