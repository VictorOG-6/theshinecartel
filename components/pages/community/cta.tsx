import React from "react";

const CTA = () => {
  return (
    <section className="px-5 lg:px-0 py-7 md:py-9">
      <div className="max-w-7xl mx-auto bg-foreground flex flex-col lg:flex-row items-center justify-between pl-5 pr-5 lg:pl-14 lg:pr-4.5 py-8 gap-9.5 lg:gap-0">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-start gap-2.5">
          <h1 className="text-base md:text-xl text-primary font-roboto-mono font-medium">
            JOIN THE FAMILY
          </h1>
          <h2 className="text-[28px] md:text-[38px] leading-9.5 md:leading-10.5 text-black">
            Stay close and personal
          </h2>
          <p className="text-sm md:text-base text-tertiary max-w-71.5 md:max-w-100 lg:max-w-120.5">
            Be the first to know what’s happening at Shine Cartel. Sign up for
            event invites, exclusive discounts, new drops and community moments.
          </p>
        </div>
        <div className="max-w-121.5 flex flex-col gap-11.5 lg:gap-7 text-center lg:text-left text-tertiary text-sm md:text-base">
          <div className="flex flex-col gap-7 lg:gap-4.5">
            <p>
              By entering your email address and clicking “Join Us” you agree to
              receive discounts, stock updates and marketing email messages from
              The Shine Cartel at the email address provided. Unsubscribe at any
              time
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
          <div className="flex flex-col gap-7 lg:gap-4.5">
            <p>
              By entering your phone number and clicking “Join Us” you agree to
              join our exclusive Whatsapp community group chat to engage.
            </p>
            <div className="w-full flex mt-4">
              <input
                type="text"
                placeholder="YOUR MOBILE #"
                className="w-full pb-2 border-b border-secondary outline-none bg-transparent text-secondary placeholder:text-secondary font-roboto text-base"
              />
              <button className="bg-transparent pb-2 border-b border-primary flex items-center justify-center text-primary font-roboto text-base cursor-pointer">
                JOIN
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
