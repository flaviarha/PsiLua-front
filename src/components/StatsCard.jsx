export const StatsCard = ({ title, value, icon: Icon }) => {
    return (
      <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
        {Icon && <Icon className="w-8 h-8 mx-auto mb-2 text-gray-700" />}
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-gray-700">{title}</p>
      </div>
    );
  };