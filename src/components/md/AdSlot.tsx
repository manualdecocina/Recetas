/** Layout-only placeholder. Do not place third-party script here. */
export default function AdSlot({ placement }: { placement: 'after-ingredients' | 'after-notes' }) {
  return <div className="md-ad-slot" data-md-ad-placement={placement} aria-hidden="true" />;
}
