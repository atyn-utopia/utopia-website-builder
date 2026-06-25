import { Suspense } from 'react'
import ChecklistRulesClient from './ChecklistRulesClient'
import PageShell from '@/components/PageShell'

export const metadata = { title: 'Checklist Rules · Utopia Wizard' }

export default function ChecklistRulesPage() {
  return (
    <PageShell backLabel="Dashboard" maxWidth={940}>
      <Suspense fallback={null}>
        <ChecklistRulesClient />
      </Suspense>
    </PageShell>
  )
}
