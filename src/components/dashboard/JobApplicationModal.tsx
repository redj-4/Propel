import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../common/Button';

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (application: {
    company: string;
    position: string;
    status: 'sent' | 'awaiting' | 'follow-up' | 'rejected';
    notes?: string;
  }) => void;
}

const JobApplicationModal: React.FC<JobApplicationModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [application, setApplication] = useState({
    company: '',
    position: '',
    status: 'sent' as const,
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(application);
    setApplication({
      company: '',
      position: '',
      status: 'sent',
      notes: ''
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Add New Application
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              type="text"
              value={application.company}
              onChange={(e) => setApplication(prev => ({
                ...prev,
                company: e.target.value
              }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position
            </label>
            <input
              type="text"
              value={application.position}
              onChange={(e) => setApplication(prev => ({
                ...prev,
                position: e.target.value
              }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={application.status}
              onChange={(e) => setApplication(prev => ({
                ...prev,
                status: e.target.value as typeof application.status
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
              value={application.notes}
              onChange={(e) => setApplication(prev => ({
                ...prev,
                notes: e.target.value
              }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
            >
              Add Application
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationModal;