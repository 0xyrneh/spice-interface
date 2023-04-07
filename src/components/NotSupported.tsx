const NotSupported = () => {
  return (
    <div className="flex flex-col justify-center md:hidden h-screen text-yellow-light px-[26px] gap-3 font-semibold">
      <h1 className="text-[26px] font-Sanomat text-shadow-yellow-light">
        Mobile is not supported.
      </h1>
      <h3 className="text-base font-SuisseIntl text-shadow-yellow-light">
        To interact with the Spice dApp, please use a desktop.
      </h3>
    </div>
  );
};

export default NotSupported;
