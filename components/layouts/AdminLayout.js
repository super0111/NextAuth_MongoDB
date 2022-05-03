import {signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
  BellIcon,
  CalendarIcon,
  ChartBarIcon,
  FolderIcon,
  OfficeBuildingIcon,
  InboxIcon,
  MenuAlt2Icon,
  UsersIcon,
  UserCircleIcon,
  XIcon,
  VideoCameraIcon,
  ViewGridAddIcon,
  CollectionIcon,
  PencilAltIcon,
  ViewListIcon,
  MapIcon
} from '@heroicons/react/outline'
import { SearchIcon, CogIcon } from '@heroicons/react/solid'
import {  MdDevicesOther, MdGarage } from "react-icons/md"
import {GrMapLocation} from "react-icons/gr"
import Image from 'next/image';
import AppNavTop from '../AppNavTop';
import { useAuthContext } from '../../contexts/AuthContext';

 
  function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
  }

export default function AdminLayout({ children, ...props }) {
    const  auth  = useAuthContext() // AuthContext object.
    const router = useRouter();
    const [selectedMenu, setSelectedMenu] = useState('')

		//Layout 
		const [sidebarOpen, setSidebarOpen] = useState(false)
		const handleSignOut = (e) => {
			e.preventDefault();
			signOut()
      }

    const [navigation, setNavigation] = useState([
      { name: 'Main Dashboard', href: '/app/dashboard', icon: OfficeBuildingIcon, current: router.pathname.includes('/app/dashboard' )? true : false },
      { name: 'Camera Control', href: '/app/cameras/main', icon:  VideoCameraIcon, current:router.pathname.includes('/app/cameras/main') ? true : false },
      { name: 'Garage Access', href: '/app/lists/main', icon: CollectionIcon, current: router.pathname.includes('/app/lists/') ? true : false}
    ])
   
    const mainNavigation = [
      { name: 'Main Dashboard', href: '/app/dashboard', icon: OfficeBuildingIcon, current: router.pathname.includes('/app/dashboard' )? true : false },
      { name: 'Camera Control', href: '/app/cameras/main', icon:  VideoCameraIcon, current:router.pathname.includes('/app/cameras') ? true : false },
      { name: 'Garage Access', href: '/app/lists/main', icon: MdGarage, current: router.pathname.includes('/app/lists/') ? true : false} 
    ]
    const navigationItemsLists= [
      { name: 'Main Dashboard', href: '/app/dashboard', icon: OfficeBuildingIcon, current: router.pathname.includes('/app/dashboard') ? true : false },
      { name: 'Garage Access', href: '/app/lists/main', icon: MdGarage, current: router.pathname.includes('/app/lists/main') ? true : false },
      { name: 'Search Lists', href: '/app/lists/search', icon: SearchIcon, current: router.pathname.includes('/app/lists/search') ? true : false } ,
    ]

    const navigationItemsCamera = [
      { name: 'Main Dashboard', href: '/app/dashboard', icon: OfficeBuildingIcon, current: router.pathname.includes('/app/dashboard') ? true : false },
      { name: 'Camera Control', href: '/app/cameras/main', icon:  VideoCameraIcon, current: router.pathname.includes( '/app/cameras/main' ) ? true : false },
      { name: 'Grid Wall', href: '/app/cameras/grid/?axis=3', icon: ViewGridAddIcon, current: router.pathname.includes(  '/app/cameras/grid/?axis=3') ? true : false },
      
      // { name: '2x2 Grid', href: '/app/cameras/grid?axis=2', icon: ViewGridAddIcon, current: router.pathname === '/app/cameras/grid?axis=2' ? true : false },
      // { name: 'All Cameras', href:  '/app/cameras/manage', icon: ViewListIcon, current: router.pathname === '/app/cameras/manage' ? true :  false },
    ]
    const [navAdmin, setNavAdmin] = useState([
      {name: 'Locations', href:'/app/location', icon: GrMapLocation , current: router.pathname === ('/app/location') ? true : false},
      { name: 'Device Hub', href: '/app/devices', icon:  MdDevicesOther, current: router.pathname.includes('/app/devices') ? true : false },
      { name: 'Triggers', href: '/app/triggers', icon: CogIcon, current: router.pathname === ('/app/triggers') ? true : false},
      { name: 'Garage Lists', href: '/app/lists/manage', icon: ViewListIcon, current: router.pathname.includes('/app/lists/manage') ? true : false } ,
      { name: 'Users', href: '/app/users', icon: UsersIcon, current: router.pathname === ('/app/users' )? true : false },
      { name: 'Camera Walls', href: '/app/manage/wall', icon:  ViewGridAddIcon, current: router.pathname.includes('/app/manage/wall') ? true : false },
    ])
    const userNavigation = [
      // { name: 'Your Profile', href: '/app/profile', },
      // { name: 'Settings', href: '#'  },
      { name: 'Sign out', href: '/login', onClick: (e)=> handleSignOut(e) },
    ]
    useEffect(() => {
      if(router.pathname.includes('/app/cameras')){
        setNavigation(navigationItemsCamera)
      }else if (router.pathname.includes('/app/lists')){
        setNavigation(navigationItemsLists)
      }else{
        setNavigation(mainNavigation)
      }
    }, [router.pathname])
    // console.log(navigation)

    useEffect(() => {
      setSidebarOpen(false)
    }, [router.pathname])
	return (
		<>
		<div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 flex z-40 md:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-shrink-0 flex items-center px-4"> 
                   <Link href="/">
                    <img
                      className="h-16 w-auto"
                      src={"/assets/comp-logo.png"}
                      alt="Comp. Logo"
                    />
                   </Link>
                </div>
                <div className="mt-5 flex-1 h-0 overflow-y-auto">
                  <nav className="px-2 space-y-1">
                    {navigation.map((item) => (
                      <Link  key={item.name}  href={item.href} passHref>
                        <a
                          className={classNames(
                            item.current
                              ? 'bg-gray-200 text-gray-900'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                            'group flex items-center px-2 py-2 text-lg font-medium rounded-md'
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                              'mr-4 flex-shrink-0 h-6 w-6'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      </Link>
                    ))}
                  {auth?.user.userType === 0 &&
                  <>
                  <hr/>
                    {navAdmin.map((item) => (
                       <Link  key={item.name}  href={item.href} passHref>
                        <a
                        className={classNames(
                          // item.current ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                          'group flex items-center px-2 py-2 text-lg font-medium rounded-md'
                        )}
                      >
                        <item.icon
                          className={classNames(
                            item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                            'mr-3 flex-shrink-0 h-6 w-6'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                      </Link>
                  ))}
                  </>
                }
                  </nav>
                  
                </div>
              </div>
            </Transition.Child>
            <div className="flex-shrink-0 w-14" aria-hidden="true">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-col flex-grow border-r border-gray-200 pt-5 bg-white overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
               
                {/* Company Logo */}
                <Link href="/"> 
                  <img
                  className="h-18 w-auto"
                  src={"/assets/comp-logo.png"}
                  alt="Comp Logo"
                />
                </Link>
              
            </div>
            <div className="mt-5 flex-grow flex flex-col">
              <nav className="flex-1 px-2 pb-4 space-y-1">
                {navigation.map((item) => (
                    <Link  key={item.name}  href={item.href} passHref>
                  <a
                  onClick={()=> setSelectedMenu(item.name)}
                    className={classNames(
                      item.name === selectedMenu ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group flex items-center px-2 py-2 text-lg font-medium rounded-md'
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 flex-shrink-0 h-6 w-6'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                </Link>
                ))}
                {auth?.user?.userType === 0 &&
                  <>
                  <hr/>
                    {navAdmin.map((item) => (
                       <Link  key={item.name}  href={item.href} passHref>
                        <a
                         onClick={()=> setSelectedMenu(item.name)}
                        className={classNames(
                          item.name === selectedMenu  ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                          'group flex items-center px-2 py-2 text-lg font-medium rounded-md'
                        )}
                      >
                        <item.icon
                          className={classNames(
                            item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                            'mr-3 flex-shrink-0 h-6 w-6'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    </Link>
                  ))}
                  </>
                }
              </nav>
            </div>
          </div>
        </div>
        <div className="md:pl-64 flex flex-col flex-1">
          <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
            <button
              type="button"
              className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/*Horizontal Nav Section */}
            <div className="flex-1 px-4 flex justify-between z-30">
              <div className="flex-1 flex-row justify-evenly  w-full px-4 py-2 hidden sm:flex md:flex lg:flex">
                  {mainNavigation.map((navItem, idx) => (
                    <Link href={navItem.href} passHref key={idx}>
                    <button
                        key={idx}
                        type="button"
                        // onClick={() => router.push(navItem.href)}
                        className={ navItem.current ?
                          "inline-flex items-center px-3 py-2 border-b-4 border-t-4 shadow-blue-700 shadow-md border-blue-600 text-lg leading-4 font-bold rounded-md  text-black "
                          : 
                          "inline-flex items-center px-3 py-2 border-2 bg-gray-100 border-transparent text-lg leading-4 font-bold rounded-md shadow-md  text-black  border-blue-700 hover:border-4"
                        }>
                        {navItem.name}
                    </button>
                    </Link>
                  ))}
              </div>

              <div className="ml-4 flex items-center md:ml-6">
                {/* <button
                  type="button"
                  className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button> */}

                {/* Profile dropdown */}
                <Menu as="div" className="ml-3 relative">
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                             <Link href={item.href} passHref>
                              <a
                              
                                onClick={item.onClick}
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-lg text-gray-700'
                                )}
                              >
                                {item.name}
                              </a>
                            </Link>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <main className="flex-1" style={{minHeight:'100vh', backgroundColor:'#f1ebff'}}> 
            <div className="py-6">
              <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-2">
                {/* Replace with children content */}
                <div className="py-4 w-full " >
                    {children}
                </div>
                {/* /End replace */}
              </div>
            </div>
          </main>
        </div>
      </div>
	  </>
	);
}


