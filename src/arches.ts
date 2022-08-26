import { CONFIG } from './config'


const archStructureShape = new GLTFShape('models/structure2.glb')

archStructureShape.withCollisions = true
archStructureShape.isPointerBlocker = true
archStructureShape.visible = true

export type CreateArchArgsType={
  parent:Entity
  myVideoTexture:VideoTexture,
  archSpacing: number
  archQty: number
  material:Material
}

export type ArchesType={
  arches:ArchInstType[]
}
export type ArchInstType={
  myVideoTexture:VideoTexture,
  index: number
  planes: Entity[]
}

const ARC_CENTER_POS = new Vector3(CONFIG.sizeX / 2, 13, 8)
const WALLS_CENTER_POS = new Vector3(CONFIG.sizeX / 2, 6.5, 8)

export function createArches(args:CreateArchArgsType) {
  
  const arches:ArchInstType[] = []
  const myVideoTexture = args.myVideoTexture

  const _scene = args.parent
  const ARCH_SPACING = args.archSpacing
  const ARCH_NUMBER = args.archQty

  // Define UV offsets

  const uOffsetA_INC = 0.1865
  const uOffsetB_INC = 0.07837
  const vOffset_INC = 0.0277

  let uOrigin = 0
  let vOrigin = 0
  let uOffsetA = uOffsetA_INC
  let uOffsetB = uOffsetB_INC
  let vOffset = vOffset_INC


  let arcRotOffset = (180 / 9)//11.25

  // #3
  const videoMat = args.material

  const archCenterPos = new Vector3().copyFrom(ARC_CENTER_POS)
  const wallCenterPos = new Vector3().copyFrom(WALLS_CENTER_POS)

  const ARC_PLANE_WORLD_UP_DIR = Vector3.Backward()
  const WALL1_PLANE_WORLD_UP_DIR = Vector3.Backward()
  const WALL2_PLANE_WORLD_UP_DIR = WALL1_PLANE_WORLD_UP_DIR



  for (let j = 0; j < ARCH_NUMBER; j++) {
    const planes:Entity[] = []

    //reset this each loop
    let uvRow = 0

    //const zOffset = 8*j
    const zOffsetAdd = ARCH_SPACING * 2
 
    if (j > 0) {
      archCenterPos.z += zOffsetAdd
      wallCenterPos.z += zOffsetAdd
    }


    const archPositions: Vector3[] = [
      new Vector3(2.53284, 15.6788, archCenterPos.z),
      new Vector3(4.58309, 20.6285, archCenterPos.z),
      new Vector3(8.37147, 24.4169, archCenterPos.z),
      new Vector3(13.3212, 26.4672, archCenterPos.z),
      new Vector3(18.6788, 26.4672, archCenterPos.z),
      new Vector3(23.6285, 24.4169, archCenterPos.z),
      new Vector3(27.4169, 20.6285, archCenterPos.z),
      new Vector3(29.4672, 15.6788, archCenterPos.z)
    ]

    //structure
    const structureEntity = new Entity('structureEntity.' + j)
    engine.addEntity(structureEntity)
    structureEntity.setParent(_scene)
    structureEntity.addComponentOrReplace(archStructureShape)
    const transform2 = new Transform({
      position: new Vector3(16, 0, archCenterPos.z),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    })
    structureEntity.addComponentOrReplace(transform2)


    /*
    const centerPlane = new Entity()
    centerPlane.addComponent(new Transform({
      position: WALLS_CENTER_POS.clone(),
      rotation: Quaternion.Euler(90,90,90),
      scale: new Vector3(29,1,29)
    })) 
    centerPlane.addComponent(new PlaneShape())
    engine.addEntity(centerPlane)
    */

    /*
      const uOffsetA_INC = 0.1865
      const uOffsetB_INC = 0.07837
      const vOffset_INC = 0.0277*/

    const testuOrigin = uOrigin
    const testvOffset = vOffset
    const testuOffsetA = uOffsetA//+vOffset_INC //no
    const testvOrigin = vOrigin//+vOffset_INC //no
    //uOrigin = .01 
    // S1 
    const S1 = new Entity("plane."+j+"."+1)
    const planeS1 = new PlaneShape()
    planeS1.uvs = [

      /*
      testuOrigin,testvOffset,  //lower left
      testuOffsetA,testvOffset, //lower right
      testuOffsetA,testvOrigin, //upper right
      testuOrigin,testvOrigin, //upper left
      */

      uOrigin, vOffset_INC * (j + 1), //lower left
      uOffsetA, vOffset_INC * (j + 1), //lower right
      uOffsetA, vOffset_INC * (j), //upper right
      uOrigin, vOffset_INC * (j),  //upper left  

      /*
      //row 1 S1
      0,0.0277,
      0.1865,0.0277,
      0865,0,
      0,0,
      */

      /*
      //row 2 S1
      0,0.0554, //lower left
      0.1865,0.0554, //lower right
      0.1865,0+vOffset_INC, //upper right
      0,0+vOffset_INC,  //upper left  
      */


      //row 3 S1
      /*
      0,0.0831,
      0.1865,0.0831,
      0.1865,0+(vOffset_INC*2),
      0,0+(vOffset_INC*2),*/

      uOrigin, vOffset_INC * (j + 1), //lower left
      uOffsetA, vOffset_INC * (j + 1), //lower right
      uOffsetA, vOffset_INC * (j), //upper right
      uOrigin, vOffset_INC * (j),  //upper left  
    ]
    S1.addComponent(planeS1)

    S1.addComponent(
      new Transform({
        position: new Vector3(2, 6.5, wallCenterPos.z),
        scale: new Vector3(13, 8, 1),
        //rotation: Quaternion.Euler(0, 90, 90),
      })
    )
    S1.getComponent(Transform).lookAt(wallCenterPos, WALL1_PLANE_WORLD_UP_DIR)
    S1.addComponent(videoMat)
    //also would it be hard to add S1^0   S1^1. to denote the rows.
    log(j, "uvRow", uvRow, 0, "xRot", null, S1.getComponent(Transform).rotation.eulerAngles, planeS1.uvs)

    planes.push(S1)

    //myVideoTexture.loop = true
    //myVideoTexture.playing = true
    engine.addEntity(S1)

    // screen2
    for (let x = 0; x < 8; x++) {
      uvRow++
      /*
      //number the planes for me
      const S2txt = new Entity()
      S2txt.addComponent(new TextShape(x.toFixed(0)))
      S2txt.addComponent(
        new Transform({
          position: archPositions[x],
          scale: new Vector3(5.46253, 6, 1)//,
          //rotation: Quaternion.Euler( xRot, 90, 90),
        })
      )
      engine.addEntity(S2txt)*/

      if (x >= 3 && CONFIG.sizeX <= 16) {
        log("plot not big enough")
        continue
      }

      const S2 = new Entity("plane."+j+"."+x)
      const planeS2 = new PlaneShape()
      planeS2.uvs = [
        uOrigin + uOffsetA + (uOffsetB * (uvRow - 1)), vOffset_INC * (j + 1), //lower left
        uOrigin + uOffsetA + (uOffsetB * (uvRow)), vOffset_INC * (j + 1), //lower right
        uOrigin + uOffsetA + (uOffsetB * (uvRow)), vOffset_INC * (j), //upper right
        uOrigin + uOffsetA + (uOffsetB * (uvRow - 1)), vOffset_INC * (j),  //upper left  

        uOrigin + uOffsetA + (uOffsetB * (uvRow - 1)), vOffset_INC * (j + 1), //lower left
        uOrigin + uOffsetA + (uOffsetB * (uvRow)), vOffset_INC * (j + 1), //lower right
        uOrigin + uOffsetA + (uOffsetB * (uvRow)), vOffset_INC * (j), //upper right
        uOrigin + uOffsetA + (uOffsetB * (uvRow - 1)), vOffset_INC * (j),  //upper left  
      ]
      const xRot = (arcRotOffset) * (uvRow)

      S2.addComponent(planeS2)
      S2.addComponent(
        new Transform({
          position: archPositions[x],
          scale: new Vector3(5.46253, 8, 1),
          //rotation: Quaternion.Euler( xRot, 90, 90),
        })
      )
      S2.getComponent(Transform).lookAt(archCenterPos, ARC_PLANE_WORLD_UP_DIR)
      log(j, "uvRow", uvRow, x, "xRot", xRot, S2.getComponent(Transform).rotation.eulerAngles, planeS2.uvs)
      S2.addComponent(videoMat)

      planes.push(S2)

      engine.addEntity(S2)
    }

    /*
      uOrigin,vOffset_INC*(j+1), //lower left
      uOffsetA,vOffset_INC*(j+1), //lower right
      uOffsetA,vOffset_INC*(j), //upper right
      uOrigin,vOffset_INC*(j),  //upper left  
    */
    // screen10
    uvRow++
    const S10 = new Entity("plane."+j+"."+10)
    const planeS10 = new PlaneShape()
    planeS10.uvs = [
      1 - uOrigin, vOffset_INC * (j + 1),
      1 - uOffsetA, vOffset_INC * (j + 1),
      1 - uOffsetA, vOffset_INC * (j),
      1 - uOrigin, vOffset_INC * (j),

      1 - uOrigin, vOffset_INC * (j + 1),
      1 - uOffsetA, vOffset_INC * (j + 1),
      1 - uOffsetA, vOffset_INC * (j),
      1 - uOrigin, vOffset_INC * (j),
    ]

    S10.addComponent(planeS10)
    log("uvRow /////// " + uvRow)
    S10.addComponent(
      new Transform({
        position: new Vector3(30, 6.5, wallCenterPos.z),
        scale: new Vector3(13, 8, 1),//new Vector3(5.46253, 6, 1),
        rotation: Quaternion.Euler((arcRotOffset * uvRow), 270, 90),
      })
    )
    //S10.getComponent(Transform).lookAt(wallCenterPos,WALL2_PLANE_WORLD_UP_DIR)
    log(j, "uvRow", uvRow, "xRot", S10.getComponent(Transform).rotation.eulerAngles, planeS10.uvs)


    S10.addComponent(videoMat)
    planes.push(S10)
    engine.addEntity(S10)

    //uOffsetA += uOffsetA_INC
    //uOffsetB += uOffsetB_INC 
    vOffset += vOffset_INC
    //uOrigin += uOffsetB_INC 
    //vOrigin += uOffsetA_INC    

    const archInst:ArchInstType = {index:j,myVideoTexture:myVideoTexture,planes:planes}
    arches.push(archInst)
  }

  

  const frameRowOffset = 28
  const ratio = 1280 / 720
  const rowCnt = 8
 
  if(CONFIG.showFullVideoDebugPanel){ 
    const debugPanelZOffset = -5 
    const debugSize = 2

    /*
    const backDropForTransparentVideo = new Entity()
    backDropForTransparentVideo.addComponent(new Transform({
      position: WALLS_CENTER_POS.clone().subtract(new Vector3(0, 4, debugPanelZOffset - .1)),
      rotation: Quaternion.Euler(0, 180, 0),
      scale: new Vector3(6.5 * ratio, 6+4, 6 * ratio)
    }))
    backDropForTransparentVideo.addComponent( new PlaneShape() )
    engine.addEntity(backDropForTransparentVideo)*/

    const fullVideo = new Entity()
    fullVideo.addComponent(new Transform({
      position: WALLS_CENTER_POS.clone().subtract(new Vector3(0, 4 - .9, debugPanelZOffset)),
      rotation: Quaternion.Euler(0, 180, 0),
      scale: new Vector3(debugSize * ratio, debugSize, debugSize * ratio)
    }))
    const planefullVideo = new PlaneShape()
    
    fullVideo.addComponent(new OnPointerDown(() => {
      log("myVideoTexture.playing", myVideoTexture.playing)
      if (myVideoTexture.playing) {
        fullVideo.getComponent(OnPointerDown).hoverText = "Full Video Debug Panel (Play)\ndisable me with CONFIG.showFullVideoDebugPanel=false"
        myVideoTexture.pause()
      } else {
        fullVideo.getComponent(OnPointerDown).hoverText = "Full Video Debug Panel (Pause)\ndisable me with CONFIG.showFullVideoDebugPanel=false"
        myVideoTexture.play()
      }
    }, { hoverText: "Full Video Debug Panel (Pause)\ndisable me with CONFIG.showFullVideoDebugPanel=false" }))
    fullVideo.addComponent(planefullVideo)
    fullVideo.addComponent(videoMat)
    engine.addEntity(fullVideo)
    
 

    const bottomLeftFrame = new Entity()
    bottomLeftFrame.addComponent(new Transform({
      position: WALLS_CENTER_POS.clone().subtract(new Vector3(3, 1, debugPanelZOffset)),
      rotation: Quaternion.Euler(0, 180, 0),
      scale: new Vector3(debugSize * ratio, debugSize, debugSize * ratio)
    }))
    const planeB = new PlaneShape()
    planeB.uvs = [
      uOrigin, vOffset_INC * (frameRowOffset + rowCnt), //lower left
      uOffsetA + uOffsetB / 2, vOffset_INC * (frameRowOffset + rowCnt), //lower right
      uOffsetA + uOffsetB / 2, vOffset_INC * (frameRowOffset), //upper right
      uOrigin, vOffset_INC * (frameRowOffset),  //upper left 

      uOrigin, vOffset_INC * (frameRowOffset + rowCnt), //lower left
      uOffsetA + uOffsetB / 2, vOffset_INC * (frameRowOffset + rowCnt), //lower right
      uOffsetA + uOffsetB / 2, vOffset_INC * (frameRowOffset), //upper right
      uOrigin, vOffset_INC * (frameRowOffset),  //upper left 

    ]

    bottomLeftFrame.addComponent(planeB) 
    bottomLeftFrame.addComponent(videoMat)
    engine.addEntity(bottomLeftFrame)

    const bottomRightFrame = new Entity()
    bottomRightFrame.addComponent(new Transform({
      position: WALLS_CENTER_POS.clone().add(new Vector3(3, -1, -1*debugPanelZOffset)),
      rotation: Quaternion.Euler(0, 180, 0),
      scale: new Vector3(debugSize*2 * ratio, debugSize, debugSize * ratio)
    }))
    const planeC = new PlaneShape()
    planeC.uvs = [
      uOffsetA + uOffsetB / 2, vOffset_INC * (frameRowOffset + rowCnt), //lower left
      1 - uOffsetA + uOffsetA, vOffset_INC * (frameRowOffset + rowCnt), //lower right
      1 - uOffsetA + uOffsetA, vOffset_INC * (frameRowOffset), //upper right
      uOffsetA + uOffsetB / 2, vOffset_INC * (frameRowOffset),  //upper left 

      uOrigin, vOffset_INC * (frameRowOffset + rowCnt), //lower left
      uOffsetA, vOffset_INC * (frameRowOffset + rowCnt), //lower right
      uOffsetA, vOffset_INC * (frameRowOffset), //upper right
      uOrigin, vOffset_INC * (frameRowOffset),  //upper left 
    ]

    bottomRightFrame.addComponent(planeC)
    bottomRightFrame.addComponent(videoMat)
    engine.addEntity(bottomRightFrame)
  }

  const archData:ArchesType={arches:arches}
  return archData
}