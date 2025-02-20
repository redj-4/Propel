import React from 'react';
import { Upload, Loader2, File } from 'lucide-react';

interface ResumeUploadProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
  fileName: string;
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({
  onUpload,
  isLoading,
  fileName,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop
}) => {
  return (
    <div
      className={`mb-6 border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
        isDragging
          ? 'border-secondary-500 bg-secondary-50'
          : 'border-gray-300 hover:border-secondary-400 hover:bg-gray-50'
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => document.getElementById('resume-upload')?.click()}
    >
      <input
        type="file"
        id="resume-upload"
        className="hidden"
        accept=".pdf"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && file.type === 'application/pdf') {
            onUpload(file);
          }
        }}
      />
      {isLoading ? (
        <Loader2 className="w-12 h-12 mx-auto mb-4 text-secondary-600 animate-spin" />
      ) : (
        <Upload className="w-12 h-12 mx-auto mb-4 text-secondary-600 animate-bounce-slow" />
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Upload Your Resume
      </h3>
      <p className="text-sm text-gray-600 mb-2">
        Drag and drop your resume PDF here or click to browse
      </p>
      <p className="text-xs text-gray-500">Supported format: PDF</p>
      {fileName && (
        <div className="mt-4 flex items-center justify-center text-sm text-secondary-600 bg-secondary-50 py-2 px-4 rounded-lg">
          <File className="w-4 h-4 mr-2" />
          {fileName}
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;