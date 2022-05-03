/* This page requires Tailwind CSS v2.0+ */
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon, UserCircleIcon} from '@heroicons/react/outline' 
import {signOut, useSession} from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function AppNavTop() {
  const {data: session, status} = useSession()
  const router = useRouter();
  const navigation = [
    { name: 'Cameras', href: '/app/cameras/main', current: router.pathname.includes('/app/cameras') ? true : false },
    { name: 'Lists Management', href: '/app/lists/main', current: router.pathname.includes( '/app/lists') ? true : false  },
    { name: 'Access Control', href: '/app/access', current: router.pathname === '/app/access' ? true : false  },

  ]
  const handleSignOut = (e) => {
    e.preventDefault();
    signOut()
  }
  return (
    <Disclosure as="nav" style={{backgroundColor:'#fff', minHeight:'5rem',}}>
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto pt-2 px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
               
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>

              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start ">
               
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4 ">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current ? 'bg-black text-white text-2xl' : 'text-indigo-600 hover:bg-purple-600 hover:text-white  text-2xl',
                          'px-3 py-2 rounded-md text-xl font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              
                {/* Profile dropdown */}
                <Menu as="div" className="ml-3 relative z-30">
                  <div>
                    <Menu.Button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <span className="sr-only">Open user menu</span>
                      <UserCircleIcon  className="block h-12 w-12 text-black" aria-hidden="true" />
                    </Menu.Button>
                  </div>
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
                    {status === 'authenticated' ?(
                    <>
                       <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/app/dashboard"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Your Dashboard
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Settings
                          </a>
                        )}
                      </Menu.Item>
                    <Menu.Item>
                              {({ active }) => (
                                <a
                                  onClick={(e) => handleSignOut(e)}
                                  className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                >
                                  Sign out
                                </a>
                              )}
                  </Menu.Item>
                   </>
                  ):(
                  <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="/auth/login"
                                  className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                >
                                  Login
                                </a>
                              )}
                  </Menu.Item>
                  )}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
              {/* Mobile Menu Items */}
          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-black hover:bg-purple-600 hover:white',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
