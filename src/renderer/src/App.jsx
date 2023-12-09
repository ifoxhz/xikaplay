import logo from './assets/logo.svg'
import avatar from './assets/avatar-1.png'
import background from "./assets/hero-card.jpeg"
import './App.css'
import { Chip, User, Button, user, ScrollShadow,Listbox, ListboxItem } from '@nextui-org/react'
import { Card, CardBody,CardHeader, CardFooter,Image} from '@nextui-org/react'
import { useState, useEffect } from 'react'
import { db, setUser, getAllUser } from '@renderer/components/db/db'
import { MainMenu } from '@renderer/components/menu/mainmenu'



const sidebarOpen = true


export function App() {
  const [CurrentPeer, setCurrentPeer] = useState(null)
  // const [UserList, setUserList] = useState([])

  // peoples = readUserList()
  // console.log('read peoples', UserList)

  // useEffect(() => {
  //   getAllUser().then((items) => {
  //     console.log('setUserList:', items)
  //     setUserList(items)
  //   })
  // }, [])

    return (
      <div className="container flex flex-row">
      <MainMenu />

      <Card isFooterBlurred className="w-full h-full">
      <CardHeader className="absolute z-10 top-1 flex-col items-start">
        <p className="text-tiny text-white/60 uppercase font-bold">Your day your way</p>
        <h4 className="text-white/90 font-medium text-xl">Your checklist for better sleep</h4>
      </CardHeader>
      <Image
        removeWrapper
        alt="Relaxing app background"
        className="z-0 w-auto h-screen object-cover"
        src={avatar}
      />
      <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
        <div className="flex flex-grow gap-2 items-center">
          <Image
            alt="Breathing app icon"
            className="rounded-full w-10 h-11 bg-black"
            src="/images/breathing-app-icon.jpeg"
          />
          <div className="flex flex-col">
            <p className="text-tiny text-white/60">Breathing App</p>
            <p className="text-tiny text-white/60">Get a good night's sleep.</p>
          </div>
        </div>
        <Button radius="full" size="sm">Get App</Button>
      </CardFooter>
    </Card>
      </div>
    )
  
}

export default App
