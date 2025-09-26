export const DashboardCard = ({ title, children}) => (
    <div className="rounded-xl border-gray-200 bg-white shadow p-5 space-y-2">
        <h3 className="text-xl font-semibold text-dark">{title}</h3>
        {children}
    </div>
)