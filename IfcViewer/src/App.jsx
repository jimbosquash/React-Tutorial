import './styles.css'
import {Routes, Route,BrowserRouter} from "react-router-dom";
import Viewer from './components/viewers/viewerMini.tsx';
import ViewerFun from './components/viewers/viewerFun';
import ViewerFiber from './components/viewers/viewerFiber';
import ViewerSpeckle from './components/viewers/viewerSpeckle.jsx';
import DashBoard from './scenes/dashboard/dashBoard';
import Sidebar from './scenes/global/sideBar';
import Bar from './scenes/bar';
import { ColorModeContext } from './theme';
import {useMode} from "./theme"
import { CssBaseline, ThemeProvider } from '@mui/material';
import Topbar from "./scenes/global/topBar"
import ElementTable from './scenes/elementTable';

function App() {

  const [theme,colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <BrowserRouter>
          <div style={{ display: 'flex', height: '100%' }}> {/* Flex container */}
            <Sidebar />
            <main style={{ flex: 1, paddingLeft: '0px' }}> {/* Main content area */}
              <Topbar/>
              <Routes>
                <Route path='/' element={<DashBoard />} />
                <Route path='/dashboard' element={<DashBoard />} />
                <Route path='/table' element={<ElementTable />} />
                <Route path='/viewerOpenBim' element={<Viewer />} />
                <Route path='/viewerFiber' element={<ViewerFiber />} />
                <Route path='/viewerFun' element={<ViewerFun />} />
                <Route path='/viewerSpeckle' element={<ViewerSpeckle />} />
                <Route path='/barChart' element={<Bar />} />
              </Routes>
            </main>
          </div>
      </BrowserRouter>
    </ThemeProvider>
  </ColorModeContext.Provider>
  )
}

export default App
