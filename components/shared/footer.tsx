import Image from "next/image";
import Link from "next/link";
import { FaCopyright, FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="w-screen bg-secondary-background">
      <div className="max-w-7xl mx-auto pt-11 lg:pt-12 pb-7 lg:pb-16 overflow-hidden text-white font-roboto-mono text-xl">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between mb-25 gap-21 lg:gap-0">
          <div className="max-w-52 flex flex-col items-center lg:items-start gap-5 lg:-mt-8 mb-5 lg:mb-0">
            <Image
              src="/logo.png"
              alt="The Shine Cartel Logo"
              width={189}
              height={57}
            />
            <p className="font-medium text-center lg:text-left">
              A softer approach to style and beauty
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-20">
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-6">
              <h3 className="font-bold text-primary">EXPLORE</h3>
              <Link
                href="/shop?categories=Lip+Kits"
                className="cursor-pointer transition-all duration-300 hover:text-primary"
              >
                Shop Lip Kits
              </Link>
              <Link
                href="/shop?categories=Tops"
                className="cursor-pointer transition-all duration-300 hover:text-primary"
              >
                Shop Tops
              </Link>
              <Link
                href="/shade-finder"
                className="cursor-pointer transition-all duration-300 hover:text-primary"
              >
                Find Your Shade
              </Link>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-6">
              <h3 className="font-bold text-primary">THE HOUSE</h3>
              <Link
                href="/about"
                className="cursor-pointer transition-all duration-300 hover:text-primary"
              >
                About Us
              </Link>
              <Link
                href="/community"
                className="cursor-pointer transition-all duration-300 hover:text-primary"
              >
                Community
              </Link>
              <Link
                href="/terms-of-service"
                className="cursor-pointer transition-all duration-300 hover:text-primary"
              >
                Terms of Service
              </Link>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-6">
              <h3 className="font-bold text-primary">SUPPORT</h3>
              <Link
                href="/contact"
                className="cursor-pointer transition-all duration-300 hover:text-primary"
              >
                Contact Us
              </Link>
              <Link
                href="/reviews"
                className="cursor-pointer transition-all duration-300 hover:text-primary"
              >
                Reviews
              </Link>
            </div>
          </div>
          <div className="max-w-82 flex flex-col items-center lg:items-start text-center lg:text-left gap-3">
            <h3 className="font-bold text-primary">A NOTE FROM THE STUDIO</h3>
            <p className="text-sm">
              By clicking “Join Us,” you agree to receive occasional notes on
              new launches, special rewards and exclusive updates. See our{" "}
              <Link
                href="/privacy-policy"
                className="underline text-white cursor-pointer transition-all duration-300 hover:text-primary"
              >
                Privacy Policy
              </Link>{" "}
              &{" "}
              <Link
                href="/terms-of-service"
                className="underline text-white cursor-pointer transition-all duration-300 hover:text-primary"
              >
                Terms of Service
              </Link>
              .
            </p>
            <div className="w-full flex mt-4">
              <input
                type="text"
                placeholder="YOUR EMAIL"
                className="w-full pb-2 border-b border-secondary outline-none bg-transparent text-secondary placeholder:text-secondary font-roboto text-base"
              />
              <button className="bg-transparent pb-2 border-b border-primary flex items-center justify-center text-primary font-roboto text-base cursor-pointer">
                JOIN
              </button>
            </div>
          </div>
        </div>
        <div className="pt-6 px-5 lg:px-0 md:border-t md:border-secondary flex flex-col-reverse md:flex-row items-center justify-between text-secondary gap-8 lg:gap-0">
          <div className="flex items-center gap-0.5">
            <FaCopyright size={20} />
            <p className="text-lg font-semibold">
              2026 THE SHINE CARTEL BEAUTY
            </p>
          </div>
          <div className="flex items-center gap-4">
            <FaInstagram
              href="https://www.instagram.com/The Shine Cartelr.beauty/"
              size={24}
              className="cursor-pointer transition-all duration-300 hover:text-[#F35C97]"
            />
            <FaFacebook
              href="#"
              size={24}
              className="cursor-pointer transition-all duration-300 hover:text-[#F35C97]"
            />
            <FaXTwitter
              href="#"
              size={24}
              className="cursor-pointer transition-all duration-300 hover:text-[#F35C97]"
            />
            <FaTiktok
              href="https://www.tiktok.com/@The Shine Cartel.beauty/"
              size={24}
              className="cursor-pointer transition-all duration-300 hover:text-[#F35C97]"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
