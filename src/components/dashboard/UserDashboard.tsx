import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Briefcase, 
  BarChart3, 
  FileText,
  Star,
  Settings,
  ChevronRight,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  Plus
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../layout/Navbar';
import Button from '../common/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import SavedMessages from './SavedMessages';
import { toast } from 'react-hot-toast';
import {
  getUserStats,
  getJobApplications,
  addJobApplication,
  updateJobApplication,
  deleteJobApplication,
  getUserSavedMessages,
  toggleMessageStar,
  deleteMessage,
  subscribeToJobApplications,
  subscribeToUserActivities,
  subscribeToPromptHistory
} from '../../lib/supabase';

interface JobApplication {
  id: string;
  company: string;
  position: string;
  status: 'sent' | 'awaiting' | 'follow-up' | 'rejected';
  created_at: string;
  updated_at: string;
  notes?: string;
  next_follow_up?: string;
  message?: {
    content: string;
    type: string;
  };
}

const UserDashboard = () => {
  const { user, isGuest } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    messagesCreated: 0,
    applicationsSent: 0,
    responseRate: 0
  });
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [showAddApplication, setShowAddApplication] = useState(false);
  const [newApplication, setNewApplication] = useState({
    company: '',
    position: '',
    status: 'sent' as const,
    notes: ''
  });

  useEffect(() => {
    if (!user && !isGuest) {
      navigate('/');
      return;
    }

    loadDashboardData();

    // Set up real-time subscriptions
    if (user) {
      const jobApplicationsSubscription = subscribeToJobApplications(
        user.id,
        (payload) => {
          // Update applications based on the change type
          if (payload.eventType === 'INSERT') {
            setApplications(prev => [payload.new, ...prev]);
            loadStats(); // Refresh stats
          } else if (payload.eventType === 'UPDATE') {
            setApplications(prev => 
              prev.map(app => app.id === payload.new.id ? payload.new : app)
            );
            loadStats(); // Refresh stats
          } else if (payload.eventType === 'DELETE') {
            setApplications(prev => 
              prev.filter(app => app.id !== payload.old.id)
            );
            loadStats(); // Refresh stats
          }
        }
      );

      const activitiesSubscription = subscribeToUserActivities(
        user.id,
        (payload) => {
          if (payload.eventType === 'INSERT') {
            // Handle new activity
            toast.success('New activity recorded');
          }
        }
      );

      const promptHistorySubscription = subscribeToPromptHistory(
        user.id,
        (payload) => {
          if (payload.eventType === 'INSERT') {
            // Handle new prompt history entry
            loadMessages(); // Refresh messages
          }
        }
      );

      // Cleanup subscriptions
      return () => {
        jobApplicationsSubscription.unsubscribe();
        activitiesSubscription.unsubscribe();
        promptHistorySubscription.unsubscribe();
      };
    }
  }, [user, isGuest, navigate]);

  const loadStats = async () => {
    try {
      const userStats = await getUserStats(user!.id);
      setStats(userStats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const savedMessages = await getUserSavedMessages(user!.id);
      setMessages(savedMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const loadApplications = async () => {
    try {
      const userApplications = await getJobApplications(user!.id);
      setApplications(userApplications);
    } catch (error) {
      console.error('Failed to load applications:', error);
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadStats(),
        loadApplications(),
        loadMessages()
      ]);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddApplication = async () => {
    try {
      await addJobApplication(user!.id, newApplication);
      setShowAddApplication(false);
      setNewApplication({
        company: '',
        position: '',
        status: 'sent',
        notes: ''
      });
      toast.success('Application added successfully');
    } catch (error) {
      toast.error('Failed to add application');
    }
  };

  const handleUpdateStatus = async (id: string, status: JobApplication['status']) => {
    try {
      await updateJobApplication(id, { status });
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteApplication = async (id: string) => {
    if (confirm('Are you sure you want to delete this application?')) {
      try {
        await deleteJobApplication(id);
        toast.success('Application deleted successfully');
      } catch (error) {
        toast.error('Failed to delete application');
      }
    }
  };

  const handleStarMessage = async (id: string) => {
    try {
      const message = messages.find(m => m.id === id);
      await toggleMessageStar(id, !message.is_starred);
      setMessages(prev =>
        prev.map(m =>
          m.id === id ? { ...m, is_starred: !m.is_starred } : m
        )
      );
      toast.success(message.is_starred ? 'Message unstarred' : 'Message starred');
    } catch (error) {
      toast.error('Failed to update message');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      await deleteMessage(id);
      setMessages(prev => prev.filter(m => m.id !== id));
      toast.success('Message deleted');
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Send className="w-5 h-5 text-secondary-500" />;
      case 'awaiting':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'follow-up':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent':
        return 'Application Sent';
      case 'awaiting':
        return 'Awaiting Response';
      case 'follow-up':
        return 'Follow-up Needed';
      case 'rejected':
        return 'Not Selected';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
            </h1>
            <p className="text-gray-600 mt-1">
              Track your career progress and manage your applications
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate('/app')}
            className="flex items-center"
          >
            New Message
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              title: 'Messages Created',
              value: stats.messagesCreated.toString(),
              icon: MessageSquare,
              color: 'bg-secondary-500'
            },
            {
              title: 'Applications Sent',
              value: stats.applicationsSent.toString(),
              icon: Briefcase,
              color: 'bg-accent-500'
            },
            {
              title: 'Response Rate',
              value: `${Math.round(stats.responseRate)}%`,
              icon: BarChart3,
              color: 'bg-green-500'
            }
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Applications
                </h3>
                <div className="space-y-4">
                  {applications.slice(0, 3).map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {app.position}
                        </p>
                        <p className="text-sm text-gray-600">
                          {app.company}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(app.status)}
                        <span className="text-sm text-gray-600">
                          {getStatusText(app.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  AI Recommendations
                </h3>
                <div className="space-y-4">
                  {applications
                    .filter(app => app.status === 'awaiting' && app.next_follow_up)
                    .slice(0, 3)
                    .map((app) => (
                      <div
                        key={app.id}
                        className="flex items-start p-4 bg-gray-50 rounded-lg"
                      >
                        <Clock className="w-5 h-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-gray-700">
                            Follow up with {app.company} regarding your {app.position} application
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Suggested: {new Date(app.next_follow_up!).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="applications">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Job Applications
                  </h3>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Plus}
                    onClick={() => setShowAddApplication(true)}
                  >
                    Add Application
                  </Button>
                </div>

                {showAddApplication && (
                  <div className="mb-6 p-6 bg-gray-50 rounded-xl">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      Add New Application
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company
                        </label>
                        <input
                          type="text"
                          value={newApplication.company}
                          onChange={(e) => setNewApplication(prev => ({
                            ...prev,
                            company: e.target.value
                          }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Position
                        </label>
                        <input
                          type="text"
                          value={newApplication.position}
                          onChange={(e) => setNewApplication(prev => ({
                            ...prev,
                            position: e.target.value
                          }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          value={newApplication.status}
                          onChange={(e) => setNewApplication(prev => ({
                            ...prev,
                            status: e.target.value as JobApplication['status']
                          }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                        >
                          <option value="sent">Application Sent</option>
                          <option value="awaiting">Awaiting Response</option>
                          <option value="follow-up">Follow-up Needed</option>
                          <option value="rejected">Not Selected</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Notes
                        </label>
                        <textarea
                          value={newApplication.notes}
                          onChange={(e) => setNewApplication(prev => ({
                            ...prev,
                            notes: e.target.value
                          }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end space-x-4">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setShowAddApplication(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleAddApplication}
                          disabled={!newApplication.company || !newApplication.position}
                        >
                          Add Application
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <div className="flex items-center space-x-3">
                          <p className="font-medium text-gray-900">
                            {app.position}
                          </p>
                          <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                            {app.company}
                          </span>
                        </div>
                        {app.notes && (
                          <p className="text-sm text-gray-600 mt-1">
                            {app.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(app.status)}
                          <select
                            value={app.status}
                            onChange={(e) => handleUpdateStatus(app.id, e.target.value as JobApplication['status'])}
                            className="text-sm text-gray-600 bg-transparent border-none focus:ring-0"
                          >
                            <option value="sent">Application Sent</option>
                            <option value="awaiting">Awaiting Response</option>
                            <option value="follow-up">Follow-up Needed</option>
                            <option value="rejected">Not Selected</option>
                          </select>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleDeleteApplication(app.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}

                  {applications.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <p className="text-gray-600">No applications yet</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Start tracking your job applications
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <SavedMessages
              messages={messages}
              onStar={handleStarMessage}
              onDelete={handleDeleteMessage}
              onUse={(content) => {
                navigator.clipboard.writeText(content);
                toast.success('Message copied to clipboard');
              }}
            />
          </TabsContent>

          <TabsContent value="insights">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Application Analysis
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Response Rate</span>
                    <span className="font-medium text-gray-900">
                      {Math.round(stats.responseRate)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary-500 rounded-full"
                      style={{ width: `${Math.round(stats.responseRate)}%` }}
                    />
                  </div>
                  <div className="space-y-2 mt-4">
                    {[
                      { label: 'Applications Sent', value: stats.applicationsSent },
                      { label: 'Awaiting Response', value: applications.filter(a => a.status === 'awaiting').length },
                      { label: 'Follow-ups Needed', value: applications.filter(a => a.status === 'follow-up').length },
                      { label: 'Positive Responses', value: applications.filter(a => a.status === 'awaiting' || a.status === 'follow-up').length }
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{item.label}</span>
                        <span className="text-sm font-medium text-gray-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  AI Recommendations
                </h3>
                <div className="space-y-4">
                  {applications.length === 0 ? (
                    <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-secondary-500 mt-0.5 mr-3 flex-shrink-0" />
                      <p className="text-gray-700">
                        Start tracking your job applications to get personalized AI recommendations
                      </p>
                    </div>
                  ) : (
                    <>
                      {applications.filter(a => a.status === 'awaiting').length > 0 && (
                        <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                          <Clock className="w-5 h-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                          <p className="text-gray-700">
                            You have {applications.filter(a => a.status === 'awaiting').length} applications awaiting response. Consider following up next week.
                          </p>
                        </div>
                      )}
                      {applications.filter(a => a.status === 'follow-up').length > 0 && (
                        <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                          <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
                          <p className="text-gray-700">
                            {applications.filter(a => a.status === 'follow-up').length} applications need follow-up. Use our AI to generate follow-up messages.
                          </p>
                        </div>
                      )}
                      {stats.responseRate < 30 && (
                        <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                          <BarChart3 className="w-5 h-5 text-secondary-500 mt-0.5 mr-3 flex-shrink-0" />
                          <p className="text-gray-700">
                            Your response rate is below average. Consider optimizing your application materials with our AI tools.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default UserDashboard;