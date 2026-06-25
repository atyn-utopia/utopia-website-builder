import NewProjectForm from './NewProjectForm'
import PageShell from '@/components/PageShell'

export const metadata = { title: 'New Project · Utopia Wizard' }

export default function NewProjectPage() {
  return (
    <PageShell backLabel="Dashboard" maxWidth={620}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>New Project</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0, lineHeight: 1.5 }}>
          Spin up a GitHub repo for a new site, then copy the prompt into Claude to build it.
        </p>
      </header>
      <NewProjectForm />
    </PageShell>
  )
}
