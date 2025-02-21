import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Rocket, ChevronRight, CheckCircle2, Sparkles, 
  MessageSquare, Brain, Mic, Bot, LineChart, Shield, User 
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/auth/AuthModal';

const LandingPage = () => {
  const { user, isGuest } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const features = [
    {
      icon: <Bot className="w-6 h-6" aria-hidden="true" />,
      title: "AI Career Coach",
      description: "Personalized advice and resume tips—because even geniuses need a little nudge.",
      gradient: "from-secondary-500 to-secondary-600"
    },
    {
      icon: <MessageSquare className="w-6 h-6" aria-hidden="true" />,
      title: "Smart Messaging",
      description: "Standout emails that break the mold (and boring templates).",
      gradient: "from-accent-500 to-accent-600"
    },
    {
      icon: <Mic className="w-6 h-6" aria-hidden="true" />,
      title: "AI Mock Interviews",
      description: "Practice without the awkward pauses—get interview-ready with a smile.",
      gradient: "from-secondary-600 to-accent-500"
    }
  ];

  const journey = [
    { step: "1", title: "Share Your Profile", description: "Upload your resume (we won’t judge if it’s a work in progress)." },
    { step: "2", title: "Get AI Insights", description: "Tailored advice that feels like a secret cheat code." },
    { step: "3", title: "Practice & Prepare", description: "Mock interviews—awkward silences not included." },
    { step: "4", title: "Land Your Dream Job", description: "Apply with confidence and finally treat yourself." }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <Navbar variant="landing" />
      <main>
        <header className="pt-32 pb-20 px-4 bg-gradient-radial from-white via-gray-50/50 to-gray-100/30 text-center">
          <div className="max-w-7xl mx-auto">
            <span className="px-4 py-2 rounded-full bg-secondary-50 text-secondary-600 text-sm font-medium">
              For Students &amp; Recent Graduates (because adulting is hard)
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 my-6">
              <span className="bg-gradient-to-r from-secondary-600 to-accent-500 text-transparent bg-clip-text">
                Your AI Career
              </span>{" "}
              Assistant for{" "}
              <span className="bg-gradient-to-r from-secondary-600 to-accent-500 text-transparent bg-clip-text">
                Success
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
              Get tailored career guidance, craft standout messages, and land your dream job—because your future deserves more than boring advice.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/app">
                <Button variant="primary" size="lg" icon={Rocket} className="group">
                  Start Your Journey
                  <ChevronRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/app/career">
                <Button variant="secondary" size="lg" icon={Brain}>
                  Try AI Career Coach
                </Button>
              </Link>
            </div>
            <div className="mt-12 flex items-center justify-center space-x-8">
              {["AI-Powered", "24/7 Assistance", "Free to Start"].map((msg, i) => (
                <div key={i} className="flex items-center space-x-2 text-gray-600">
                  {i === 0 && <Brain className="w-5 h-5 text-secondary-600" aria-hidden="true" />}
                  {i === 1 && <Bot className="w-5 h-5 text-secondary-600" aria-hidden="true" />}
                  {i === 2 && <Shield className="w-5 h-5 text-secondary-600" aria-hidden="true" />}
                  <span>{msg}</span>
                </div>
              ))}
            </div>
          </div>
        </header>

        <section id="features" className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Complete AI Career Suite</h2>
            <p className="text-xl text-gray-600 mb-16">
              Everything you need to jumpstart your career—with a dash of wit.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((f, i) => (
                <article key={i} className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1 border border-gray-100">
                  <div className={`w-12 h-12 bg-gradient-to-br ${f.gradient} rounded-xl flex items-center justify-center text-white mb-6`}>
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{f.title}</h3>
                  <p className="text-gray-600">{f.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Advanced AI Career Assistant</h2>
            <p className="text-xl text-gray-600 mb-16">
              Cutting-edge AI to supercharge your job search—and maybe save you from a career crisis.
            </p>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-secondary-50 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-secondary-600" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Intelligent Career Guidance</h3>
                    <p className="text-gray-600">
                      Smart advice based on your unique skills—because even geniuses need a nudge.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent-50 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-accent-600" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Dynamic Message Generation</h3>
                    <p className="text-gray-600">
                      Standout emails that break the mold—no snooze-worthy templates here.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                    <LineChart className="w-6 h-6 text-primary-600" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Job Matching</h3>
                    <p className="text-gray-600">
                      Find jobs that fit like your favorite jeans—comfortable, flattering, and just right.
                    </p>
                  </div>
                </div>
              </div>
              <aside className="bg-white rounded-2xl shadow-md p-8 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="px-4 py-2 bg-secondary-500 text-white text-sm font-medium rounded-full">
                    Live Demo
                  </span>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-secondary-50 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-secondary-600" aria-hidden="true" />
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-800">
                        Hi! I'm your AI sidekick—here to boost your resume and give you that extra edge.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 justify-end">
                    <div className="flex-1 bg-secondary-50 rounded-lg p-4">
                      <p className="text-secondary-900">
                        I’m hunting for software engineering roles and need help connecting with hiring managers.
                      </p>
                    </div>
                    <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-secondary-600" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-secondary-50 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-secondary-600" aria-hidden="true" />
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-800">
                        Ready to turn your resume into a showstopper? Let's highlight your strengths and make hiring managers take notice.
                      </p>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 bg-gradient-to-b from-white to-gray-50 text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your AI Career Journey</h2>
            <p className="text-xl text-gray-600 mb-16">Four simple steps to career success—no rocket science, just real results.</p>
            <div className="grid md:grid-cols-4 gap-8">
              {journey.map((item, i) => (
                <article key={i} className="group">
                  <div className="w-12 h-12 bg-gradient-to-r from-secondary-600 to-accent-500 text-white rounded-full flex items-center justify-center text-xl font-semibold mx-auto mb-6 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-gray-50 to-white text-center">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Accelerate Your Career?</h2>
            <p className="text-xl text-gray-600 mb-8">Join thousands of students using AI to land their dream jobs</p>
            <Link to="/app">
              <Button variant="primary" size="lg" icon={Rocket} className="group">
                Get Started Now
                <Sparkles className="w-5 h-5 ml-2 transition-transform group-hover:rotate-12" />
              </Button>
            </Link>
            <div className="mt-8 flex items-center justify-center space-x-8 text-gray-600">
              <div className="flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2 text-secondary-600" aria-hidden="true" />
                <span>Free to Get Started</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2 text-secondary-600" aria-hidden="true" />
                <span>No Credit Card Required</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Rocket className="w-8 h-8 text-secondary-600" aria-hidden="true" />
                <span className="text-xl font-bold bg-gradient-to-r from-secondary-600 to-accent-500 text-transparent bg-clip-text">Propel</span>
              </div>
              <p className="text-gray-600">AI-powered career assistance for students ready to launch their dreams.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a></li>
                <li><a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How it Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">About</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Terms</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p>© 2025 Propel. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default LandingPage;
