import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="w-screen relative pb-10 pt-20 lg:pt-30 px-5 lg:px-0">
      <div
        className="relative max-w-7xl h-178.5 mx-auto overflow-hidden text-white rounded-[50px] px-5 flex items-end justify-center lg:justify-start pb-6 lg:pb-20"
        style={{
          backgroundImage: "url(/images/home-hero-bg.avif)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="w-81.5 h-90 bg-primary/80 p-3.5 rounded-xl flex flex-col items-center justify-between">
          <div className="space-y-1.5">
            <h1 className="text-lg font-roboto-mono font-bold underline">
              MEET THE GLAZER COLLECTION
            </h1>
            <p className="text-base text-center lg:text-left">
              Five creamy lip & cheek blushes in Berry, Peachy, Earthy, Sassy,
              Savvy
            </p>
          </div>
          <img src="/images/glazer.avif" alt="Glazer Collection" width={217} />
          <Link
            href={"/products/glazer-blush"}
            className="w-full bg-white text-primary font-bold text-sm md:text-xl rounded-xl py-2.5 flex items-center justify-center cursor-pointer transition-colors duration-300 hover:bg-[#f5f2f3]"
          >
            ORDER NOW
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
