import { Suspense } from 'react'
import PlaybooksClient from './PlaybooksClient'
import PageShell from '@/components/PageShell'

export const metadata = { title: 'Team Playbooks · Utopia Wizard' }

export default function PlaybooksPage() {
  return (
    <PageShell backLabel="Dashboard" maxWidth={940}>
      <Suspense fallback={null}>
        <PlaybooksClient />
      </Suspense>
    </PageShell>
  )
}
