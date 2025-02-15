import { Layout as RaLayout } from 'react-admin';
import AppBar from '@/components/AppBar';

const Layout = (props: any) => <RaLayout {...props} appBar={AppBar} />;

export default Layout;
