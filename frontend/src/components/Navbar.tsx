export const Navbar = () => {
  return (
    <header className="w-full px-6 my-5">
      <div className="px-6 mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20  text-white">
          <div className="flex-shrink-0">
            <a href="#" title="" className="text-3xl font-bold">
              <img
                src="/Chess-logo-2.png"
                alt="Chess Logo"
                className="h-16 w-auto"
              />
            </a>
          </div>
          <div>
            <a
              href="#"
              title=""
              className="text-base font-semibold transition-all duration-200 hover:text-opacity-80 mx-3"
            >
              {" "}
              Log in{" "}
            </a>

            <a
              href="/game"
              title=""
              className="inline-flex items-center justify-center px-4 py-2 mx-3 text-base font-semibold text-white bg-green-600 hover:bg-green-700 hover:text-white transition-all duration-200 rounded-lg"
              role="button"
            >
              {" "}
              Try for free{" "}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
