import Headbar from "../components/common/Headbar";
import SummaryLayer from "../components/common/SummaryLayer";

const Dashboard: React.FC = () => {
    return (
    <div className="p-3">
      {/* <h1 className="text-2xl font-semibold text-slate-800 mb-4">Dashboard</h1> */}
      <Headbar />
      <SummaryLayer />
    </div>
  );
};

export default Dashboard;
