import { Card, CardHeader } from '@mui/material';
import About from '@/components/page/home/About';

const Dashboard = () => (
  <Card>
    <div className="bg-black py-5">
      <About />
    </div>
  </Card>
);

export default Dashboard;
