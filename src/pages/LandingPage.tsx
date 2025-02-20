import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Rocket, 
  Send, 
  FileText, 
  Users, 
  ChevronRight, 
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Target,
  Zap,
  Building2,
  Lock,
  Star,
  Infinity,
  BarChart3,
  Shield,
  Clock,
  Briefcase,
  Brain,
  Mic,
  Bot,
  LineChart,
  User
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/auth/AuthModal';

const LandingPage = () => {
  const { user, isGuest } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <Navbar variant="landing" />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-radial from-white via-gray-50/50 to-gray-100/30">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <span className="px-4 py-2 rounded-full bg-secondary-50 text-secondary-600 text-sm font-medium">
              For Students & Recent Graduates
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-secondary-600 to-accent-500 text-transparent bg-clip-text">
              Your AI Career
            </span>
            {" "}Assistant for
            <span className="bg-gradient-to-r from-secondary-600 to-accent-500 text-transparent bg-clip-text">
              {" "}Success
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Get personalized career guidance, craft compelling messages, and land your dream job with our advanced AI assistant.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/app">
              <Button
                variant="primary"
                size="lg"
                icon={Rocket}
                className="group animate-glow"
              >
                Start Your Journey
                <ChevronRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/app/career">
              <Button
                variant="secondary"
                size="lg"
                icon={Brain}
              >
                Try AI Career Coach
              </Button>
            </Link>
          </div>
          <div className="mt-12 flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2 text-gray-600">
              <Brain className="w-5 h-5 text-secondary-600" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Bot className="w-5 h-5 text-secondary-600" />
              <span>24/7 Assistance</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Shield className="w-5 h-5 text-secondary-600" />
              <span>Free to Start</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Complete AI Career Suite
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to accelerate your career journey
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Bot className="w-6 h-6" />,
                title: "AI Career Coach",
                description: "Get personalized career advice, resume feedback, and industry insights from your AI mentor",
                gradient: "from-secondary-500 to-secondary-600"
              },
              {
                icon: <MessageSquare className="w-6 h-6" />,
                title: "Smart Messaging",
                description: "Generate personalized outreach messages that get responses from recruiters and professionals",
                gradient: "from-accent-500 to-accent-600"
              },
              {
                icon: <Mic className="w-6 h-6" />,
                title: "AI Mock Interviews",
                description: "Practice interviews with AI feedback to improve your performance and confidence",
                gradient: "from-secondary-600 to-accent-500"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Showcase */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Advanced AI Career Assistant
            </h2>
            <p className="text-xl text-gray-600">
              Powered by cutting-edge AI to supercharge your job search
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-secondary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6 text-secondary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Intelligent Career Guidance
                  </h3>
                  <p className="text-gray-600">
                    Get personalized career advice based on your skills, experience, and goals. Our AI analyzes your profile and provides actionable recommendations.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-accent-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Dynamic Message Generation
                  </h3>
                  <p className="text-gray-600">
                    Create compelling outreach messages tailored to each recipient. Our AI crafts personalized content that gets responses.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <LineChart className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Smart Job Matching
                  </h3>
                  <p className="text-gray-600">
                    Get AI-powered job recommendations based on your profile. Our system analyzes job descriptions and matches them to your skills.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="px-4 py-2 bg-secondary-500 text-white text-sm font-medium rounded-full">
                  Live Demo
                </span>
              </div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-secondary-50 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-secondary-600" />
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-800">
                      Hi! I'm your AI career assistant. I can help you craft professional messages, prepare for interviews, and optimize your job search. What would you like to work on?
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 justify-end">
                  <div className="flex-1 bg-secondary-50 rounded-lg p-4">
                    <p className="text-secondary-900">
                      I'm looking for software engineering roles and need help reaching out to hiring managers.
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-secondary-600" />
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-secondary-50 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-secondary-600" />
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-800">
                      I'll help you craft personalized messages that stand out. First, let's analyze your resume to highlight your relevant experience and skills. Could you share your resume with me?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your AI Career Journey
            </h2>
            <p className="text-xl text-gray-600">
              Four simple steps to career success
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Share Your Profile",
                description: "Upload your resume and let our AI analyze your experience"
              },
              {
                step: "2",
                title: "Get AI Insights",
                description: "Receive personalized career advice and recommendations"
              },
              {
                step: "3",
                title: "Practice & Prepare",
                description: "Use AI mock interviews and message generation"
              },
              {
                step: "4",
                title: "Land Your Dream Job",
                description: "Apply with confidence and track your progress"
              }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="w-12 h-12 bg-gradient-to-r from-secondary-600 to-accent-500 text-white rounded-full flex items-center justify-center text-xl font-semibold mx-auto mb-6 shadow-lg shadow-secondary-200/50 group-hover:shadow-xl group-hover:shadow-secondary-300/50 transition-all duration-300">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Accelerate Your Career?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of students using AI to land their dream jobs
          </p>
          <Link to="/app">
            <Button
              variant="primary"
              size="lg"
              icon={Rocket}
              className="group animate-glow"
            >
              Get Started Now
              <Sparkles className="w-5 h-5 ml-2 transition-transform group-hover:rotate-12" />
            </Button>
          </Link>
          <div className="mt-8 flex items-center justify-center space-x-8 text-gray-600">
            <div className="flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2 text-secondary-600" />
              <span>Free to Get Started</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2 text-secondary-600" />
              <span>No Credit Card Required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Rocket className="w-8 h-8 text-secondary-600" />
                <span className="text-xl font-bold bg-gradient-to-r from-secondary-600 to-accent-500 text-transparent bg-clip-text">
                  Propel
                </span>
              </div>
              <p className="text-gray-600">
                AI-powered career assistance for students
              </p>
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

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default LandingPage;