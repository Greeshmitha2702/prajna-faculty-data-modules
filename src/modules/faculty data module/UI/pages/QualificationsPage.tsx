import React, { useState, useEffect } from 'react';
import { useAuth } from '../mock/mockAuth';
import { Navigate } from 'react-router-dom';
import { Award, Plus, Trash2, FileText, Calendar, Landmark, Upload, X } from 'lucide-react';
import { mockUploadToS3 } from '../mock/mockS3Adapter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Qualification } from '../mock/mockProfiles';

// Import shared UI components
import Button from '../components/shared/Button';
import Input from '../components/shared/Input';
import Select from '../components/shared/Select';
import Modal from '../components/shared/Modal';
import Toast from '../components/shared/Toast';
import EmptyState from '../components/shared/EmptyState';
import Skeleton from '../components/shared/Skeleton';

// 1. Zod Validation Schema
const qualificationSchema = z.object({
  degree: z.string().min(1, 'Degree type is required'),
  specialization: z.string().min(1, 'Specialization is required'),
  university: z.string().min(1, 'University/Institution is required'),
  yearOfCompletion: z.preprocess(
    (val) => (val === '' || val === undefined ? undefined : Number(val)),
    z.number({ invalid_type_error: 'Year of completion is required' })
      .int()
      .min(1970, 'Year must be 1970 or later')
      .max(new Date().getFullYear(), 'Year cannot be in the future')
  ),
  certificateFile: z
    .custom<File>((val) => val instanceof File, 'Certificate file is required')
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, 'File exceeds 5MB size limit')
    .refine(
      (file) => !file || ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type),
      'Only PDF, JPG, and PNG are allowed'
    ),
});

type QualificationFormValues = z.infer<typeof qualificationSchema>;

export const QualificationsPage: React.FC = () => {
  const { user, switchProfile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  // Simulate loading skeleton on mount or when context profile changes
  useEffect(() => {
    setPageLoading(true);
    const timer = setTimeout(() => setPageLoading(false), 500);
    return () => clearTimeout(timer);
  }, [user?.facultyId]);

  if (!user) {
    return <Navigate to="/forbidden" replace />;
  }

  const handleDeleteQualification = (id: string) => {
    const originalLength = user.qualifications.length;
    user.qualifications = user.qualifications.filter((q) => q.id !== id);
    if (user.qualifications.length < originalLength) {
      switchProfile(user.facultyId);
      setToast({ message: 'Credential deleted successfully!', type: 'success' });
    } else {
      setToast({ message: 'Failed to delete credential.', type: 'error' });
    }
  };

  const handleAddSuccess = () => {
    switchProfile(user.facultyId);
    setToast({ message: 'New qualification registered successfully!', type: 'success' });
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Alert */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-display tracking-tight">
            Qualifications & Credentials
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Manage your academic degrees and upload verification certificates.
          </p>
        </div>
        {!pageLoading && (
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            Add Qualification
          </Button>
        )}
      </div>

      {/* Qualifications Table or Skeleton */}
      {pageLoading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-5 h-5 rounded" />
            <Skeleton className="w-48 h-4 rounded text" />
          </div>
          <div className="space-y-3 pt-4">
            <Skeleton className="w-full h-10 rounded-lg" />
            <Skeleton className="w-full h-12 rounded-lg" />
            <Skeleton className="w-full h-12 rounded-lg" />
          </div>
        </div>
      ) : (
        <QualificationsTable
          qualifications={user.qualifications}
          onDelete={handleDeleteQualification}
        />
      )}

      {/* Add Qualification Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Qualification"
      >
        <AddQualificationModalContent
          onClose={() => setIsModalOpen(false)}
          user={user}
          onSuccess={handleAddSuccess}
        />
      </Modal>
    </div>
  );
};

// ─── SUB-COMPONENT: QUALIFICATIONS TABLE ───────────────────
interface TableProps {
  qualifications: Qualification[];
  onDelete: (id: string) => void;
}

const QualificationsTable: React.FC<TableProps> = ({ qualifications, onDelete }) => {
  if (qualifications.length === 0) {
    return (
      <EmptyState
        icon={Award}
        title="No qualifications logged yet"
        description="Your profile completeness index depends on having your academic degrees registered. Click 'Add Qualification' to register one."
      />
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2 bg-slate-950/20">
        <Award className="w-5 h-5 text-gitam-antique-gold" />
        <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider">
          Degree History Log ({qualifications.length})
        </h3>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-850 bg-slate-950/40 text-[10px] text-slate-400 font-bold uppercase tracking-wider select-none">
              <th className="py-3.5 px-6">Degree</th>
              <th className="py-3.5 px-6">Specialization</th>
              <th className="py-3.5 px-6">University/Institution</th>
              <th className="py-3.5 px-6">Year</th>
              <th className="py-3.5 px-6">Evidence</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {qualifications.map((q) => (
              <tr key={q.id} className="hover:bg-slate-900/30 transition text-sm">
                <td className="py-4 px-6 font-bold text-white whitespace-nowrap">{q.degree}</td>
                <td className="py-4 px-6 text-slate-300 font-medium">{q.specialization}</td>
                <td className="py-4 px-6 text-slate-400 font-medium">{q.university}</td>
                <td className="py-4 px-6 text-gitam-beige font-semibold">{q.yearOfCompletion}</td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <a
                    href={q.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gitam-green/10 text-gitam-green hover:bg-gitam-green/20 text-xs font-bold border border-gitam-green/20 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gitam-green"
                  >
                    <FileText className="w-4 h-4" />
                    PDF Proof
                  </a>
                </td>
                <td className="py-4 px-6 text-right whitespace-nowrap">
                  <button
                    onClick={() => onDelete(q.id)}
                    className="p-2 text-slate-500 hover:text-gitam-coral hover:bg-gitam-coral/10 rounded-xl transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gitam-coral"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── SUB-COMPONENT: ADD QUALIFICATION MODAL CONTENT ─────────
interface ModalContentProps {
  onClose: () => void;
  user: any;
  onSuccess: () => void;
}

const AddQualificationModalContent: React.FC<ModalContentProps> = ({ onClose, user, onSuccess }) => {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<QualificationFormValues>({
    resolver: zodResolver(qualificationSchema),
    defaultValues: {
      degree: '',
      specialization: '',
      university: '',
      yearOfCompletion: new Date().getFullYear(),
      certificateFile: undefined,
    },
  });

  const certificateFile = watch('certificateFile');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setValue('certificateFile', e.target.files[0], { shouldValidate: true });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setValue('certificateFile', e.dataTransfer.files[0], { shouldValidate: true });
    }
  };

  const removeFile = () => {
    setValue('certificateFile', undefined as any, { shouldValidate: true });
  };

  const onSubmit = async (values: QualificationFormValues) => {
    setUploadProgress(0);

    try {
      // Trigger simulation of uploading to S3
      const mockUrl = await mockUploadToS3(values.certificateFile, {
        onProgress: (percent) => setUploadProgress(percent),
      });

      // Construct and append new record
      const newQual: Qualification = {
        id: `q_${Math.random().toString(36).substring(2, 7)}`,
        degree: values.degree,
        specialization: values.specialization,
        university: values.university,
        yearOfCompletion: values.yearOfCompletion,
        certificateUrl: mockUrl,
      };

      user.qualifications.push(newQual);
      onSuccess();
      reset();
      onClose();
    } catch (err: any) {
      setUploadProgress(null);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Degree Select */}
      <Select
        label="Degree Type *"
        error={errors.degree?.message}
        options={[
          { value: 'Ph.D.', label: 'Ph.D. / Doctor of Philosophy' },
          { value: 'PostDoc', label: 'Post-Doctoral Fellowship' },
          { value: 'M.Tech', label: 'M.Tech / Master of Technology' },
          { value: 'M.E.', label: 'M.E. / Master of Engineering' },
          { value: 'M.Sc.', label: 'M.Sc. / Master of Science' },
          { value: 'M.B.A.', label: 'M.B.A. / Master of Business Administration' },
          { value: 'B.Tech', label: 'B.Tech / Bachelor of Technology' },
          { value: 'B.E.', label: 'B.E. / Bachelor of Engineering' },
        ]}
        placeholder="Select Degree..."
        disabled={uploadProgress !== null}
        {...register('degree')}
      />

      {/* Specialization Input */}
      <Input
        label="Specialization *"
        placeholder="e.g. Computer Science, VLSI, Communication Systems"
        error={errors.specialization?.message}
        disabled={uploadProgress !== null}
        {...register('specialization')}
      />

      {/* University Input */}
      <Input
        label="University / Institution *"
        placeholder="e.g. IIT Kharagpur, IISc Bangalore"
        icon={Landmark}
        error={errors.university?.message}
        disabled={uploadProgress !== null}
        {...register('university')}
      />

      {/* Completion Year Input */}
      <Input
        label="Year of Completion *"
        type="number"
        placeholder="e.g. 2021"
        icon={Calendar}
        error={errors.yearOfCompletion?.message}
        disabled={uploadProgress !== null}
        {...register('yearOfCompletion')}
      />

      {/* Certificate upload */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Upload Certificate Proof (PDF/PNG/JPG) *
        </label>
        {uploadProgress === null ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border border-dashed rounded-xl p-5 bg-slate-950 hover:bg-slate-900/40 transition flex items-center justify-center cursor-pointer ${
              isDragging ? 'border-gitam-antique-gold bg-slate-900' : 'border-slate-800'
            }`}
          >
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="text-center space-y-2 select-none">
              <Upload className={`w-7 h-7 mx-auto transition-transform ${isDragging ? '-translate-y-1 text-gitam-antique-gold' : 'text-slate-500'}`} />
              {certificateFile ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs text-slate-200 font-semibold max-w-[200px] truncate">
                    {certificateFile.name}
                  </span>
                  <span className="text-[10px] text-slate-450 font-bold">
                    ({(certificateFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white cursor-pointer transition"
                    title="Remove file"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-xs text-slate-350 font-semibold">
                    Select certificate file or drag & drop here
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">Max size 5MB • PDF / PNG / JPG</p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2 animate-pulse">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-450 font-semibold">Uploading proof to S3...</span>
              <span className="text-gitam-antique-gold font-bold">{uploadProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-850 rounded-full overflow-hidden">
              <div
                className="h-full bg-gitam-antique-gold rounded-full transition-all duration-150"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
        {errors.certificateFile && (
          <p className="text-[11px] text-gitam-coral font-semibold flex items-center gap-1 animate-scale-up">
            <span className="shrink-0">✕</span>
            {errors.certificateFile.message as string}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-850">
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={uploadProgress !== null}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={uploadProgress !== null}
          disabled={uploadProgress !== null}
        >
          Save Degree
        </Button>
      </div>
    </form>
  );
};
