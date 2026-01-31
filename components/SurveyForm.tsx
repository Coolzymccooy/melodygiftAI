
import React, { useState } from 'react';
import { SurveyData, Genre, Mood } from '../types';
import { GENRES, MOODS } from '../constants';

interface SurveyFormProps {
  onSubmit: (data: SurveyData) => void;
}

const SurveyForm: React.FC<SurveyFormProps> = ({ onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<SurveyData>({
    recipientName: '',
    occasion: '',
    genre: 'Pop',
    mood: 'Joyful',
    memories: '',
    mustInclude: '',
    language: 'English',
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-800">
            {step === 1 && "Who's the lucky person?"}
            {step === 2 && "Pick the vibe"}
            {step === 3 && "Tell us their story"}
          </h2>
          <span className="text-slate-400 font-medium">Step {step} of 3</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-500"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Recipient's Name</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="e.g. Grandma Rose"
                value={formData.recipientName}
                onChange={e => setFormData({...formData, recipientName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Occasion</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="e.g. 70th Birthday"
                value={formData.occasion}
                onChange={e => setFormData({...formData, occasion: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Language</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.language}
                onChange={e => setFormData({...formData, language: e.target.value})}
              >
                <option>English</option>
                <option>Yoruba</option>
                <option>Spanish</option>
                <option>French</option>
                <option>Pidgin</option>
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Music Genre</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {GENRES.map(genre => (
                  <button
                    key={genre.id}
                    type="button"
                    onClick={() => setFormData({...formData, genre: genre.id})}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                      formData.genre === genre.id 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                        : 'border-slate-100 hover:border-slate-200 text-slate-600'
                    }`}
                  >
                    <span className="text-2xl mb-1">{genre.icon}</span>
                    <span className="text-xs font-bold">{genre.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Mood</label>
              <div className="flex flex-wrap gap-2">
                {MOODS.map(mood => (
                  <button
                    key={mood.id}
                    type="button"
                    onClick={() => setFormData({...formData, mood: mood.id})}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                      formData.mood === mood.id 
                        ? 'bg-rose-500 text-white border-rose-500 shadow-md' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {mood.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Key Memories & Stories</label>
              <textarea 
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Tell us about the trip to Lagos, how they always laugh, their favorite food..."
                value={formData.memories}
                onChange={e => setFormData({...formData, memories: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Phrases to Include (Optional)</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="e.g. 'You're our superstar', 'Up Nepa!'"
                value={formData.mustInclude}
                onChange={e => setFormData({...formData, mustInclude: e.target.value})}
              />
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-all"
            >
              Back
            </button>
          )}
          <div className="flex-1" />
          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              className="px-10 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-rose-500 text-white font-bold hover:opacity-90 transition-all shadow-xl"
            >
              Create My Song
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SurveyForm;
