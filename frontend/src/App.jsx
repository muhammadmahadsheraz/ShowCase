import {Routes,Route,Navigate} from "react-router"; 
import HomePage from './Pages/HomePage.jsx';
import DashboardPage from './Pages/DashboardPage.jsx'
import ProblemsPage from './Pages/ProblemsPage.jsx';
import { useUser } from '@clerk/clerk-react';
import {Toaster} from 'react-hot-toast';

function App() {
  const {isSignedIn,isLoaded} = useUser();
  if (!isLoaded) return null;

  return (
    <>
    <Routes>
    <Route path = "/" element = {!isSignedIn ? <HomePage/> :<Navigate to = {"/dashboard"} />}/>
    <Route path = "/dashboard" element = {isSignedIn ? <DashboardPage/> :<Navigate to = {"/"} />}/>
    <Route path = "/problems" element = { isSignedIn ? <ProblemsPage/> : <Navigate to= {"/"}/>}/>
    </Routes>
    <Toaster toastOption = {{duration:4000}}/>
    </>
  )
}
// tailwind : ui, react-router : navigate,daisyui ; ui,react-hot-toast: notification(ui), react query :(tenstack query)
// tenstack query used instaed of standard use state and the useEffect for dataFetching and setting from backend  not because
//  it simplifies lines of code but it also covers the errors as use effect runs once 
// and in case of errors it still ran so it wont run again youd have to apply the fixes
//  by your own logic also you dont have to refresh the page to run the useeffect again 
// because tenstack can make sure it runs ehenever the page is in focus. 
export default App
