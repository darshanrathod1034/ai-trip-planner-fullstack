import React from "react";
import { darshan, logo, world } from "../assets/assets";


const Footer = () => {
  return (
    <footer className="absolute w-full border-t border-solid border-gray-300 px-4 pt-10 text-center md:pt-8 lg:pt-14">
        {/* 1st div */}
        <div className="mx-auto flex max-w-screen-xl flex-wrap justify-center gap-12 md:justify-between">
          {/* a div */}
          <div>
            {/* i div */}
            <div className="flex justify-center gap-3 md:justify-start">
              <img
                src={logo}
                alt="logo"
                // width={20}
                // height={20}
                className="h-15 items-center"
              />
            </div>
            {/* ii div */}
            <div className="mt-4 flex flex-col gap-5">
              <h3>
              <p className="max-w-[23rem] text-center text-gray-600 md:text-start">
                
                Turn your next trip into a hassle-free experience with Trip Planner.
                
              </p>
              </h3>
            </div>
          </div>
          {/* b div */}
          <div className="grid grid-cols-2 gap-12 xl:grid-cols-3">
            <ul className="flex flex-col gap-3">
              <li className="font-bold">Legal</li>
              <li>
                <a className="hover:underline" href="/terms">
                <h3>
                  Terms & Conditions
                  </h3>
                </a>
              </li>
              <li>
                <a className="hover:underline" href="/privacy">
                <h3>
                  Privacy Policy
                  </h3>
                </a>
              </li>
            </ul>
            <ul className="flex flex-col gap-3">
              <li className="font-bold">Support</li>
              <li>
                <a className="hover:underline" href="/terms">
                <h3>
                  Contact Us
                  </h3>
                </a>
              </li>
              <li>
                <a className="hover:underline" href="/privacy">
                <h3>
                  B2B Integrations
                  </h3>
                </a>
              </li>
            </ul>
            <ul className="flex flex-col gap-3">
              <li className="font-bold">Itineraries</li>
              <li>
                <a className="hover:underline" href="/terms">
                <h3>
                  Community Trips
                  </h3>
                </a>
              </li>
              <li>
                <a className="hover:underline" href="/privacy">
                <h3>
                  Find Destinations
                  </h3>
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* 2nd div */}
        <div className=" flex items-center justify-between mx-auto mt-12 max-w-screen-xl border-t border-solid border-gray-300 py-7 text-center text-gray-600 md:text-start">
          
            <h3>
            © 2025 Trip Planner. All rights reserved | Developed by Darshan Rathod & Tandel Deep
            </h3>
            <div className="flex justify-around gap-5">
            <img
                    src={darshan}
                    alt="User"
                    className="w-20 h-20 rounded-full object-cover object-top"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User"
                    className="w-20 h-20 rounded-full"
                  />
            </div>
           
        </div>
      </footer>
  );
};

export default Footer;
