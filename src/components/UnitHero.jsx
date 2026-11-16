import React from 'react';
import { Icon } from './UIPrimitives.jsx';
import { HeroNetwork } from './HeroNetwork.jsx';

// Navy backdrop shared with the home header: unit-tinted aurora + starfield.
export function UnitHeroBg() {
  return (
    <>
      <span className="rt-aurora u-hero-aurora" aria-hidden="true" />
      <HeroNetwork />
    </>
  );
}

// Objectives sit on a light card under the dark banner so long text stays readable.
export function UnitObjectives({ items }) {
  return (
    <section className="u-objectives" aria-label="จุดประสงค์การเรียนรู้">
      <span className="eyebrow">จุดประสงค์การเรียนรู้</span>
      <ul className="objectives">
        {items.map(o => (
          <li key={o}>
            <Icon name="target" size={16} />
            {o}
          </li>
        ))}
      </ul>
    </section>
  );
}
