import './styles.css'
import {Routes, Route,BrowserRouter} from "react-router-dom";

//import Viewer from './viewer.tsx';
import Viewer from './viewerMini.tsx';
import Sidebar from './bar';
import Team from './team';

function App() {
  return (
    <BrowserRouter>
    <div style={{ display: 'flex', height: '100vh' }}> {/* Flex container */}
      <Sidebar/>
      <main style={{ flex: 1, paddingLeft: '0px' }}> {/* Main content area */}
        <Routes>
          <Route path='/' element={<Viewer />} />
          <Route path='/viewer' element={<Team />} />
        </Routes>
      </main>
    </div>
  </BrowserRouter>
  )
}

export default App
