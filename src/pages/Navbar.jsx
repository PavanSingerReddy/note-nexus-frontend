import React, { useEffect } from 'react'
import Logo from "../assets/note-nexus-high-resolution-logo-black-transparent.svg"
import Avatar from "../assets/note-nexus-favicon-black.svg"
// Initialization for ES Users
import {
  Collapse,
  Dropdown,
  initTE,
} from "tw-elements";
import { Link, useNavigate } from 'react-router-dom';
import httpRequestAxiosQueueUtility from '../utils/HttpRequestAxiosQueueUtility';

const Navbar = () => {

  // using use effect to initialize our navbar component
  useEffect(() => {
    initTE({ Collapse, Dropdown });
  }, [])

  // use navigate is used for routing in to different webpages in the react router
  const navigate = useNavigate();

  // when the user clicks on the logout button in the navbar the user logs out
  const logout = (event) => {
    event.preventDefault();
    // importing Logout url using the environment variables in the root directory of this application
    const logouturl = import.meta.env.VITE_LOGOUT_URL
    httpRequestAxiosQueueUtility.post(logouturl)
    navigate("/login")
  }


  return (
    // <!-- Main navigation container -->
    <nav
      className="relative flex w-full flex-wrap items-center justify-between bg-neutral-100 py-2 text-neutral-500 shadow-lg hover:text-neutral-700 focus:text-neutral-700 dark:bg-neutral-600 lg:py-4">
      <div className="flex w-full flex-wrap items-center justify-between px-3">
        <div>
          <Link
            className="mx-2 my-1 flex items-center text-neutral-900 hover:text-neutral-900 focus:text-neutral-900 lg:mb-0 lg:mt-0"
            to={'/'}>
            <img
              src={Logo}  //our own custom logo
              style={{ height: "20px" }}
              alt="Note Nexus Logo"
              loading="lazy" />
          </Link>
        </div>

        {/* <!-- Right elements --> */}
        <div className="relative flex items-center">

          {/* <!-- dropdown container --> */}
          <div
            className="relative"
            data-te-dropdown-ref
            data-te-dropdown-alignment="end">
            {/* <!-- Second dropdown trigger --> */}
            <a
              className="hidden-arrow flex items-center whitespace-nowrap transition duration-150 ease-in-out motion-reduce:transition-none"
              href="#"
              id="User Menu"
              role="button"
              data-te-dropdown-toggle-ref
              aria-expanded="false">
              {/* <!-- User avatar --> */}
              <img
                src={Avatar}
                className="rounded-full"
                style={{ height: "25px", width: "25px" }}
                alt="User Avatar or Logo of Note Nexus"
                loading="lazy" />
            </a>
            {/* <!-- Second dropdown menu --> */}
            <ul
              className="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg dark:bg-neutral-700 [&[data-te-dropdown-show]]:block"
              aria-labelledby="logout"
              data-te-dropdown-menu-ref>
              {/* <!-- Second dropdown menu items --> */}
              <li>
                <a
                  className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
                  href="#"
                  onClick={logout}
                  data-te-dropdown-item-ref>
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar