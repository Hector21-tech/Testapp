/**
 * Help Page - Framtida Implementation
 * 
 * En dedikerad hjälpsida med vanliga frågor, tutorials och support.
 * Placeholder för framtida utveckling.
 */

import React from 'react';
import { QuestionMarkCircleIcon, ChatBubbleLeftRightIcon, BookOpenIcon } from '@heroicons/react/24/outline';

export function HelpPage() {
  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="heading-xl mb-2">Hjälp & Support</h1>
            <p className="body text-neutral-600">
              Få svar på dina frågor och lär dig mer om AnnonsHjälpen
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Vanliga Frågor */}
          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <QuestionMarkCircleIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Vanliga Frågor</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Hitta snabba svar på de vanligaste frågorna om att skapa och hantera annonser.
            </p>
            <button className="btn-primary btn-sm w-full" disabled>
              Kommer snart
            </button>
          </div>

          {/* Tutorials */}
          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpenIcon className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Tutorials & Guider</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Steg-för-steg guider som hjälper dig att få ut det mesta av dina annonser.
            </p>
            <button className="btn-primary btn-sm w-full" disabled>
              Kommer snart
            </button>
          </div>

          {/* Kontakta Support */}
          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Kontakta Support</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Behöver du personlig hjälp? Vårt supportteam finns här för dig.
            </p>
            <button className="btn-primary btn-sm w-full" disabled>
              Kommer snart
            </button>
          </div>
        </div>

        {/* Temporary Info */}
        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
          <h4 className="font-semibold text-amber-800 mb-2">Under Utveckling</h4>
          <p className="text-sm text-amber-700">
            Hjälpsidan är under utveckling. Har du frågor just nu kan du kontakta oss direkt via e-post eller telefon.
          </p>
          <div className="mt-4 space-y-1 text-sm text-amber-600">
            <p>📧 support@annonshjälpen.se</p>
            <p>📞 08-123 45 67</p>
          </div>
        </div>

        {/* Quick Links - Placeholder */}
        <div className="mt-8">
          <h3 className="font-semibold text-slate-900 mb-4">Snabblänkar (Kommer snart)</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card p-4">
              <h4 className="font-medium text-slate-900 mb-2">Kom igång</h4>
              <p className="text-sm text-neutral-600">Lär dig grunderna för att skapa din första annons</p>
            </div>
            <div className="card p-4">
              <h4 className="font-medium text-slate-900 mb-2">Budget & Prissättning</h4>
              <p className="text-sm text-neutral-600">Förstå hur budgetering fungerar och optimera dina kostnader</p>
            </div>
            <div className="card p-4">
              <h4 className="font-medium text-slate-900 mb-2">Målgruppsdefiniering</h4>
              <p className="text-sm text-neutral-600">Hitta och nå rätt kunder för ditt företag</p>
            </div>
            <div className="card p-4">
              <h4 className="font-medium text-slate-900 mb-2">Resultatanalys</h4>
              <p className="text-sm text-neutral-600">Förstå dina annonsprestanda och förbättra resultaten</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}