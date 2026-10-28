"use client";

import {
  Camera,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  ShoppingBasket,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import UserAvatar from "./user-avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import CartItems from "./cart-items";
import { useCart } from "@/contexts/cart/cart-context";
import { formatToNaira } from "@/lib/utils";
import { useUserContext } from "@/contexts/user/user-context";
import ProfilePictureModal from "./profile-picture-modal";
import type { UserRole } from "@/types";
import { useLogout } from "@/hooks/auth/use-logout";

const navLinks = [
  { name: "Shop", href: "/shop" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Shade Finder", href: "/shade-finder" },
];

const ADMIN_ROLES = new Set<UserRole>(["admin", "staff"]);

const Navbar = () => {
  const pathname = usePathname();
  const { user } = useUserContext();
  const { totalItems, totalPrice } = useCart();
  const { logout, isLoading } = useLogout();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isProfilePictureModalOpen, setIsProfilePictureModalOpen] =
    useState<boolean>(false);
  const [showNavbar, setShowNavbar] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const [scrolledUp, setScrolledUp] = useState<boolean>(false);
  const isActive = (href: string) => pathname === href;
  const isHomepage = pathname === "/";
  const navColorClass =
    !pathname && !scrolledUp ? "text-black text-white" : "text-black";
  const canAccessAdmin = user ? ADMIN_ROLES.has(user.role) : false;

  const handleProfilePictureModalClose = () => {
    setIsProfilePictureModalOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowNavbar(false);
      }

      if (currentScrollY < lastScrollY) {
        setShowNavbar(true);
        setScrolledUp(currentScrollY > 20);
      }

      if (currentScrollY <= 10) {
        setScrolledUp(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        } ${scrolledUp ? "bg-white shadow-md py-3" : "bg-transparent py-5"}`}
      >
        <div
          className={`max-w-7xl mx-auto flex items-center justify-between text-base px-4 lg:px-0 ${navColorClass}`}
        >
          <Link href={"/"} className="cursor-pointer">
            <Image
              src={"/logo.png"}
              alt="The Shine Cartel Logo"
              width={254}
              height={77}
              className="w-36 h-11 md:w-63.5 md:h-19 object-cover"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-12 font-inter">
            {navLinks.map((link) => (
              <Link
                href={link.href}
                key={link.href}
                className={`transition-all duration-300 cursor-pointer hover:text-primary ${
                  isActive(link.href) ? "text-primary underline" : navColorClass
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className={`flex items-center gap-5 md:gap-8 ${navColorClass}`}>
            {canAccessAdmin && (
              <Link
                href="/admin"
                aria-label="Open admin dashboard"
                className={`flex items-center gap-2 transition-colors duration-300 hover:text-primary ${
                  pathname.startsWith("/admin") ? "text-primary" : "text-black"
                }`}
              >
                <span className={`hidden xl:inline ${navColorClass}`}>
                  Admin
                </span>
              </Link>
            )}

            <Popover>
              <PopoverTrigger className="relative">
                <ShoppingBasket
                  size={24}
                  className={`cursor-pointer transition-colors duration-300 hover:text-primary ${navColorClass}`}
                />
                {totalItems > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">
                    {totalItems}
                  </span>
                )}
              </PopoverTrigger>
              <PopoverContent align="end" className="w-86 p-4">
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <h2 className="font-roboto-mono text-sm font-medium text-primary">
                      The Shine Cartel Cart
                    </h2>
                    <span className="text-xs text-secondary">
                      {totalItems} item{totalItems === 1 ? "" : "s"}
                    </span>
                  </div>

                  <div className="max-h-86 overflow-y-auto pr-1">
                    <CartItems compact maxItems={3} />
                  </div>

                  <div className="flex items-center justify-between border-t border-[#E5E5E5] pt-3 text-sm">
                    <span className="text-secondary">Subtotal</span>
                    <span className="font-semibold text-primary">
                      {formatToNaira(totalPrice)}
                    </span>
                  </div>

                  {user ? (
                    <Link
                      href="/cart"
                      className="w-full flex items-center justify-center rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/80"
                    >
                      View cart
                    </Link>
                  ) : (
                    <Link
                      href="/sign-in"
                      className="w-full flex items-center justify-center rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/80"
                    >
                      Sign in
                    </Link>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            {user ? (
              <Popover>
                <PopoverTrigger className="hidden lg:block">
                  <UserAvatar
                    name={user.name}
                    seed={user.email}
                    src={user.profile_image_url}
                    className="h-8 w-8 cursor-pointer"
                  />
                </PopoverTrigger>
                <PopoverContent className="bg-[#E2E8F0]">
                  <div className="flex flex-col items-center">
                    <div className="relative text-black hover:text-[#0A66C2] cursor-pointer">
                      <UserAvatar
                        name={user.name}
                        seed={user.email}
                        src={user.profile_image_url}
                        className="h-10 w-10"
                      />
                      <div
                        className="absolute -right-2.5 -bottom-2 w-6 h-6 rounded-full flex items-center justify-center bg-white"
                        onClick={() => setIsProfilePictureModalOpen(true)}
                        aria-label="Edit profile picture"
                      >
                        <Camera size={14} color="#0000FF" />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 mt-2">
                      <h2>Hi! {user.name.split(" ")[0]}</h2>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="rounded-xl bg-white flex items-center justify-center px-2.5 py-1.5 mt-3 w-45 text-gray-600 duration-300 transition-all hover:bg-neutral-100 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 ">My Profile</div>
                    </Link>
                    <p
                      onClick={() => logout()}
                      className="flex items-center gap-2 text-xs text-red-500 cursor-pointer duration-300 transition-all hover:text-red-700 my-2"
                    >
                      <LogOut size={14} />
                      {isLoading ? "Signing out..." : "Sign Out"}
                    </p>
                    {/* <button
                    className="rounded-xl bg-white flex items-center justify-center px-2.5 py-1.5 my-3 w-45 text-gray-600 duration-300 transition-all hover:text-red-500 cursor-pointer"
                    onClick={() => logout()}
                  >
                    <div className="flex items-center gap-2 ">
                      <LogOut size={14} />
                      {isLoading ? "Signing out..." : "Sign Out"}
                    </div>
                  </button> */}
                    <div className="flex items-center gap-1.5 text-black text-[10px]">
                      <Link
                        href="/privacy-policy"
                        className="cursor-pointer transition-all duration-300 hover:text-blue-700"
                      >
                        Privacy Policy
                      </Link>
                      <span className="bg-black w-0.5 h-0.5 rounded-full" />
                      <Link
                        href="/terms-of-service"
                        className="cursor-pointer transition-all duration-300 hover:text-blue-700"
                      >
                        Terms of Service
                      </Link>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Link href={"/sign-in"} className="hidden lg:block">
                <button className="bg-primary cursor-pointer w-25 rounded-md shadow-md text-white text-sm md:flex items-center justify-center py-1.5 px-2 transition-all duration-300 hover:bg-primary/80">
                  Sign in
                </button>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label={isOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={isOpen}
              className="flex h-11 w-11 items-center justify-center rounded-full
    transition-colors hover:bg-black/5 lg:hidden"
            >
              {isOpen ? (
                <X size={24} className={navColorClass} />
              ) : (
                <Menu size={24} className={navColorClass} />
              )}
            </button>
          </div>
        </div>
      </header>

      {isOpen && (
        <div>
          {/* Mobile navigation */}
          <div
            className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${
              isOpen
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            {/* Backdrop */}
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Full-screen navigation panel */}
            <aside
              aria-label="Mobile navigation"
              className={`absolute inset-y-0 left-0 w-full max-w-md overflow-y-auto
      bg-gradient-to-br from-[#111111] via-[#181818] to-[#050505]
      text-white shadow-2xl
      transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
      ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
              <div className="min-h-full flex flex-col px-6 pb-8 pt-6">
                {/* Menu header */}
                <div className="flex items-center justify-between">
                  <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    aria-label="The Shine Cartel home"
                  >
                    <Image
                      src="/logo.png"
                      alt="The Shine Cartel Logo"
                      width={103}
                      height={103}
                      className="w-36 h-11 object-cover"
                    />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close navigation"
                    className="flex h-11 w-11 items-center justify-center rounded-full
            border border-white/10 bg-white/5
            transition-colors hover:bg-white/10"
                  >
                    <X size={22} />
                  </button>
                </div>

                {/* User profile */}
                {user && (
                  <div className="mt-10 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="relative shrink-0">
                      <UserAvatar
                        name={user.name}
                        seed={user.email}
                        src={user.profile_image_url}
                        className="h-12 w-12"
                      />

                      <button
                        type="button"
                        onClick={() => setIsProfilePictureModalOpen(true)}
                        aria-label="Edit profile picture"
                        className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center
                rounded-full bg-white text-black shadow-md"
                      >
                        <Camera size={12} />
                      </button>
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white">
                        Hi! {user.name.split(" ")[0]}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-white/50">
                        {user.email}
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <nav className="mt-10">
                  <p className="mb-3 px-1 font-roboto-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                    Menu
                  </p>

                  <div className="divide-y divide-white/10 border-y border-white/10">
                    {navLinks.map((link) => {
                      const active = isActive(link.href);

                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex min-h-14 items-center justify-between
                  px-1 py-4 font-inter text-base transition-all duration-200
                  ${
                    active
                      ? "font-medium text-primary"
                      : "text-white/90 hover:pl-2 hover:text-white"
                  }`}
                        >
                          <span>{link.name}</span>

                          <span
                            className={`h-1.5 w-1.5 rounded-full bg-primary transition-opacity ${
                              active ? "opacity-100" : "opacity-0"
                            }`}
                          />
                        </Link>
                      );
                    })}

                    {canAccessAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsOpen(false)}
                        className={`flex min-h-14 items-center justify-between
                px-1 py-4 font-inter text-base transition-all duration-200
                ${
                  pathname.startsWith("/admin")
                    ? "font-medium text-primary"
                    : "text-white/90 hover:pl-2 hover:text-white"
                }`}
                      >
                        <span>Admin Dashboard</span>

                        <LayoutDashboard size={17} className="opacity-60" />
                      </Link>
                    )}
                  </div>
                </nav>

                {/* Bottom actions */}
                <div className="mt-auto pt-12">
                  {user ? (
                    <div className="space-y-3">
                      <Link
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex min-h-12 w-full items-center justify-center rounded-xl
                border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium
                text-white transition-colors hover:bg-white/10"
                      >
                        My Profile
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setIsOpen(false);
                          logout();
                        }}
                        disabled={isLoading}
                        className="flex min-h-12 w-full items-center justify-center gap-2
                rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium
                text-red-400 transition-colors hover:bg-red-500/20
                disabled:opacity-50"
                      >
                        <LogOut size={16} />
                        {isLoading ? "Signing out..." : "Sign Out"}
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/sign-in"
                      onClick={() => setIsOpen(false)}
                      className="flex min-h-12 w-full items-center justify-center rounded-xl
              bg-primary px-4 py-3 text-sm font-semibold text-white
              shadow-lg transition-colors hover:bg-primary/80"
                    >
                      Sign In
                    </Link>
                  )}

                  {/* Footer links */}
                  <div className="mt-8 flex items-center justify-center gap-3 text-[10px] text-white/40">
                    <Link
                      href="/privacy-policy"
                      onClick={() => setIsOpen(false)}
                      className="transition-colors hover:text-white"
                    >
                      Privacy Policy
                    </Link>

                    <span className="h-1 w-1 rounded-full bg-white/20" />

                    <Link
                      href="/terms-of-service"
                      onClick={() => setIsOpen(false)}
                      className="transition-colors hover:text-white"
                    >
                      Terms of Service
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}

      <ProfilePictureModal
        isOpen={isProfilePictureModalOpen}
        onClose={handleProfilePictureModalClose}
      />
    </>
  );
};

export default Navbar;
