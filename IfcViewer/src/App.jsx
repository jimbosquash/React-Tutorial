import './styles.css'
import {Routes, Route,BrowserRouter} from "react-router-dom";

import Viewer from './components/viewers/viewerMini.tsx';
import ViewerFun from './components/viewers/viewerFun';
import ViewerFiber from './components/viewers/viewerFiber';
import ViewerSpeckle from './components/viewers/viewerSpeckle.jsx';
import DashBoard from './components/dashboard/dashBoard';
import Sidebar from './bar';
import Team from './components/team';

function App() {
  return (
    <BrowserRouter>
    <div style={{ display: 'flex', height: '100vh' }}> {/* Flex container */}
      <Sidebar />
      <main style={{ flex: 1, paddingLeft: '0px' }}> {/* Main content area */}
        <Routes>
          <Route path='/dashboard' element={<DashBoard />} />
          <Route path='/viewerOpenBim' element={<Viewer />} />
          <Route path='/viewerFiber' element={<ViewerFiber />} />
          <Route path='/viewerFun' element={<ViewerFun />} />
          <Route path='/viewerSpeckle' element={<ViewerSpeckle />} />
        </Routes>
      </main>
    </div>
  </BrowserRouter>
  )
}

export default App
