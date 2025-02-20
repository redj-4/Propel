import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, CheckCircle2, Star, Building2, Zap } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';
import PricingPlans from '../components/subscription/PricingPlans';

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <span className="px-4 py-2 rounded-full bg-secondary-50 text-secondary-600 text-sm font-medium">
              Simple, Transparent Pricing
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
            Choose the Perfect Plan for Your
            <span className="bg-gradient-to-r from-secondary-600 to-accent-500 text-transparent bg-clip-text">
              {" "}Career Growth
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Start for free and upgrade when you're ready. No hidden fees, no commitments.
          </p>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <PricingPlans />
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Compare Plans
          </h2>
          
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
                <tr>
                  <td className="py-4 px-4 text-gray-900">AI Message Generation</td>
                  <td className="py-4 px-4 text-center">2 per day</td>
                  <td className="py-4 px-4 text-center">Unlimited</td>
                  <td className="py-4 px-4 text-center">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-900">Resume Analysis</td>
                  <td className="py-4 px-4 text-center">Basic</td>
                  <td className="py-4 px-4 text-center">Advanced</td>
                  <td className="py-4 px-4 text-center">Custom</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-900">Message Templates</td>
                  <td className="py-4 px-4 text-center">Basic</td>
                  <td className="py-4 px-4 text-center">Premium</td>
                  <td className="py-4 px-4 text-center">Custom</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-900">Response Time</td>
                  <td className="py-4 px-4 text-center">Standard</td>
                  <td className="py-4 px-4 text-center">Priority</td>
                  <td className="py-4 px-4 text-center">Dedicated</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-900">Save & Edit History</td>
                  <td className="py-4 px-4 text-center">—</td>
                  <td className="py-4 px-4 text-center">✓</td>
                  <td className="py-4 px-4 text-center">✓</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-900">AI Customization</td>
                  <td className="py-4 px-4 text-center">—</td>
                  <td className="py-4 px-4 text-center">✓</td>
                  <td className="py-4 px-4 text-center">✓</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-900">Industry Optimization</td>
                  <td className="py-4 px-4 text-center">—</td>
                  <td className="py-4 px-4 text-center">✓</td>
                  <td className="py-4 px-4 text-center">✓</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-900">API Access</td>
                  <td className="py-4 px-4 text-center">—</td>
                  <td className="py-4 px-4 text-center">—</td>
                  <td className="py-4 px-4 text-center">✓</td>
                </tr>
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
                question: "How does the free trial work?",
                answer: "The free trial gives you access to basic features with 2 AI-generated messages per day. No credit card required to start."
              },
              {
                question: "Can I upgrade or downgrade at any time?",
                answer: "Yes, you can upgrade to Pro at any time. You can also cancel your subscription whenever you want."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards and debit cards. Enterprise plans can be paid via invoice."
              },
              {
                question: "Is my data secure?",
                answer: "Yes, we use industry-standard encryption and security measures to protect your data. We never share your information with third parties."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Accelerate Your Career?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of professionals using Propel to land their dream jobs
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/app">
              <Button
                variant="primary"
                size="lg"
                icon={Rocket}
                className="group animate-glow"
              >
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
    </div>
  );
};

export default PricingPage;