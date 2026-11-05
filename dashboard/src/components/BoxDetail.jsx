import EventItem from './EventItem'
import HolderTag from './HolderTag'
import LiabilityCard from './LiabilityCard'
import StatusPill from './StatusPill'

function Header({ box, timeline, onBack }) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <button
        type="button"
        onClick={onBack}
        className="rounded-lg border-2 border-slate-300 bg-white px-4 py-2 text-xl font-semibold hover:bg-slate-50"
      >
        &larr; All boxes
      </button>
      <h2 className="text-5xl font-extrabold">{timeline.box_id}</h2>
      <StatusPill level={timeline.status} size="lg" />
      <div className="flex items-center gap-3 lg:ml-auto">
        <span className="text-lg font-medium uppercase tracking-wide text-slate-500">Held by</span>
        <HolderTag holder={box.current_holder} className="text-2xl" />
      </div>
    </div>
  )
}

function Timeline({ events }) {
  const sorted = [...events].sort((a, b) => a.seq - b.seq)
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-xl font-bold uppercase tracking-wide text-slate-500">
        What happened <span className="font-normal normal-case">(oldest first)</span>
      </h3>
      {sorted.length === 0 ? (
        <p className="text-2xl text-slate-600">No events yet</p>
      ) : (
        <ol className="flex flex-col gap-2">
          {sorted.map((event) => (
            <EventItem key={`${event.seq}-${event.time}`} event={event} />
          ))}
        </ol>
      )}
    </section>
  )
}

function BoxDetail({ box, timeline, onBack }) {
  return (
    <div className="flex flex-col gap-5">
      <Header box={box} timeline={timeline} onBack={onBack} />
      <LiabilityCard liable={timeline.liable} events={timeline.events} />
      <Timeline events={timeline.events} />
    </div>
  )
}

export default BoxDetail
