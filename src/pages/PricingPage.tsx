import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, CheckCircle2, Building2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';
import PricingPlans from '../components/subscription/PricingPlans';

const PricingPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <Navbar />
      <main>
        <section className="pt-24 pb-20 px-4 text-center">
          <div className="max-w-7xl mx-auto">
            <span className="px-4 py-2 rounded-full bg-secondary-50 text-secondary-600 text-sm font-medium">
              Simple, Transparent Pricing
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 my-6">
              Choose the Perfect Plan for Your <span className="bg-gradient-to-r from-secondary-600 to-accent-500 text-transparent bg-clip-text">Career Growth</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start for free, upgrade when you're ready, and keep your wallet as happy as your future.  
            </p>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <PricingPlans />
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Compare Plans</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-t border-gray-200">
                    <th className="py-5 px-4 text-left text-gray-500 font-medium">Features</th>
                    <th className="py-5 px-4 text-center text-gray-900 font-semibold">Free Trial</th>
                    <th className="py-5 px-4 text-center text-secondary-900 font-semibold">Pro</th>
                    <th className="py-5 px-4 text-center text-gray-900 font-semibold">Enterprise</th>
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
                  ].map(([feature, free, pro, ent], i) => (
                    <tr key={i}>
                      <td className="py-4 px-4 text-gray-900">{feature}</td>
                      <td className="py-4 px-4 text-center">{free}</td>
                      <td className="py-4 px-4 text-center">{pro}</td>
                      <td className="py-4 px-4 text-center">{ent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-8">
              {[
                {
                  question: "How does the free trial work?",
                  answer: "Enjoy 2 AI-generated messages per day. No credit card required—just pure career magic."
                },
                {
                  question: "Can I change my plan later?",
                  answer: "Absolutely! Upgrade or downgrade anytime—because your career should be as flexible as you are."
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept all major cards. For Enterprise, we keep it simple with invoices."
                },
                {
                  question: "Is my data secure?",
                  answer: "Yes! We use industry-standard encryption. Your secrets stay safe (our AI doesn't gossip)."
                }
              ].map((faq, i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Accelerate Your Career?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands who’ve found the perfect plan to fuel their dreams (and maybe treat themselves to a latte).
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/app">
                <Button variant="primary" size="lg" icon={Rocket} className="group animate-glow">
                  Get Started Now
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

      <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Rocket className="w-8 h-8 text-secondary-600" aria-hidden="true" />
                <span className="text-xl font-bold bg-gradient-to-r from-secondary-600 to-accent-500 text-transparent bg-clip-text">
                  Propel
                </span>
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
    </div>
  );
};

export default PricingPage;
