import { Suspense } from 'react'
import ReposClient from './ReposClient'
import PageShell from '@/components/PageShell'

export const metadata = { title: 'Connect Repos · Utopia Wizard' }

export default function ReposPage() {
  return (
    <PageShell backLabel="Dashboard" maxWidth={760}>
      <Suspense fallback={null}>
        <ReposClient />
      </Suspense>
    </PageShell>
  )
}
