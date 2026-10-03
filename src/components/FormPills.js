import React from 'react';

// Επιλογές φόρμας ως «χάπια» που πατιούνται με τον αντίχειρα: ένα άγγιγμα αντί για
// άνοιγμα λίστας (select). type="radio" για μία επιλογή, "checkbox" για πολλές.
// Με required σε radio, ο browser ζητά να διαλέξεις μία πριν την αποστολή.
const Pills = ({ label, name, options, type = 'radio', required = false, defaultValue }) => (
  <fieldset className="nh-job-full nh-pills">
    <legend>{label}{required ? ' *' : ''}</legend>
    <div className="nh-pills-row">
      {options.map((o, i) => (
        <label key={o} className="nh-pill">
          <input
            type={type}
            name={type === 'checkbox' ? `${name}_${i + 1}` : name}
            value={o}
            required={required && type === 'radio'}
            defaultChecked={defaultValue === o}
          />
          <span>{o}</span>
        </label>
      ))}
    </div>
  </fieldset>
);

export default Pills;
