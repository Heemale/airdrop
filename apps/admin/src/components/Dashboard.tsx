import { Card, CardContent, CardHeader } from '@mui/material';
import SuiConnectButton from '@/components/web3/sui/SuiConnectButton';

const Dashboard = () => (
  <Card>
    <CardHeader title="Dashboard" />
    <CardContent>
      <div className="flex gap-3">
        <SuiConnectButton />
      </div>
    </CardContent>
  </Card>
);

export default Dashboard;
