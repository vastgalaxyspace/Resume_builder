import { Download, RefreshCw, AlertTriangle, Sparkles, Target, CheckCircle2, Moon } from 'lucide-react';
import Link from 'next/link';

export function ResultsScreen() {
  const criticalMissing = ['MLflow', 'Kubernetes', 'Spark', 'Airflow'];
  const niceToHave = ['Ray', 'Triton', 'Feast'];
  const hasSkills = ['Python', 'TensorFlow', 'SQL', 'PyTorch', 'Docker', 'Git', 'Pandas', 'NumPy', 'Scikit-learn', 'AWS', 'FastAPI', 'REST APIs'];

  const sections = [
    { name: 'Experience', status: 'strong', color: 'text-[#22C55E]', dotColor: 'bg-[#22C55E]' },
    { name: 'Skills', status: 'good', color: 'text-[#22C55E]', dotColor: 'bg-[#22C55E]' },
    { name: 'Summary', status: 'weak — too generic', color: 'text-[#F59E0B]', dotColor: 'bg-[#F59E0B]' },
    { name: 'Projects', status: 'missing — add project section', color: 'text-[#EF4444]', dotColor: 'bg-[#EF4444]' },
    { name: 'Certifications', status: 'not found', color: 'text-[#44445A]', dotColor: 'bg-[#44445A]' },
  ];

  const improvements = [
    {
      title: 'Add MLflow to your skills and experience',
      detail: 'MLflow appears in 87% of senior ML job postings in 2025. Include specific examples of experiment tracking, model versioning, or deployment pipelines.'
    },
    {
      title: 'Quantify your model impact',
      detail: 'Add metrics like "improved accuracy by 23%" or "reduced inference latency by 40%". Numbers make achievements concrete and memorable.'
    },
    {
      title: 'Add a Projects section',
      detail: 'Recruiters spend 6 seconds scanning — projects demonstrate hands-on skills and passion. Include 2-3 relevant ML projects with links.'
    },
    {
      title: 'Strengthen your technical summary',
      detail: 'Current summary is generic. Lead with your specialization: "ML Engineer with 5+ years building production recommendation systems at scale"'
    },
    {
      title: 'Highlight production ML experience',
      detail: 'Emphasize end-to-end ownership: data pipelines, model deployment, monitoring, A/B testing. Senior roles require production experience.'
    },
  ];

  const rewrites = [
    {
      before: 'Built machine learning models to improve user recommendations',
      after: 'Designed and deployed a collaborative filtering recommendation engine that increased user engagement by 34% and reduced churn by 18% across 2M+ users',
      why: 'Specific metrics, scale, and business impact make this compelling. Shows ownership from design through deployment.'
    },
    {
      before: 'Worked with data and created pipelines',
      after: 'Architected scalable data pipelines processing 500GB daily using Spark and Airflow, reducing processing time from 6 hours to 45 minutes',
      why: 'Quantifies scale, names technologies, and shows clear improvement. "Architected" implies senior ownership.'
    },
  ];

  return (
    <div className="min-h-[1200px] bg-[#0A0A0F]">
      <nav className="flex items-center justify-between gap-4 border-b border-[#1E1E2E] px-4 py-4 md:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="bg-gradient-to-r from-[#4F8EF7] to-[#7C5CFC] bg-clip-text text-xl font-medium text-transparent">
            Resume IQ
          </Link>
          <div className="px-3 py-1 rounded-full bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] text-xs text-[#8888A0]">
            AI-Powered · Live Market Data
          </div>
        </div>
        <button className="w-10 h-10 rounded-lg bg-[#111118] border border-[#1E1E2E] flex items-center justify-center hover:bg-[#1A1A24] transition-all duration-200">
          <Moon size={18} className="text-[#8888A0]" />
        </button>
      </nav>

      <div className="flex flex-col gap-4 border-b border-[#1E1E2E] bg-[#111118] px-4 py-4 lg:flex-row lg:items-center lg:justify-between md:px-8">
        <div className="flex flex-wrap items-center gap-4">
          <h3 className="text-[#F0F0F5]">Resume Analysis</h3>
          <div className="px-3 py-1 rounded-full bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] text-xs text-[#8888A0]">
            Senior ML Engineer at Google
          </div>
          <span className="text-sm text-[#44445A]">May 12, 2026 14:23</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="px-4 py-2 rounded-lg bg-transparent border border-[#1E1E2E] text-[#8888A0] hover:border-[#4F8EF7] hover:text-[#F0F0F5] transition-all duration-200 flex items-center gap-2">
            <Download size={16} />
            Download Report
          </button>
          <Link href="/" className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#4F8EF7] to-[#7C5CFC] text-[#F0F0F5] hover:shadow-[0_0_24px_rgba(79,142,247,0.3)] transition-all duration-200 flex items-center gap-2">
            <RefreshCw size={16} />
            Analyze Another
          </Link>
        </div>
      </div>

      <div className="px-4 py-8 md:px-8">
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] p-6 hover:-translate-y-0.5 hover:shadow-[0_4px_24px_rgba(79,142,247,0.15)] transition-all duration-200">
            <div className="text-sm text-[#8888A0] mb-2">ATS Score</div>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="#1E1E2E" strokeWidth="4" fill="none" />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#F59E0B"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray="175.93"
                    strokeDashoffset="52.78"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-gradient-to-br from-[#F59E0B] to-[#F97316] bg-clip-text text-transparent">73</span>
                </div>
              </div>
              <div className="text-[#F59E0B]">Good Match</div>
            </div>
          </div>

          <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] p-6 hover:-translate-y-0.5 hover:shadow-[0_4px_24px_rgba(34,197,94,0.15)] transition-all duration-200">
            <div className="text-sm text-[#8888A0] mb-2">Skills Matched</div>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-[#22C55E] to-[#10B981] bg-clip-text text-transparent text-3xl font-mono">12/18</div>
              <div className="text-[#22C55E]">Required skills found</div>
            </div>
          </div>

          <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] p-6 hover:-translate-y-0.5 hover:shadow-[0_4px_24px_rgba(239,68,68,0.15)] transition-all duration-200">
            <div className="text-sm text-[#8888A0] mb-2">Missing Critical</div>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-[#EF4444] to-[#DC2626] bg-clip-text text-transparent text-3xl font-mono">4</div>
              <div className="text-[#EF4444]">Must-add skills</div>
            </div>
          </div>

          <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] p-6 hover:-translate-y-0.5 hover:shadow-[0_4px_24px_rgba(79,142,247,0.15)] transition-all duration-200">
            <div className="text-sm text-[#8888A0] mb-2">Profile Strength</div>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-2 h-8 rounded-sm ${i <= 3 ? 'bg-[#4F8EF7]' : 'bg-[#1E1E2E]'}`}></div>
                ))}
              </div>
              <div className="text-[#4F8EF7]">Above average</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-2xl bg-[rgba(239,68,68,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] overflow-hidden hover:-translate-y-0.5 transition-all duration-200">
              <div className="bg-[rgba(239,68,68,0.05)] border-b border-[#1E1E2E] px-6 py-3 flex items-center gap-2">
                <AlertTriangle size={18} className="text-[#EF4444]" />
                <span className="text-[#F0F0F5]">Critical Skills Missing</span>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {criticalMissing.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-[#EF4444] font-mono text-sm flex items-center gap-2"
                    >
                      <span>×</span> {skill}
                    </span>
                  ))}
                </div>
                <div className="border-t border-[#1E1E2E] pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-[#F59E0B]" />
                    <span className="text-sm text-[#F59E0B]">Nice to Have</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {niceToHave.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-lg bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.3)] text-[#F59E0B] font-mono text-sm flex items-center gap-2"
                      >
                        <span>+</span> {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[rgba(34,197,94,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] overflow-hidden hover:-translate-y-0.5 transition-all duration-200">
              <div className="bg-[rgba(34,197,94,0.05)] border-b border-[#1E1E2E] px-6 py-3 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-[#22C55E]" />
                <span className="text-[#F0F0F5]">Skills You Already Have</span>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {hasSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-lg bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)] text-[#22C55E] font-mono text-sm flex items-center gap-2"
                    >
                      <span>✓</span> {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] overflow-hidden hover:-translate-y-0.5 transition-all duration-200">
              <div className="bg-[rgba(255,255,255,0.02)] border-b border-[#1E1E2E] px-6 py-3">
                <span className="text-[#F0F0F5]">Resume Sections</span>
              </div>
              <div className="p-6 space-y-3">
                {sections.map((section) => (
                  <div key={section.name} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${section.dotColor} animate-pulse`}></div>
                    <div className="flex-1 flex items-baseline gap-2">
                      <span className="text-[#F0F0F5]">{section.name}</span>
                      <span className="text-sm">—</span>
                      <span className={`text-sm ${section.color}`}>{section.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] overflow-hidden hover:-translate-y-0.5 transition-all duration-200">
              <div className="bg-[rgba(79,142,247,0.05)] border-b border-[#1E1E2E] px-6 py-3 flex items-center gap-2">
                <Target size={18} className="text-[#4F8EF7]" />
                <span className="text-[#F0F0F5]">What To Add / Improve</span>
              </div>
              <div className="p-6 space-y-6">
                {improvements.map((item, index) => (
                  <div key={index} className="border-l-2 border-[#4F8EF7] pl-4">
                    <div className="text-[#F0F0F5] mb-1">{index + 1}. {item.title}</div>
                    <p className="text-sm text-[#8888A0]">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] overflow-hidden hover:-translate-y-0.5 transition-all duration-200">
              <div className="bg-[rgba(255,255,255,0.02)] border-b border-[#1E1E2E] px-6 py-3 flex items-center gap-2">
                <span className="text-[#F0F0F5]">✏ Bullet Point Rewrites</span>
              </div>
              <div className="p-6 space-y-6">
                {rewrites.map((rewrite, index) => (
                  <div key={index} className="space-y-3">
                    <div>
                      <div className="inline-block px-2 py-0.5 rounded text-xs bg-[rgba(239,68,68,0.1)] text-[#EF4444] mb-2">BEFORE</div>
                      <p className="text-sm text-[#8888A0] opacity-60 line-through">{rewrite.before}</p>
                    </div>
                    <div className="text-[#8888A0] text-center">↓</div>
                    <div>
                      <div className="inline-block px-2 py-0.5 rounded text-xs bg-[rgba(34,197,94,0.1)] text-[#22C55E] mb-2">AFTER</div>
                      <p className="text-sm text-[#F0F0F5]">{rewrite.after}</p>
                    </div>
                    <details className="text-xs text-[#8888A0] cursor-pointer">
                      <summary className="hover:text-[#4F8EF7] transition-colors">Why this works</summary>
                      <p className="mt-2 pl-4 border-l border-[#1E1E2E]">{rewrite.why}</p>
                    </details>
                    {index < rewrites.length - 1 && <div className="border-t border-[#1E1E2E] pt-3"></div>}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border-l-2 border-[#4F8EF7] border-t border-r border-b border-[#1E1E2E] p-6 hover:-translate-y-0.5 transition-all duration-200">
              <h4 className="text-[#F0F0F5] mb-3">Overall Assessment</h4>
              <p className="text-sm text-[#8888A0] leading-relaxed mb-4">
                Your resume shows strong ML fundamentals and diverse experience. To land a senior role at Google, focus on adding production ML tooling (MLflow, Kubernetes), quantifying your impact with metrics, and showcasing end-to-end project ownership. The market fit is good but can be excellent with targeted improvements.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#8888A0]">Market fit:</span>
                  <span className="text-[#F59E0B] font-mono">73%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#1E1E2E] overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#F59E0B] to-[#F97316] rounded-full shadow-[0_0_12px_rgba(245,158,11,0.5)]" style={{ width: '73%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
