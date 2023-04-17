const NotSupported = () => {
  return (
    <div className="flex flex-col justify-center sm:hidden h-screen text-orange-200 px-[26px] gap-3 font-semibold">
      <h1 className="text-[26px] text-shadow-orange-200">
        Mobile is not supported.
      </h1>
      <h3 className="text-base text-shadow-orange-200">
        To interact with the Spice dApp, please use a desktop.
      </h3>
    </div>
  );
};

export default NotSupported;
