import Headbar from "../components/dashboard/Headbar";
import SummaryLayer from "../components/common/SummaryLayer";

const Dashboard: React.FC = () => {
    return (
    <div className="p-3">
      <Headbar />
      <SummaryLayer />
    </div>
  );
};

export default Dashboard;
