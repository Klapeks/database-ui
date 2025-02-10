import { SideBar } from '../app/sidebar/Sidebar';
import { DatabaseViewer } from '../app/viewer/DatabaseViewer';
import { useDatabase } from '../app/database.store';
import { useEffect } from 'react';

function App() {
    const { databaseType, loadDatabaseInfo } = useDatabase();

    useEffect(() => {
        loadDatabaseInfo()
    }, []);

    if (!databaseType) {
        return <div>
            <p>Loading...</p>
        </div>
    }

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: "200px 1fr"
        }}>
            <SideBar />
            <div className="page-view"
            style={{
                position: 'sticky',
                top: 0,
                overflowX: "hidden",
                overflowY: "auto",
                width: '100%',
                height: '100dvh',
                padding: '15px',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <DatabaseViewer />
            </div>
        </div>
    )
}

export default App
