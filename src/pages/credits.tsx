export default function Credits() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-5xl font-bold mb-4 gradient-text">
        Credits
      </h1>

      <p className="text-lg text-muted-c mb-10">
        Built by students, for students.
      </p>

      <div className="grid gap-6">

        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-2xl font-bold mb-3">
            👑 Founder & Lead Developer
          </h2>

          <p className="text-xl font-semibold">
            Shayan Faaz K
          </p>

          <ul className="mt-3 space-y-2">
            <li>• StudyOS Vision</li>
            <li>• UI and Feature Design</li>
            <li>• XP and Streak System Concepts</li>
            <li>• User Account System Ideas</li>
            <li>• Feature Planning and Development</li>
          </ul>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-2xl font-bold mb-3">
            💡 Original Inspiration
          </h2>

          <p className="text-xl font-semibold">
            Sidharth S Menon
          </p>

          <p className="mt-3">
            Original Study Planner Idea and Inspiration
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-2xl font-bold mb-3">
            ❤️ Golden Supporters
          </h2>

          <div className="text-yellow-400 text-lg font-bold">
            No supporters yet.
          </div>

          <p className="mt-2 text-muted-c">
            Become the first Golden Supporter!
          </p>
        </div>

      </div>
    </div>
  );
}