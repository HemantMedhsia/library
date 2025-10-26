import Headbar from "../components/dashboard/Headbar";
import SummaryLayer from "../components/common/SummaryLayer";
import api from "../services/api";
import { useToast } from "../hooks/useToast";
import ToastContainer from "../components/common/Toast/ToastContainer";
import axios from "axios";

const Dashboard: React.FC = () => {
  const { toasts, addToast, removeToast, defaultPosition } =
    useToast("bottom-left");
  const helloApiCall = async () => {
    alert("Hello API Call");
    api.post("auth/refresh").then((response) => {
      addToast(JSON.stringify(response.data.message));
    }).catch((error) => {
      addToast("Error: " + error.message);
    });
  };
  const helloApiCall2 = async () => {
    api.get("/hello", { withCredentials: true }).then((response) => {
      addToast(JSON.stringify(response.data));
    }).catch((error) => {
      addToast("Error: " + error.message);
    });
  };

  return (
    <div className="p-3">
      <Headbar />
      <SummaryLayer />
      <div className="mt-3">
        <button
          onClick={helloApiCall}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Say Hello !
        </button>
        <button
          onClick={helloApiCall2}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Say Hello on refresh !
        </button>
      </div>
      <ToastContainer
        toasts={toasts}
        removeToast={removeToast}
        position={defaultPosition}
      />
    </div>
  );
};

export default Dashboard;
