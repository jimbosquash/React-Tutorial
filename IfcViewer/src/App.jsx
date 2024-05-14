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
import {useState} from "react"

function App() {
  const [ifcFile,setIfcFile] = useState();
  const [components,setComponents] = useState();
  const [theme,colorMode] = useMode();

  const handleIFCLoad = (loadedifcFile) => {
    if(!loadedifcFile)
      return;
    console.log("App: upload complete")
    setIfcFile(loadedifcFile);
    // add to bar chart display
}
const handleComponentsLoad = (newComponents) => {
  if(!newComponents)
    return;
  console.log("App: upload complete")
  setComponents(newComponents);
  // add to bar chart display
}

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
                <Route path='/' element={<DashBoard onComponentsSet={handleComponentsLoad} onIfcFileLoad={handleIFCLoad} />} />
                <Route path='/dashboard' element={<DashBoard  onComponentsSet={handleComponentsLoad} onIfcFileLoad={handleIFCLoad}  />} />
                <Route path='/table' element={<ElementTable />} />
                <Route path='/viewerOpenBim' element={<Viewer />} />
                <Route path='/viewerFiber' element={<ViewerFiber components={components} ifcModel={ifcFile} />} />
                <Route path='/viewerFun' element={<ViewerFun />} />
                <Route path='/viewerSpeckle' element={<ViewerSpeckle />} />
                {/* <Route path='/barChart' element={<Bar />} /> */}
              </Routes>
            </main>
          </div>
      </BrowserRouter>
    </ThemeProvider>
  </ColorModeContext.Provider>
  )
}

export default App
