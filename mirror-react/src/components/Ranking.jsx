export default function Ranking({ title }) {
    return (
      <div className="flex h-125 w-50 z-10 bg-white !mt-10 rounded-xl shadow-md p-4 justify-center overflow-y-auto !py-4">
        <h3 className="text-gray-700 font-semibold">{title}</h3>
      </div>
    );
  }