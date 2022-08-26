import * as ui from '@dcl/ui-scene-utils'
import { CONFIG } from "./config"
import resources, { setSection } from './dcl-scene-ui-workaround/resources'
import { IntervalUtil } from "./interval-util"


const atlas = new Texture('images/DispenserAtlas.png')
let tooltipContainer:UIContainerRect
let directionTipText:UIText

export function updateDirectionText(str:string){
  if(directionTipText.value != str ) directionTipText.value = str
}

const camera = Camera.instance

const bottomCenter = CONFIG.centerGround.clone().subtract(new Vector3(CONFIG.center.x,0,CONFIG.center.z))
const northDir = bottomCenter.subtract(CONFIG.centerGround)

let lastPosition:Vector3=Vector3.Zero()

const dirIntervalCheck = new IntervalUtil(1000/4)

let walkDirUp = false
let cameraFaceUp = false

class DirectionsSystem implements ISystem{
  update(dt: number): void {
    if(!dirIntervalCheck.update(dt)){
      return
    }

    
    const walkDir = camera.position.subtract(lastPosition).normalize()
    const dotCamera = Vector3.Dot(northDir, Vector3.Forward().rotate(camera.rotation))
    
    if(walkDir.z > 0){
      walkDirUp = true
    }else if(walkDir.z < 0){
      walkDirUp = false
    }

    
    if(dotCamera > 0){
      //log("ART PLAZA")
      cameraFaceUp = false
    }
    else{
      //log("VOLTAR")
      cameraFaceUp = true
    }
    
    //log("dir ",dotCamera,"walkDir",walkDir,"walkDirUp",walkDirUp,"cameraFaceUp",cameraFaceUp)

    lastPosition.copyFrom(camera.position)

    if(!cameraFaceUp){
      if(camera.position.z < 20){ 
        updateDirectionText("Arrived at South End (Exit Arches)")  
      }else if(camera.position.z < 50){
        updateDirectionText("Arriving at Sound End") 
      }else{
        updateDirectionText("South End This Way")
      }
    }else{
      if(camera.position.z > 300){
        //286 lower bound 
        updateDirectionText("Arrived at North End")  
      }else if(camera.position.z > 250){
        updateDirectionText("Arriving at North End")  
      }else{
        updateDirectionText("North End This Way")
      }
    }

  }
}

engine.addSystem(new DirectionsSystem())


 
export function createTooltip(){

    tooltipContainer = new UIContainerRect(ui.canvas)
    tooltipContainer.width = "100%"
    tooltipContainer.height = "100%"
    tooltipContainer.visible = true

    const bgImage = new UIImage(tooltipContainer, atlas)
    setSection( bgImage, resources.backgrounds.promptBackground )

    bgImage.opacity = .9

    bgImage.vAlign = "bottom" 
    bgImage.hAlign = "center" 

    bgImage.positionX = 0
    bgImage.positionY = 0
 
    bgImage.width = 320
    bgImage.height = 40

    const text = directionTipText =  new UIText(tooltipContainer)
    text.color = Color4.White()
    text.fontSize = 18
    text.vAlign = "bottom" 
    text.hAlign = "center" 
    text.hTextAlign = "center"
    text.positionX = 0
    text.positionY = 10
    
    //setSection(new UIImage(tooltipContainer, atlas), resources.images.tooltipBG)
    //setSection(new UIImage(tooltipContainer, atlas), resources.images.tooltipClose)
    //setText(new UIText(tooltipContainer), resources.text.toolTipHeader)
    //setText(new UIText(tooltipContainer), resources.text.toolTipText)
}


export function hideToolTip(){
    tooltipContainer.visible = false
}

createTooltip()