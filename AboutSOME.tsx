import React from 'react';

const AboutSOME: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">About S.O.M.E. Fitness</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">🌺 A Method Grounded in Real Life</h2>
        <p>
          S.O.M.E. stands for <strong>Sleep, Oxygen, Move, Eat</strong> — four pillars of sustainable wellness.
          It's not about chasing perfection or overwhelming data. It's about tuning into your body daily and doing the basics well, consistently.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">👣 From Miami to Hawaiʻi</h2>
        <p>
          The method was created by a licensed physical therapist with over 20 years of experience helping people recover and thrive —
          from surfers and triathletes on the <strong>Kona Coast of the Big Island</strong> to retirees and everyday movers.
        </p>
        <p className="mt-2">
          Raised in <strong>Miami</strong> in a Cuban immigrant family, she was supported by a hardworking mother and grandparents who instilled the values of
          resilience, compassion, and dedication. Her clinical career is backed by orthopedic rehab, sports injury research, and a love for outdoor living:
          surfing, swimming, fishing, and walking her best friend, <strong>Gunner</strong>.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">🐾 Inspired by Gunner</h2>
        <p>
          Gunner, a powerful and intelligent Dogo Argentino, has been more than a companion — he's a teacher. Through years of training and partnership,
          he's reminded her that the keys to progress in fitness and life are:
        </p>
        <ul className="list-disc list-inside mt-2 ml-4">
          <li>Patience</li>
          <li>Courage</li>
          <li>Compassion</li>
          <li>Gentleness</li>
          <li>Discipline</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">💪 The S.O.M.E. Method</h2>
        <ul className="list-disc list-inside ml-4">
          <li><strong>Sleep</strong> – Recovery is where growth happens.</li>
          <li><strong>Oxygen</strong> – Breath builds calm, focus, and balance.</li>
          <li><strong>Move</strong> – Daily motion is the foundation of strength and health.</li>
          <li><strong>Eat</strong> – Food should energize and support your lifestyle.</li>
        </ul>
        <p className="mt-2">
          S.O.M.E. was made for real people with real lives. Whether you're training hard or just trying to feel better, this method helps you check in with
          your body and build long-term habits — one breath, one step, one day at a time.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">✨ The Heart of S.O.M.E.</h2>
        <p>
          This app isn't about doing everything. It's about doing what matters — consistently.
        </p>
        <p className="font-semibold mt-2 text-lg">
          Because you don't need everything. <br />
          <span className="text-indigo-600">You just need S.O.M.E.</span>
        </p>
      </section>
    </div>
  );
};

export default AboutSOME;