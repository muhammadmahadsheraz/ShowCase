import './App.css'
import { SignInButton, SignUpButton, UserButton,SignedIn,SignedOut ,SignOutButton} from '@clerk/clerk-react'
function App() {

  return (
    <>
      <h1>Hello World</h1>    
<SignedOut>
     <SignInButton  mode="modal">  
      <button>Log In</button>
     </SignInButton>  
  </SignedOut>
<SignedIn>
  <SignOutButton  mode="modal"/>
</SignedIn>
  <UserButton />
    </>
  )
}

export default App
