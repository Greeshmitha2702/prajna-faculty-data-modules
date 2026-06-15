import React, { useState } from 'react';
import { useAuth } from '../mock/mockAuth';
import { Navigate, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Hash, Save, X, Plus, Building, Landmark } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ProfilePhotoUploader } from '../components/profile/ProfilePhotoUploader';

// Import shared UI components
import Button from '../components/shared/Button';
import Input from '../components/shared/Input';
import Toast from '../components/shared/Toast';

// 1. Zod Validation Schema for profile fields
const profileSchema = z.object({
  designation: z.string().min(1, 'Designation is required'),
  contactNumber: z.string().min(10, 'Contact number must be at least 10 digits').max(15, 'Contact number is too long'),
  address: z.string().min(5, 'Address is too short'),
  orcidId: z.string().optional().or(z.literal('')).refine(
    (val) => !val || /^\d{4}-\d{4}-\d{4}-[\dX]{4}$/.test(val),
    { message: 'Invalid ORCID format (XXXX-XXXX-XXXX-XXXX)' }
  ),
  scopusId: z.string().optional().or(z.literal('')).refine(
    (val) => !val || /^\d+$/.test(val),
    { message: 'Scopus Author ID must contain only digits' }
  ),
  googleScholarId: z.string().optional().or(z.literal('')),
  vidwanId: z.string().optional().or(z.literal('')).refine(
    (val) => !val || /^\d+$/.test(val),
    { message: 'VIDWAN Expert ID must contain only digits' }
  ),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const ProfileEditPage: React.FC = () => {
  const { user, switchProfile } = useAuth();
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Maintain research interests state outside React Hook Form (since it's a tag input)
  const [interests, setInterests] = useState<string[]>(user?.researchInterests || []);
  const [newInterest, setNewInterest] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      designation: user?.designation || '',
      contactNumber: user?.contactNumber || '',
      address: user?.address || '',
      orcidId: user?.orcidId || '',
      scopusId: user?.scopusId || '',
      googleScholarId: user?.googleScholarId || '',
      vidwanId: user?.vidwanId || '',
    },
  });

  if (!user) {
    return <Navigate to="/forbidden" replace />;
  }

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    const val = newInterest.trim();
    if (val && !interests.includes(val)) {
      setInterests((prev) => [...prev, val]);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (item: string) => {
    setInterests((prev) => prev.filter((i) => i !== item));
  };

  const onSubmit = (values: ProfileFormValues) => {
    setIsSaving(true);

    // Simulate saving delay
    setTimeout(() => {
      // Save/Cancel Workflow Simulation
      user.designation = values.designation;
      user.contactNumber = values.contactNumber;
      user.address = values.address;
      user.orcidId = values.orcidId || undefined;
      user.scopusId = values.scopusId || undefined;
      user.googleScholarId = values.googleScholarId || undefined;
      user.vidwanId = values.vidwanId || undefined;
      user.researchInterests = interests;

      // Trigger local context update
      switchProfile(user.facultyId);
      setIsSaving(false);

      setToastMessage('Profile changes saved successfully! (+15 points pending verification)');
      setTimeout(() => {
        setToastMessage(null);
        navigate('/profile/me');
      }, 2000);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-display tracking-tight">
            Edit Profile Details
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Update your professional information. Security policies restrict access to critical identity fields.
          </p>
        </div>
      </div>

      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Profile Photo Uploader */}
        <ProfilePhotoUploader user={user} onSuccess={() => switchProfile(user.facultyId)} />
        
        {/* SECTION 1: IMMUTABLE FIELDS (DISABLED) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-xs font-bold text-gitam-antique-white uppercase tracking-wider">
            Identity Profile (Immutable - Read-Only)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Faculty ID */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Faculty ID</span>
              <div className="flex items-center gap-2 text-xs text-slate-450 py-2.5 px-3 bg-slate-950/60 rounded-xl border border-slate-850 select-none">
                <Hash className="w-4 h-4 text-slate-600" />
                {user.facultyId}
              </div>
            </div>
            
            {/* Full Name */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Official Name</span>
              <div className="flex items-center gap-2 text-xs text-slate-450 py-2.5 px-3 bg-slate-950/60 rounded-xl border border-slate-850 select-none">
                <User className="w-4 h-4 text-slate-600" />
                {user.firstName} {user.lastName}
              </div>
            </div>

            {/* Official Email */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">University Email</span>
              <div className="flex items-center gap-2 text-xs text-slate-450 py-2.5 px-3 bg-slate-950/60 rounded-xl border border-slate-850 select-none">
                <Mail className="w-4 h-4 text-slate-600" />
                {user.email}
              </div>
            </div>

            {/* Department */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Department</span>
              <div className="flex items-center gap-2 text-xs text-slate-450 py-2.5 px-3 bg-slate-950/60 rounded-xl border border-slate-850 select-none">
                <Building className="w-4 h-4 text-slate-600" />
                {user.department}
              </div>
            </div>

            {/* School */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">School</span>
              <div className="flex items-center gap-2 text-xs text-slate-450 py-2.5 px-3 bg-slate-950/60 rounded-xl border border-slate-850 select-none">
                <Landmark className="w-4 h-4 text-slate-600" />
                {user.school}
              </div>
            </div>

            {/* Campus */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Campus Tenant</span>
              <div className="flex items-center gap-2 text-xs text-slate-450 py-2.5 px-3 bg-slate-950/60 rounded-xl border border-slate-850 select-none">
                <MapPin className="w-4 h-4 text-slate-600" />
                {user.campus}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: EDITABLE FIELDS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <h3 className="text-xs font-bold text-gitam-antique-white uppercase tracking-wider">
            Edit Contact & Designation Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Designation */}
            <Input
              label="Academic Designation *"
              disabled={isSaving}
              error={errors.designation?.message}
              {...register('designation')}
            />

            {/* Contact Number */}
            <Input
              label="Contact Phone Number *"
              disabled={isSaving}
              icon={Phone}
              error={errors.contactNumber?.message}
              {...register('contactNumber')}
            />
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <label htmlFor="address-input" className="text-xs font-bold text-slate-400 uppercase block tracking-wider">
              Residential Address *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <textarea
                id="address-input"
                disabled={isSaving}
                rows={3}
                aria-invalid={errors.address ? 'true' : 'false'}
                aria-describedby={errors.address ? 'address-error' : undefined}
                className={`w-full bg-slate-950 border text-sm text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-gitam-green transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.address ? 'border-gitam-coral focus:border-gitam-coral' : 'border-slate-800 focus:border-gitam-green'
                }`}
                {...register('address')}
              />
            </div>
            {errors.address && (
              <p id="address-error" role="alert" className="text-[11px] text-gitam-coral font-semibold flex items-center gap-1 animate-scale-up">
                <span className="shrink-0">✕</span>
                {errors.address.message}
              </p>
            )}
          </div>
        </div>

        {/* SECTION 3: RESEARCH INTERESTS (TAG EDITOR) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <label htmlFor="interest-input" className="text-xs font-bold text-gitam-antique-white uppercase tracking-wider block">
            Research Interests & Areas
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {interests.map((item, idx) => (
              <span key={idx} className="flex items-center gap-1.5 text-xs bg-slate-950 border border-slate-850 text-slate-350 px-3 py-1.5 rounded-lg font-semibold select-none">
                {item}
                <button
                  type="button"
                  onClick={() => handleRemoveInterest(item)}
                  disabled={isSaving}
                  className="text-slate-500 hover:text-white transition cursor-pointer disabled:opacity-50"
                  aria-label={`Remove interest ${item}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              id="interest-input"
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="e.g. Distributed Computing, Deep Learning"
              disabled={isSaving}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-gitam-green disabled:opacity-50 transition"
            />
            <Button
              variant="secondary"
              onClick={handleAddInterest}
              disabled={isSaving}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Area
            </Button>
          </div>
        </div>

        {/* SECTION 4: SCHOLARLY IDENTIFIERS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
          <h3 className="text-xs font-bold text-gitam-antique-white uppercase tracking-wider block">
            Scholarly Profiles (External IDs)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* ORCID */}
            <Input
              label="ORCID ID (XXXX-XXXX-XXXX-XXXX)"
              placeholder="0000-0000-0000-0000"
              disabled={isSaving}
              error={errors.orcidId?.message}
              {...register('orcidId')}
            />

            {/* Scopus ID */}
            <Input
              label="Scopus Author ID"
              placeholder="e.g. 57204859300"
              disabled={isSaving}
              error={errors.scopusId?.message}
              {...register('scopusId')}
            />

            {/* Google Scholar */}
            <Input
              label="Google Scholar ID"
              placeholder="e.g. z-rS2oIAAAAJ"
              disabled={isSaving}
              error={errors.googleScholarId?.message}
              {...register('googleScholarId')}
            />

            {/* VIDWAN */}
            <Input
              label="VIDWAN Expert ID"
              placeholder="e.g. 184905"
              disabled={isSaving}
              error={errors.vidwanId?.message}
              {...register('vidwanId')}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="secondary"
            onClick={() => navigate('/profile/me')}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSaving}
            disabled={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Changes
          </Button>
        </div>

      </form>
    </div>
  );
};
export default ProfileEditPage;
