import { createArches } from './arches'
import { SceneActiveUtil } from './sceneActiveUtil'


export const _scene = new Entity('_scene')
engine.addEntity(_scene)
const transform = new Transform({
  position: new Vector3(0, 0, 0),
  rotation: Quaternion.Euler(0, 0, 0),
  scale: new Vector3(1, 1, 1),
})


//async function start(){

// #1
const myVideoClip = new VideoClip('videos/TunnelVideoTemplate2.mp4')
 

// #2
const myVideoTexture = new VideoTexture(myVideoClip)
myVideoTexture.loop = true

const sceneActiveUtil = new SceneActiveUtil( setVideoPlaying )

function setVideoPlaying(val: boolean) {
  if (val) {
    if(sceneActiveUtil.capturedUserInput){
      myVideoTexture.play()
    }else{
      log("input not captured, cannot play yet")
    } 
  } else {
    myVideoTexture.pause()
  } 
}

 
// #3


const videoMat = new Material()
videoMat.albedoTexture = myVideoTexture
videoMat.emissiveTexture = myVideoTexture
videoMat.alphaTexture = myVideoTexture
videoMat.emissiveIntensity = 4
videoMat.emissiveColor = Color3.White()
videoMat.roughness = 1
videoMat.specularIntensity = 1
videoMat.transparencyMode = 2
 
//videoMat.emissiveTexture = myVideoTexture
//setVideoPlaying(true) //called in scene triggers to play or not


const ARCH_NUMBER = 28// how many arches to make
const ARCH_SPACING = 8// how much space between




const arches  = createArches( {
  parent: _scene,
  myVideoTexture: myVideoTexture,
  archSpacing: ARCH_SPACING,
  archQty:ARCH_NUMBER,
  material: videoMat
  } 
  )

log("arches",arches)

 
//executeTask(async () => {
  sceneActiveUtil.init()
//})


//}

//start() 