import MonitorTable from '@/components/MonitorTable'

export default function Home() {
  return (
    <main className="fade-in" style={{
      width: '100%',
      maxWidth: 1400,
      margin: '0 auto',
    }}>
      <MonitorTable />
    </main>
  )
}
