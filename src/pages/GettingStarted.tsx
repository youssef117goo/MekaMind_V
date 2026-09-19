import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const GettingStarted: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      title: 'تحميل المشروع',
      icon: 'fa-download',
      color: 'from-cyan-400 to-cyan-600',
      description: 'حمّل ملفات المشروع أو انسخها لمجلد على جهازك',
      code: null,
      details: [
        'افتح المشروع في المنصة الحالية',
        'اضغط على زر "Download" لتحميل ملف ZIP',
        'فك الضغط عن الملف في مجلد مناسب',
      ],
    },
    {
      title: 'تثبيت Node.js',
      icon: 'fa-node-js',
      color: 'from-green-400 to-green-600',
      description: 'تأكد من تثبيت Node.js الإصدار 18+',
      code: 'node --version\nnpm --version',
      details: [
        'حمّل Node.js من الموقع الرسمي',
        'الإصدار المطلوب: 18 أو أحدث',
        'npm يأتي تلقائياً مع Node.js',
      ],
    },
    {
      title: 'تثبيت المكتبات',
      icon: 'fa-box',
      color: 'from-blue-400 to-blue-600',
      description: 'ثبّت كل المكتبات المطلوبة للمشروع',
      code: 'npm install',
      details: [
        'افتح Terminal في مجلد المشروع',
        'شغّل الأمر npm install',
        'انتظر حتى ينتهي التثبيت',
      ],
    },
    {
      title: 'تشغيل المشروع',
      icon: 'fa-play',
      color: 'from-purple-400 to-purple-600',
      description: 'شغّل المشروع في وضع التطوير',
      code: 'npm run dev',
      details: [
        'افتح المتصفح على http://localhost:5173',
        'المشروع هيشتغل في وضع التطوير',
        'أي تعديل في الكود هيظهر تلقائياً',
      ],
    },
    {
      title: 'بناء للنشر',
      icon: 'fa-rocket',
      color: 'from-orange-400 to-orange-600',
      description: 'ابني المشروع للنشر على السيرفر',
      code: 'npm run build',
      details: [
        'الملفات الجاهزة هتكون في مجلد dist/',
        'ارفع محتويات dist/ على أي استضافة',
        'يدعم Vercel, Netlify, وأي سيرفر',
      ],
    },
  ];

  const projectFiles = [
    { path: 'src/App.tsx', desc: 'المكون الرئيسي + الراوتر', icon: 'fa-file-code' },
    { path: 'src/pages/Home.tsx', desc: 'الصفحة الرئيسية', icon: 'fa-home' },
    { path: 'src/pages/BoardsPage.tsx', desc: 'عرض اللوحات المتاحة', icon: 'fa-microchip' },
    { path: 'src/pages/Workspace.tsx', desc: 'مساحة العمل - تصميم + توليد كود', icon: 'fa-laptop-code' },
    { path: 'src/pages/AdminLogin.tsx', desc: 'تسجيل دخول الأدمن', icon: 'fa-shield-alt' },
    { path: 'src/pages/AdminDashboard.tsx', desc: 'لوحة تحكم الأدمن', icon: 'fa-tachometer-alt' },
    { path: 'src/store/appStore.ts', desc: 'إدارة الحالة والبيانات', icon: 'fa-database' },
    { path: 'src/types/index.ts', desc: 'تعريفات TypeScript', icon: 'fa-code' },
    { path: 'src/components/Navbar.tsx', desc: 'شريط التنقل', icon: 'fa-bars' },
    { path: 'src/components/ProtectedRoute.tsx', desc: 'حماية المسارات', icon: 'fa-lock' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 mb-4">
            <i className="fas fa-book text-cyan-400"></i>
            <span className="text-cyan-300 text-sm font-medium">Getting Started Guide</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            <i className="fas fa-rocket mr-3 text-cyan-400"></i>
            إزاي تحمّل وتشغّل المشروع
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            دليل شامل خطوة بخطوة لتحميل مشروع MekaMind وتشغيله على جهازك
          </p>
        </motion.div>

        {/* Quick Download */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/20 rounded-2xl p-8 mb-12"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                <i className="fas fa-download mr-2 text-cyan-400"></i>
                تحميل سريع
              </h2>
              <p className="text-gray-300">
                حمّل المشروع كملف ZIP جاهز للاستخدام
              </p>
            </div>
            <button
              onClick={() => {
                // Create a text file with project structure info
                const content = `MekaMind Project - Download Instructions
==========================================

This project is built with React + Vite + TypeScript + Tailwind CSS

To run locally:
1. Install Node.js 18+ from https://nodejs.org/
2. Run: npm install
3. Run: npm run dev
4. Open: http://localhost:5173

Demo Credentials:
- Admin: admin@mekamind.com / admin123
- User: user@mekamind.com / user123

For full source code, visit the project files section below.
`;
                const blob = new Blob([content], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'mekamind-instructions.txt';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25 whitespace-nowrap"
            >
              <i className="fas fa-file-archive mr-2"></i> تحميل التعليمات
            </button>
          </div>
        </motion.div>

        {/* Steps */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <i className="fas fa-list-ol mr-3 text-blue-400"></i>
            خطوات التشغيل
          </h2>

          {/* Step Navigation */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeStep === index
                    ? 'bg-gray-800 border border-cyan-500/30 text-white'
                    : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
                }`}
              >
                <span className={`w-6 h-6 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white text-xs font-bold`}>
                  {index + 1}
                </span>
                <span>{step.title}</span>
              </button>
            ))}
          </div>

          {/* Active Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-8"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${steps[activeStep].color} flex items-center justify-center`}>
                  <i className={`fas ${steps[activeStep].icon} text-white text-xl`}></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{steps[activeStep].title}</h3>
                  <p className="text-gray-400">{steps[activeStep].description}</p>
                </div>
              </div>

              {/* Code Block */}
              {steps[activeStep].code && (
                <div className="mb-6">
                  <div className="flex items-center justify-between bg-gray-950 border border-gray-800 rounded-xl px-4 py-3">
                    <code className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                      {steps[activeStep].code}
                    </code>
                    <button
                      onClick={() => copyToClipboard(steps[activeStep].code!, activeStep)}
                      className="text-gray-400 hover:text-white transition-colors ml-4"
                    >
                      {copiedIndex === activeStep ? (
                        <i className="fas fa-check text-green-400"></i>
                      ) : (
                        <i className="fas fa-copy"></i>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Details */}
              <div className="space-y-3">
                {steps[activeStep].details.map((detail, i) => (
                  <div key={i} className="flex items-start space-x-3 space-x-reverse">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-cyan-400 text-xs font-bold">{i + 1}</span>
                    </div>
                    <p className="text-gray-300">{detail}</p>
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-800">
                <button
                  onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                  disabled={activeStep === 0}
                  className="px-4 py-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <i className="fas fa-arrow-right ml-2"></i> السابق
                </button>
                <span className="text-gray-500 text-sm">{activeStep + 1} / {steps.length}</span>
                <button
                  onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
                  disabled={activeStep === steps.length - 1}
                  className="px-4 py-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  التالي <i className="fas fa-arrow-left mr-2"></i>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Project Files */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <i className="fas fa-folder-open mr-3 text-yellow-400"></i>
            ملفات المشروع
          </h2>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="grid gap-0">
              {projectFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-6 py-4 border-b border-gray-800 last:border-b-0 hover:bg-gray-800/30 transition-colors"
                >
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <i className={`fas ${file.icon} text-cyan-400 w-5 text-center`}></i>
                    <code className="text-gray-200 font-mono text-sm" dir="ltr">{file.path}</code>
                  </div>
                  <span className="text-gray-500 text-sm">{file.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Credentials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <i className="fas fa-key mr-3 text-amber-400"></i>
            بيانات الدخول التجريبية
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900 border border-red-500/20 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-shield-alt text-red-400"></i>
                </div>
                <h3 className="text-lg font-bold text-white">Admin Access</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-800 rounded-lg p-3">
                  <span className="text-gray-500 text-xs block mb-1">الرابط</span>
                  <code className="text-cyan-300 font-mono text-sm">/admin/login</code>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <span className="text-gray-500 text-xs block mb-1">البريد الإلكتروني</span>
                  <code className="text-white font-mono text-sm">admin@mekamind.com</code>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <span className="text-gray-500 text-xs block mb-1">كلمة المرور</span>
                  <code className="text-white font-mono text-sm">admin123</code>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-green-500/20 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-user text-green-400"></i>
                </div>
                <h3 className="text-lg font-bold text-white">User Access</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-800 rounded-lg p-3">
                  <span className="text-gray-500 text-xs block mb-1">البريد الإلكتروني</span>
                  <code className="text-white font-mono text-sm">user@mekamind.com</code>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <span className="text-gray-500 text-xs block mb-1">كلمة المرور</span>
                  <code className="text-white font-mono text-sm">user123</code>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <span className="text-gray-500 text-xs block mb-1">ملاحظة</span>
                  <span className="text-gray-400 text-sm">يتم تسجيل الدخول من نفس صفحة الأدمن</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <i className="fas fa-exclamation-triangle mr-3 text-yellow-400"></i>
            ملاحظات مهمة
          </h2>
          <div className="space-y-4">
            {[
              {
                icon: 'fa-database',
                title: 'البيانات التجريبية',
                desc: 'المشروع يستخدم Store محلي في الذاكرة. البيانات تُفقد عند إعادة تحميل الصفحة. للربط بقاعدة بيانات حقيقية، استبدل appStore.ts بـ API calls.',
                color: 'blue',
              },
              {
                icon: 'fa-usb',
                title: 'الرفع عبر USB',
                desc: 'ميزة Web Serial API للرفع المباشر تعمل فقط على متصفحات Chrome و Edge.',
                color: 'green',
              },
              {
                icon: 'fa-shield-alt',
                title: 'الأمان في الإنتاج',
                desc: 'يجب استخدام Backend حقيقي مع JWT tokens وقاعدة بيانات مشفرة. لا تستخدم بيانات تجريبية في بيئة الإنتاج.',
                color: 'red',
              },
              {
                icon: 'fa-server',
                title: 'النشر',
                desc: 'بعد npm run build، ارفع محتويات مجلد dist/ على أي استضافة (Vercel, Netlify, أو سيرفر خاص).',
                color: 'purple',
              },
            ].map((note, index) => (
              <div key={index} className={`bg-gray-900 border border-${note.color}-500/20 rounded-xl p-5 flex items-start space-x-4 space-x-reverse`}>
                <div className={`w-10 h-10 bg-${note.color}-500/10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <i className={`fas ${note.icon} text-${note.color}-400`}></i>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">{note.title}</h4>
                  <p className="text-gray-400 text-sm">{note.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-gray-800 text-gray-300 hover:text-white rounded-xl border border-gray-700 hover:border-gray-500 transition-all"
          >
            <i className="fas fa-arrow-right ml-2"></i> العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GettingStarted;
