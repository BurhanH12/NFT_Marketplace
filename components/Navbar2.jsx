import React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";

const Navbar2 = () => {
  return (
    <div className="fixed top-20 left-0 w-full h-14 flex bg-[#2a3849] text-white hover:rounded-none-lg z-50 md:z-20 md:pt-0">
      <NavigationMenu>
        <NavigationMenuList className="justify-start gap-x-8">
          <NavigationMenuItem>
            <Link href="/discover" legacyBehavior passHref>
              <NavigationMenuLink className={`${navigationMenuTriggerStyle()} font-serif text-lg ml-5`}>
                Discover
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/collections" legacyBehavior passHref>
              <NavigationMenuLink className={`${navigationMenuTriggerStyle()} font-serif text-lg`}>
                Collections
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/featuredSeller" legacyBehavior passHref>
              <NavigationMenuLink className={`${navigationMenuTriggerStyle()} font-serif text-lg`}>
                Featured Seller
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default Navbar2;
