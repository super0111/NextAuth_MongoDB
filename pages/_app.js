import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/layouts/Layout';
import KioskLayout from '../components/layouts/KioskLayout';
import AdminLayout from '../components/layouts/AdminLayout';
import FullPageLoader from '../components/FullPageLoader'
import {  SessionProvider, useSession, signIn } from 'next-auth/react';
import { UserAuthProvider} from '../contexts/AuthContext'; 
import '../styles/globals.css';
import 'tailwindcss/tailwind.css';


function Auth({ children }) {
	const {data: session, status} = useSession()
	const isUser = !!session?.user
	useEffect(() => {
	  if (status === "loading") return // Do nothing while loading
	  if (!isUser) signIn() // If not authenticated, force log in
	}, [isUser, status])
  
	if (isUser) {
	  return children
	}
  
	// Session is being fetched, or no user.
	// If no user, useEffect() will redirect.
	return <FullPageLoader/>
}

function MyApp({ Component, pageProps:{session, ...pageProps} }) {
	const router = useRouter();
	const [user, setUser] = useState(null);  
		return (
		<SessionProvider session={pageProps.session}>
			{router.pathname.startsWith('/app/') ? (
				<Auth>
					< UserAuthProvider>
						<AdminLayout>
							<Component {...pageProps}></Component>
						</AdminLayout>
					</ UserAuthProvider>
				</Auth>
			) : router.pathname.startsWith('/kiosks') ?(
				<>
					<KioskLayout>
						<Component {...pageProps} />
					</KioskLayout>
			 	 </>

			):router.pathname.startsWith('/walls') ?(
				<>
					
					<Component {...pageProps} />
			 	 </>

			):(
			  <>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			  </>
			)}
		</SessionProvider >
	);
}

export default MyApp;
