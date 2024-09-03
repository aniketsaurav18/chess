const LandingPage = () => {
  const handlePlayNow = () => {
    window.location.href = "/game";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-4">
        <h1 className="text-6xl font-extrabold text-white mb-4">
          Chess Master
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Dive into the ultimate multiplayer chess experience.
        </p>
        <button
          className="bg-green-500 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-green-400 transition"
          onClick={handlePlayNow}
        >
          Play Now
        </button>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-white mb-2">
                Real-time Play
              </h3>
              <p className="text-gray-400">
                Challenge opponents in real-time and test your skills.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-white mb-2">
                Dark Themed Boards
              </h3>
              <p className="text-gray-400">
                Enjoy a sleek, dark-themed board with customizable elements.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-white mb-2">
                Analyze Your Game
              </h3>
              <p className="text-gray-400">
                Improve with powerful analysis tools and move-by-move reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="flex flex-col items-center justify-center text-center py-20 bg-gray-800">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Master Your Game?
        </h2>
        <button className="bg-green-500 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-green-400 transition">
          Join Us
        </button>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-center">
        <p className="text-gray-500">
          © 2024 Chess Master. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
