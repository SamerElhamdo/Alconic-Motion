import { T } from '../tokens';

const HUE: Record<string, number> = {
  Story: 295, Motion: 255, Assets: 205, Audio: 335, Vision: 275, QC: 165, Render: 70,
};

type Status = 'done' | 'work' | 'wait' | 'fail';

interface AgentRobotProps { name: string; status: Status; }

export function AgentRobot({ name, status }: AgentRobotProps) {
  const h = HUE[name] ?? 285;
  const wait = status === 'wait';
  const fail = status === 'fail';
  const body = wait ? `oklch(0.5 0.03 ${h})` : `oklch(0.8 0.11 ${h})`;
  const eye = fail ? T.coral : wait ? `oklch(0.6 0.04 ${h})` : `oklch(0.92 0.14 ${h})`;
  const eyeH = status === 'done' ? 2 : status === 'work' ? 7 : fail ? 3 : 5;
  const tile = `oklch(0.24 ${wait ? 0.02 : 0.05} ${h} / .7)`;

  return (
    <div style={{
      position: 'relative', width: 48, height: 48, flex: 'none',
      display: 'grid', placeItems: 'center', borderRadius: 12, background: tile,
    }}>
      <div style={{ position: 'absolute', top: 5, left: 23, width: 2, height: 7, background: body }} />
      <div style={{
        position: 'absolute', top: 2, left: 21, width: 6, height: 6,
        borderRadius: '50%', background: eye, boxShadow: `0 0 8px ${eye}`,
      }} />
      <div style={{
        marginTop: 7, width: 36, height: 28, borderRadius: 11, background: body,
        display: 'grid', placeItems: 'center',
        boxShadow: 'inset 0 -3px 0 rgba(0,0,0,.28),inset 0 2px 0 rgba(255,255,255,.35)',
      }}>
        <div style={{
          width: 26, height: 14, borderRadius: 7, background: 'oklch(0.12 0.02 285)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <div style={{ width: 5, height: eyeH, borderRadius: 3, background: eye, boxShadow: `0 0 6px ${eye}` }} />
          <div style={{ width: 5, height: eyeH, borderRadius: 3, background: eye, boxShadow: `0 0 6px ${eye}` }} />
        </div>
      </div>
    </div>
  );
}
