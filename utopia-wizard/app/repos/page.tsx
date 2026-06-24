import { Suspense } from 'react'
import ReposClient from './ReposClient'

export const metadata = { title: 'Connect Repos · Utopia Wizard' }

export default function ReposPage() {
  return (
    <Suspense fallback={null}>
      <ReposClient />
    </Suspense>
  )
}
