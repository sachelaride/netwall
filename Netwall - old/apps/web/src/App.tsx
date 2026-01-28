import { useState } from 'react';
import { Layout, type Tab } from './components/Layout';
import { NetworkScan } from './components/NetworkScan';
import { DeviceList } from './components/DeviceList';
import { TopologyMap } from './components/TopologyMap';
import { MonitoredDevices } from './components/MonitoredDevices';
import { Dashboard } from './components/Dashboard';
import { Reports } from './components/Reports';

function App() {
    const [currentTab, setCurrentTab] = useState<Tab>('dashboard');

    return (
        <Layout currentTab={currentTab} onNavigate={setCurrentTab}>
            {currentTab === 'dashboard' && <Dashboard />}

            {currentTab === 'network' && (
                <NetworkScan />
            )}

            {currentTab === 'devices' && (
                <DeviceList />
            )}

            {currentTab === 'topology' && (
                <TopologyMap />
            )}

            {currentTab === 'monitoring' && (
                <MonitoredDevices />
            )}

            {currentTab === 'reports' && (
                <Reports />
            )}
        </Layout>
    );
}

export default App;
