/**
 * Home page component for the skillex application
 * Displays the main landing page with hero section and call-to-action
 */

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-blue-100 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
              Exchange Skills,
              <br />
              <span className="text-primary-600">Build Careers</span>
            </h1>
            <p className="text-xl text-slate-700 mb-8 max-w-3xl mx-auto">
              Connect with professionals to exchange skills through structured learning cohorts and 1:1 swaps. 
              Learn new skills while teaching others in a supportive community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                Start a Skill Swap
              </button>
              <button className="border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold py-3 px-8 rounded-lg transition-colors">
                Browse Matches
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              How skillex Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A structured approach to skill exchange that benefits everyone
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                List Your Skills
              </h3>
              <p className="text-slate-600">
                Share what you can teach and what you want to learn. 
                Set your availability and skill levels.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Get Matched
              </h3>
              <p className="text-slate-600">
                Our algorithm finds perfect skill exchange partners 
                based on complementary skills and availability.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Learn Together
              </h3>
              <p className="text-slate-600">
                Join structured cohorts or 1:1 sessions. 
                Track progress and build lasting professional connections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Skill Exchange Journey?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of professionals who are already exchanging skills and advancing their careers.
          </p>
          <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  );
}
