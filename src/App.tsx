import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Flag,
  Clock3,
  CheckCircle2,
  Image as ImageIcon,
  ShieldCheck,
  ChevronRight,
  CircleDot,
  LockKeyhole,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

const statusTone: Record<string, string> = {
  completed: 'bg-black text-white',
  current: 'bg-neutral-800 text-white',
  upcoming: 'bg-neutral-100 text-neutral-800 border border-neutral-200',
  approved: 'bg-black text-white',
  review: 'bg-neutral-900 text-white',
  coordination: 'bg-neutral-100 text-neutral-900 border border-neutral-200',
  pending: 'bg-neutral-100 text-neutral-900 border border-neutral-200',
  notSubmitted: 'bg-neutral-100 text-neutral-900 border border-neutral-200',
};

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vReFJxB81B_Vt6Aw2_1rlKfQJWDd65r94-XRczm5dqwNxxTQ2t8rutzDBSLRvDcohOy0uT-FuAE219z/pub?gid=0&single=true&output=csv";

const fallbackProjectData = {
  portalTitle: 'SGA Client Portal',
  intro: 'This portal serves as a direct window into the progress of your project.',
  privacyNote: 'Private project link. Curated for client-facing visibility.',
  project: {
    name: 'CCA Vackar High School',
    client: 'CCTA / CCA Vackar Initiative',
    location: 'McAllen, Texas',
    type: 'Private Educational Campus',
    summary:
      'This portal provides a clear, curated view of major project progress, milestones, and next steps for the CCA Vackar High School initiative.',
    phase: 'Programming / Early Design Coordination',
    progress: 24,
    progressLabel: 'Early design alignment underway',
    permitStatus: {
      label: 'Pending owner-directed advancement',
      tone: 'pending',
      detail:
        'Formal permitting has not commenced. Current activity remains focused on program validation, scope alignment, and institutional coordination.',
    },
    jurisdictionStatus: {
      label: 'In coordination',
      tone: 'coordination',
      detail:
        'Coordination with South Texas College remains an important input item for instructional space requirements and overall planning alignment.',
    },
    nextSteps: [
      'Finalize updated space program for client review and confirmation.',
      'Incorporate current direction regarding combined Buildings A and B and the revised classroom count.',
      'Continue coordination related to instructional-space requirements and planning assumptions.',
    ],
  },
  milestones: [
    {
      title: 'Initial project direction established',
      status: 'completed',
      date: 'Completed',
      note: 'Overall project direction and phase framework established.',
    },
    {
      title: 'Program revision in progress',
      status: 'current',
      date: 'Current',
      note: 'Program is being refined to reflect combined Buildings A and B and the revised classroom count.',
    },
    {
      title: 'Updated program confirmation',
      status: 'upcoming',
      date: 'Pending',
      note: 'Updated program document to be reviewed and confirmed as the formal basis for continued advancement.',
    },
    {
      title: 'Institutional coordination input',
      status: 'upcoming',
      date: 'Pending',
      note: 'South Texas College coordination to inform classroom and instructional-space assumptions.',
    },
  ],
  updates: [
    {
      date: 'March 2026',
      title: 'Project scope direction refined',
      body:
        'Current direction reflects the consolidation of Buildings A and B into a single building strategy, with Building C remaining part of the overall project scope.',
    },
    {
      date: 'March 2026',
      title: 'Programming revision underway',
      body:
        'The updated programming document is being prepared to confirm key space allocations and provide a formal basis for continued design advancement.',
    },
    {
      date: 'March 2026',
      title: 'Institutional coordination remains active',
      body:
        'Input related to instructional space requirements remains an active coordination item and will help guide continued project alignment.',
    },
  ],
  gallery: [
    {
      title: 'Concept Rendering',
      subtitle: 'Reserved for curated presentation image',
      image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1600&q=80',
    },
    {
      title: 'Campus Character',
      subtitle: 'Reserved for additional rendering or site image',
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80',
    },
  ],
};

function StatCard({
  icon: Icon,
  label,
  value,
  subvalue,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  subvalue?: string;
}) {
  return (
    <Card className="rounded-2xl border border-neutral-200 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">{label}</p>
            <div className="mt-2 text-lg font-semibold text-neutral-950">{value}</div>
            {subvalue ? <p className="mt-1 text-sm text-neutral-600">{subvalue}</p> : null}
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-2.5">
            <Icon className="h-5 w-5 text-neutral-700" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusPill({ children, tone = 'pending' }: { children: React.ReactNode; tone?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusTone[tone]}`}>
      {children}
    </span>
  );
}

export default function App() {
  const completedMilestones = useMemo(
    () => projectData.milestones.filter((m) => m.status === 'completed').length,
    []
  );

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6"
        >
          <div className="rounded-[28px] border border-neutral-200 bg-white shadow-sm">
            <div className="flex flex-col gap-8 p-6 lg:flex-row lg:items-end lg:justify-between lg:p-8">
              <div className="max-w-3xl">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="rounded-full border-neutral-300 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-neutral-700">
                    {projectData.portalTitle}
                  </Badge>
                  <Badge variant="outline" className="rounded-full border-neutral-300 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-neutral-700">
                    Pilot Project
                  </Badge>
                  <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs text-neutral-600">
                    <LockKeyhole className="h-3.5 w-3.5" />
                    {projectData.privacyNote}
                  </div>
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
                  {projectData.project.name}
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
                  {projectData.intro}
                </p>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-neutral-500">
                  {projectData.project.summary}
                </p>
              </div>

              <div className="w-full max-w-md rounded-[24px] border border-neutral-200 bg-neutral-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Overall Progress</p>
                    <div className="mt-2 text-3xl font-semibold text-neutral-950">{projectData.project.progress}%</div>
                  </div>
                  <div className="rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700">
                    {projectData.project.phase}
                  </div>
                </div>
                <div className="mt-4">
                  <Progress value={projectData.project.progress} className="h-2.5 rounded-full" />
                </div>
                <p className="mt-3 text-sm text-neutral-600">{projectData.project.progressLabel}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Building2}
            label="Project Type"
            value={projectData.project.type}
            subvalue={projectData.project.location}
          />
          <StatCard
            icon={Flag}
            label="Current Phase"
            value={projectData.project.phase}
            subvalue={projectData.project.client}
          />
          <StatCard
            icon={CheckCircle2}
            label="Completed Milestones"
            value={`${completedMilestones} of ${projectData.milestones.length}`}
            subvalue="Curated project checkpoints"
          />
          <StatCard
            icon={Clock3}
            label="Portal Purpose"
            value="Window to Progress"
            subvalue="Major milestones, updates, and next steps"
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="space-y-6 xl:col-span-8">
            <Card className="rounded-[28px] border border-neutral-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Project Milestones</CardTitle>
                <CardDescription>Completed, current, and upcoming checkpoints.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {projectData.milestones.map((item, index) => (
                  <div key={index} className="rounded-2xl border border-neutral-200 bg-white p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex gap-3">
                        <div className="mt-0.5 rounded-full border border-neutral-200 bg-neutral-50 p-2">
                          {item.status === 'completed' ? (
                            <CheckCircle2 className="h-4 w-4 text-neutral-800" />
                          ) : item.status === 'current' ? (
                            <CircleDot className="h-4 w-4 text-neutral-800" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-neutral-500" />
                          )}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-semibold text-neutral-950">{item.title}</h3>
                            <StatusPill tone={item.status}>{item.status}</StatusPill>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-neutral-600">{item.note}</p>
                        </div>
                      </div>
                      <div className="text-sm text-neutral-500">{item.date}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-[28px] border border-neutral-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Major Updates</CardTitle>
                <CardDescription>Formal project updates intended for client-facing visibility.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {projectData.updates.map((update, index) => (
                  <div key={index} className="rounded-2xl border border-neutral-200 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-neutral-950">{update.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-neutral-600">{update.body}</p>
                      </div>
                      <div className="whitespace-nowrap text-sm text-neutral-500">{update.date}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 xl:col-span-4">
            <Card className="rounded-[28px] border border-neutral-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Next Steps</CardTitle>
                <CardDescription>Immediate items currently shaping forward progress.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {projectData.project.nextSteps.map((step, index) => (
                    <div key={index} className="flex gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="mt-0.5 rounded-full border border-neutral-200 bg-white px-2 py-1 text-xs font-medium text-neutral-600">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-6 text-neutral-700">{step}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[28px] border border-neutral-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Jurisdiction & Permit Status</CardTitle>
                <CardDescription>High-level public-process visibility.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-neutral-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-500">Permitting</h3>
                    <StatusPill tone={projectData.project.permitStatus.tone}>{projectData.project.permitStatus.label}</StatusPill>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">{projectData.project.permitStatus.detail}</p>
                </div>

                <div className="rounded-2xl border border-neutral-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-500">Institutional Coordination</h3>
                    <StatusPill tone={projectData.project.jurisdictionStatus.tone}>{projectData.project.jurisdictionStatus.label}</StatusPill>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">{projectData.project.jurisdictionStatus.detail}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="mt-6 rounded-[28px] border border-neutral-200 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-2.5">
                <ImageIcon className="h-5 w-5 text-neutral-700" />
              </div>
              <div>
                <CardTitle className="text-xl">Project Imagery</CardTitle>
                <CardDescription>Curated visual material for milestone communication.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {projectData.gallery.map((item, index) => (
                <div key={index} className="overflow-hidden rounded-[24px] border border-neutral-200 bg-neutral-50">
                  <div className="aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-semibold text-neutral-950">{item.title}</h3>
                    <p className="mt-1 text-sm text-neutral-600">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Separator className="my-6 bg-neutral-200" />

        <div className="flex flex-col gap-3 rounded-[24px] border border-neutral-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-800">
              <ShieldCheck className="h-4 w-4" />
              Controlled visibility
            </div>
            <p className="mt-1 text-sm text-neutral-600">
              This portal is intentionally curated to communicate progress with clarity while keeping internal operational detail private.
            </p>
          </div>
          <div className="text-xs uppercase tracking-[0.16em] text-neutral-500">Sam Garcia Architect, LLC</div>
        </div>
      </div>
    </div>
  );
}
