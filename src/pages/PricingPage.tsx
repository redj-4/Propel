import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, CheckCircle2, Building2, Sparkles } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';

const PricingPage = () => {
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <Navbar />
      <main>
        {/* Header Section */}
        <section className="pt-24 pb-20 px-4 text-center bg-gradient-radial from-white via-red-100/50 to-red-200/30">
          <div className="max-w-7xl mx-auto">
            <span className="px-4 py-2 rounded-full bg-red-800 text-white text-sm font-medium">
              Simple, Transparent Pricing
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 my-6">
              Choose the Perfect Plan for Your{" "}
              <span className="bg-gradient-to-r from-red-800 to-red-900 text-transparent bg-clip-text">
                Career Growth
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start for free, upgrade when you're ready, and keep your wallet as happy as your future.
            </p>
          </div>
        </section>

        {/* Pricing Cards Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Free Guest Plan */}
              <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Free Guest</h2>
                <p className="text-3xl font-extrabold text-gray-900 mb-4">
                  Free<span className="text-xl font-medium text-gray-600">/month</span>
                </p>
                <ul className="flex-1 space-y-2 text-left mb-6">
                  <li className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 text-red-800 mr-2" /> Basic AI Messaging
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 text-red-800 mr-2" /> 2 Messages per Day
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 text-red-800 mr-2" /> Essential Features
                  </li>
                </ul>
                <Link to="/app" className="mt-auto">
                  <button className="w-full py-3 px-6 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors">
                    Get Started
                  </button>
                </Link>
              </div>

              {/* Student Plan */}
              <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col border border-red-800 hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Student</h2>
                <p className="text-3xl font-extrabold text-gray-900 mb-4">
                  Free<span className="text-xl font-medium text-gray-600">/month</span>
                </p>
                <p className="text-sm text-gray-500 mb-4">*Available only for signed-in users</p>
                <ul className="flex-1 space-y-2 text-left mb-6">
                  <li className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 text-red-800 mr-2" /> Unlimited AI Messaging
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 text-red-800 mr-2" /> Resume Analysis
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 text-red-800 mr-2" /> Student-Only Features
                  </li>
                </ul>
                {user ? (
                  <Link to="/app">
                    <button className="w-full py-3 px-6 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors">
                      Access Now
                    </button>
                  </Link>
                ) : (
                  <Link to="/app">
                    <button className="w-full py-3 px-6 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors">
                      Sign In to Access
                    </button>
                  </Link>
                )}
              </div>

              {/* Pro Plan */}
              <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col border border-red-800 hover:shadow-lg transition-colors duration-300 transform hover:-translate-y-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Pro</h2>
                <p className="text-3xl font-extrabold text-gray-900 mb-4">
                  $29<span className="text-xl font-medium text-gray-600">/month</span>
                </p>
                <ul className="flex-1 space-y-2 text-left mb-6">
                  <li className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 text-red-800 mr-2" /> All Student Features
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 text-red-800 mr-2" /> AI Career Coach Access
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 text-red-800 mr-2" /> Advanced Resume Analysis
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 text-red-800 mr-2" /> Priority Support
                  </li>
                </ul>
                {user ? (
                  <Link to="/subscribe/pro" className="mt-auto">
                    <button className="w-full py-3 px-6 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors">
                      Subscribe Now
                    </button>
                  </Link>
                ) : (
                  <Link to="/app" className="mt-auto">
                    <button className="w-full py-3 px-6 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors">
                      Sign In to Subscribe
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Comparison Table Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Compare Plans in Detail
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-t border-gray-200">
                    <th className="py-5 px-4 text-left text-gray-500 font-medium">Features</th>
                    <th className="py-5 px-4 text-center text-gray-900 font-semibold">
                      Free Guest
                    </th>
                    <th className="py-5 px-4 text-center text-red-800 font-semibold">
                      Student
                    </th>
                    <th className="py-5 px-4 text-center text-gray-900 font-semibold">
                      Pro
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    ["AI Message Generation", "2 per day", "Unlimited", "Unlimited"],
                    ["Resume Analysis", "Basic", "Advanced", "Custom"],
                    ["Message Templates", "Basic", "Premium", "Custom"],
                    ["Response Time", "Standard", "Priority", "Dedicated"],
                    ["Save & Edit History", "—", "✓", "✓"],
                    ["AI Customization", "—", "✓", "✓"],
                    ["Industry Optimization", "—", "✓", "✓"],
                    ["API Access", "—", "—", "✓"]
                  ].map(([feature, free, student, pro], i) => (
                    <tr key={i}>
                      <td className="py-4 px-4 text-gray-900">{feature}</td>
                      <td className="py-4 px-4 text-center">{free}</td>
                      <td className="py-4 px-4 text-center text-red-800">{student}</td>
                      <td className="py-4 px-4 text-center">{pro}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-8">
              {[
                {
                  question: "What is the Free Guest plan?",
                  answer: "It provides basic access to our AI messaging features with limited usage."
                },
                {
                  question: "How do I access the Student plan?",
                  answer: "The Student plan is available only to signed-in users. Please sign in to access additional features."
                },
                {
                  question: "What does the Pro plan include?",
                  answer: "The Pro plan offers all the features of the Student plan plus access to our AI Career Coach, advanced resume analysis, and priority support."
                },
                {
                  question: "Is my data secure?",
                  answer: "Yes! We use industry-standard encryption. Your secrets stay safe."
                }
              ].map((faq, i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Accelerate Your Career?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands who’ve found the perfect plan to fuel their dreams (and maybe treat themselves to a latte).
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/app">
                <Button variant="primary" size="lg" icon={Rocket} className="group animate-glow">
                  Get Started Now <Sparkles className="w-5 h-5 inline ml-2" />
                </Button>
              </Link>
              <Button
                variant="secondary"
                size="lg"
                icon={Building2}
                onClick={() => window.location.href = 'mailto:enterprise@propel.ai'}
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Rocket className="w-8 h-8 text-red-800" aria-hidden="true" />
                <span className="text-xl font-bold bg-gradient-to-r from-red-800 to-red-900 text-transparent bg-clip-text">
                  Propel
                </span>
              </div>
              <p className="text-gray-600">
                AI-powered career assistance for students ready to launch their dreams.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
                    How it Works
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p>© 2025 Propel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;
