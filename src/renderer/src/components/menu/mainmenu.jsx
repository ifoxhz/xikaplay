import React from "react";
import {Button,ButtonGroup } from "@nextui-org/react";
import {FileIcon} from './buticon';
import { Card, CardBody,CardHeader, CardFooter,Image} from '@nextui-org/react'
import background from "@renderer/assets/hero-card.jpeg"
// const path = require("path")
// import {CameraIcon} from './CameraIcon';
// import { mpvCreate,mpvPlay } from "../mpv/libmpv";
// /import {ipcRenderer} from 'electron'


//  const {mpvCreate} = require('./libmpv')


export function MainMenu() {

  const PlayClick = async (uri) =>{
    console.log("PlayClick",uri)
    window.ipcRenderer.send('play', 'Hello from renderer process!');

     window.showOpenDialog().then((res) => {
      console.log("open file :",res)
     }).catch(e =>{ console.log("Failed to open file :",e)})
  }

  return (
   <Card className="w-[360px] h-full"
        isFooterBlurred
        radius="lg"
      >
        <Image
          alt="xika player"
          className="object-cover"
          src={background}
        />
        
        <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">

          <ButtonGroup>
          <Button className="text-tiny text-white bg-black/20" variant="light" color="default"  size="sm">
            Yong
          </Button>
          <Button onClick={PlayClick}PlayClick className="text-tiny text-white bg-black/20" variant="light" color="default"  size="sm">
            Open
          </Button>
          <Button className="text-tiny text-white bg-black/20" variant="light" color="default" size="sm">
            OpenUrl
          </Button>
          </ButtonGroup>
        </CardFooter>
      </Card>

  );
}
