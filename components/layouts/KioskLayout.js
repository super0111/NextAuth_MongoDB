import styles from '../../styles/Home.module.css';

const KioskLayout = ({ children }) => {
	return (
		<>
			<div className="flex flex-col items-center bg-gradient-to-b from-cyan-500 to-blue-500" >
				<main className={styles.kioskMain} >
					{children}
				</main>
			</div>
		</>
	);
};

export default KioskLayout;
