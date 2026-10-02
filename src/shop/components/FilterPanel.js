import React, { useEffect, useState } from 'react';
import { BRANDS, CATEGORIES, HAIR_TYPES, LINES, NEEDS, TYPES, t as tr } from '../catalog';
import Stars from './Stars';

const Group = ({ title, children, open = true, count = 0 }) => (
  <details className="sh-fgroup" open={open}>
    <summary>
      <span>{title}</span>
      {count > 0 && <span className="sh-fgroup-count">{count}</span>}
    </summary>
    <div className="sh-fgroup-body">{children}</div>
  </details>
);

const Options = ({ name, items, selected, counts, onToggle, limit = 8, t }) => {
  const [all, setAll] = useState(false);
  const visible = items.filter((i) => (counts[i.key] || 0) > 0 || selected.includes(i.key));
  const shown = all ? visible : visible.slice(0, limit);
  return (
    <>
      <ul className="sh-opts">
        {shown.map((i) => {
          const id = `f-${name}-${i.key}`.replace(/[^a-zA-Z0-9-]/g, '_');
          const on = selected.includes(i.key);
          return (
            <li key={i.key}>
              <input id={id} type="checkbox" checked={on} onChange={() => onToggle(name, i.key)} />
              <label htmlFor={id}>
                <span>{i.label}</span>
                <span className="sh-opt-count">{counts[i.key] || 0}</span>
              </label>
            </li>
          );
        })}
      </ul>
      {visible.length > limit && (
        <button type="button" className="sh-more" onClick={() => setAll(!all)}>
          {all ? t.showLess : `${t.showMore} (${visible.length - limit})`}
        </button>
      )}
    </>
  );
};

const PriceRange = ({ state, update, t }) => {
  const [min, setMin] = useState(state.pmin ?? '');
  const [max, setMax] = useState(state.pmax ?? '');
  useEffect(() => {
    setMin(state.pmin ?? '');
    setMax(state.pmax ?? '');
  }, [state.pmin, state.pmax]);
  const apply = () => update({ pmin: min === '' ? null : Number(min), pmax: max === '' ? null : Number(max) });
  return (
    <form
      className="sh-price-range"
      onSubmit={(e) => {
        e.preventDefault();
        apply();
      }}
    >
      <label>
        <span>{t.min} €</span>
        <input type="number" inputMode="decimal" min="0" value={min} onChange={(e) => setMin(e.target.value)} onBlur={apply} />
      </label>
      <span aria-hidden="true">–</span>
      <label>
        <span>{t.max} €</span>
        <input type="number" inputMode="decimal" min="0" value={max} onChange={(e) => setMax(e.target.value)} onBlur={apply} />
      </label>
    </form>
  );
};

const FilterPanel = ({ lang, t, f, hasRatings }) => {
  const { state, counts, toggle, update } = f;
  const lbl = (list) => list.map((x) => ({ key: x.key, label: tr(x, lang) }));
  return (
    <div className="sh-filters">
      <Group title={t.brand} count={state.brand.length}>
        <Options name="brand" t={t} items={BRANDS.map((b) => ({ key: b.key, label: b.name }))} selected={state.brand} counts={counts.brand} onToggle={toggle} />
      </Group>
      <Group title={t.category} count={state.cat.length}>
        <Options name="cat" t={t} items={lbl(CATEGORIES)} selected={state.cat} counts={counts.cat} onToggle={toggle} />
      </Group>
      <Group title={t.need} count={state.need.length}>
        <Options name="need" t={t} items={lbl(NEEDS)} selected={state.need} counts={counts.need} onToggle={toggle} limit={7} />
      </Group>
      <Group title={t.hairType} count={state.hair.length}>
        <Options name="hair" t={t} items={lbl(HAIR_TYPES)} selected={state.hair} counts={counts.hair} onToggle={toggle} />
      </Group>
      <Group title={t.type} count={state.type.length} open={false}>
        <Options name="type" t={t} items={lbl(TYPES)} selected={state.type} counts={counts.type} onToggle={toggle} limit={10} />
      </Group>
      <Group title={t.line} count={state.line.length} open={false}>
        <Options name="line" t={t} items={LINES.map((l) => ({ key: l, label: l }))} selected={state.line} counts={counts.line} onToggle={toggle} />
      </Group>
      <Group title={t.price} count={(state.pmin !== null ? 1 : 0) + (state.pmax !== null ? 1 : 0)} open={false}>
        <PriceRange state={state} update={update} t={t} />
      </Group>
      {hasRatings && (
        <Group title={t.rating} count={state.rating ? 1 : 0} open={false}>
          <ul className="sh-opts">
            {[4, 3].map((n) => (
              <li key={n}>
                <input id={`f-rating-${n}`} type="radio" name="rating" checked={state.rating === n} onChange={() => update({ rating: n })} />
                <label htmlFor={`f-rating-${n}`}>
                  <span><Stars value={n} label={t.stars(n)} /> {t.andUp}</span>
                </label>
              </li>
            ))}
          </ul>
        </Group>
      )}
      <Group title={t.availability} count={(state.stock ? 1 : 0) + (state.priced ? 1 : 0) + (state.wish ? 1 : 0)}>
        <ul className="sh-opts">
          {[
            ['stock', t.inStockOnly],
            ['priced', t.pricedOnly],
            ['wish', t.onlyWishlist]
          ].map(([k, label]) => (
            <li key={k}>
              <input id={`f-${k}`} type="checkbox" checked={state[k]} onChange={() => update({ [k]: !state[k] })} />
              <label htmlFor={`f-${k}`}><span>{label}</span></label>
            </li>
          ))}
        </ul>
      </Group>
    </div>
  );
};

export default FilterPanel;
