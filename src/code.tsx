figma.showUI(__html__, {
  width: 250,
  height: 276,
});

const currentNodes = figma.currentPage.selection;

if (currentNodes.length < 1) {

  figma.notify('Please select an element');
  figma.closePlugin();

} else if (currentNodes.length > 1) {

  figma.notify('You can only select one element');
  figma.closePlugin();

} else {

  const selectedNode = figma.root.findOne(
    (node) => node.id === currentNodes[0].id
  );


  if (!!(selectedNode as any).findAll) {
    const selectedComponentTextNodes = (selectedNode as GroupNode).findAll(
      (node) => node.type === 'TEXT'
    ) as TextNode[];

    if (selectedComponentTextNodes.length > 0) {
      const componentsData = selectedComponentTextNodes.map((node) => ({
        id: node.id,
        name: node.name,
        value: node.characters,
      }));

      figma.ui.postMessage(componentsData);
    }
  }

  function createIdMap(
    node: GroupNode,
    cloneNode: GroupNode
  ) {
    const idMap = {}
    return idMap
  }

  figma.ui.onmessage = async (message) => {

    if (message.type === 'Cancel') {
      figma.closePlugin();
      return;
    }

    const acuityProp = message.type.acuity;
    const visionProp = message.type.vision;
    const elName = `A: ${message.type.acuity} / FOV: ${message.type.vision}`;

    const values = message.values as { [key in string]: string }[];

    let blurStrength: number;
    let visionArray = [];

    values.forEach(async (texts, _index) => {

      // Set acuity
      switch (acuityProp) {
        case 'Normal':
          blurStrength = 0
          break;
        case 'Mild':
          blurStrength = 16.7
          break;
        case 'Medium':
          blurStrength = 33.4
          break;
        case 'Severe':
          blurStrength = 50
      }

      const clone = selectedNode.clone() as GroupNode;


      //Added blur
      clone.effects = [{ type: 'LAYER_BLUR', radius: blurStrength, visible: true }]

      //Position
      clone.x = 0
      clone.y = 0

      //Get width and height
      const canWidth = clone.width;
      const canHeight = clone.height;

      const frame = figma.createFrame()
      frame.resize(canWidth, canHeight)
      frame.x = frame.x + canWidth + 100
      frame.y = 0
      frame.name = elName
      frame.clipsContent = true
      frame.appendChild(clone)


      const imageBackground = figma.createRectangle()
      frame.appendChild(imageBackground)
      imageBackground.x = 0
      imageBackground.y = 0
      imageBackground.resize(canWidth, canHeight)

      // Set acuity

      switch (visionProp) {
        case 'Standard':
          null
          break;
        case 'Central loss':
          visionArray.push({
            type: "GRADIENT_RADIAL",
            visible: true,
            opacity: 1,
            blendMode: "NORMAL",
            gradientStops: [
              { color: { r: 0, g: 0, b: 0, a: 0.9599999785423279 }, position: 0 },
              { color: { r: 0.7686274647712708, g: 0.7686274647712708, b: 0.7686274647712708, a: 0.3499999940395355 }, position: 0.546875 },
              { color: { r: 0.7686274647712708, g: 0.7686274647712708, b: 0.7686274647712708, a: 0 }, position: 1 },
            ],
            gradientTransform: [
              [6.937503460591188e-9, 0.5502035617828369, 0.2252374142408371],
              [-0.3671642541885376, 1.1389261977967635e-8, 0.6835821270942688]
            ]
          })
          break;
        case 'Hemianopia':
          visionArray.push({
            type: "GRADIENT_LINEAR",
            visible: true,
            opacity: 1,
            blendMode: "NORMAL",
            gradientStops: [
              { color: { r: 0, g: 0, b: 0, a: 1 }, position: 0.1041666641831398 },
              { color: { r: 0, g: 0, b: 0, a: 0 }, position: 0.8072916865348816 }
            ],
            gradientTransform: [
              [-1.024999976158142, 5.902742472585487e-8, 0.8604166507720947],
              [-1.573754637718139e-8, -1.8585418462753296, 1.4304168224334717]
            ]
          })
          break
        case 'Peripheral loss':
          visionArray.push({
            type: "GRADIENT_RADIAL",
            visible: true,
            opacity: 1,
            blendMode: "NORMAL",
            gradientStops: [
              { color: { r: 0, g: 0, b: 0, a: 0 }, position: 0 },
              { color: { r: 0, g: 0, b: 0, a: 1 }, position: 0.5865827798843384 }
            ],
            gradientTransform: [
              [1.3214370930825226e-8, 0.8378099203109741, 0.08161155134439468],
              [-0.5590909719467163, 2.2865739524036144e-8, 0.7795454859733582]
            ]
          })
          break;
        case 'Retinal detachment':
          visionArray.push({
            type: "GRADIENT_LINEAR",
            visible: true,
            opacity: 1,
            blendMode: "NORMAL",
            gradientStops: [
              { color: { r: 0, g: 0, b: 0, a: 1 }, position: 0 },
              { color: { r: 0, g: 0, b: 0, a: 0 }, position: 0.7708333134651184 }
            ],
            gradientTransform: [
              [0.6813358068466187, 1.0038857460021973, -0.6852215528488159],
              [-1.016112208366394, 1.2574687004089355, 0.2586434781551361]
            ]
          })
          break;
        case 'Ocular albinism':
          visionArray.push({
            type: "SOLID",
            visible: true,
            opacity: 1,
            blendMode: "NORMAL",
            color: { r: 1, g: 1, b: 1 }
          })
          imageBackground.opacity = 0.95
          imageBackground.blendMode = "SOFT_LIGHT"
          break
        case 'Blind spots':
          // One spot
          const createShape = figma.createVector();
          frame.appendChild(createShape)
          createShape.x = 24
          createShape.y = 24
          createShape.resize(170, 116)
          createShape.vectorNetwork = {
            regions: [],
            vertices: [
              { x: 23.518829345703125, y: 62.609947204589844, strokeCap: "NONE", strokeJoin: "MITER", cornerRadius: 0 },
              { x: 8.518829345703125, y: 103.60994720458984, strokeCap: "NONE", strokeJoin: "MITER", cornerRadius: 0 },
              { x: 61.518798828125, y: 113.60994720458984, strokeCap: "NONE", strokeJoin: "MITER", cornerRadius: 0 },
              { x: 82.518798828125, y: 103.60994720458984, strokeCap: "NONE", strokeJoin: "MITER", cornerRadius: 0 },
              { x: 133.518798828125, y: 62.609947204589844, strokeCap: "NONE", strokeJoin: "MITER", cornerRadius: 0 },
              { x: 146.518798828125, y: 4.6099700927734375, strokeCap: "NONE", strokeJoin: "MITER", cornerRadius: 0 },
              { x: 71.518798828125, y: 12.609947204589844, strokeCap: "NONE", strokeJoin: "MITER", cornerRadius: 0 },
              { x: 15.518798828125, y: 25.609952926635742, strokeCap: "NONE", strokeJoin: "MITER", cornerRadius: 0 },
            ],
            segments: [
              { start: 0, end: 1, tangentStart: { x: -13.666666984558105, y: 6.333333492279053 }, tangentEnd: { x: -20.799999237060547, y: -17.600000381469727 } },
              { start: 1, end: 2, tangentStart: { x: 20.799999237060547, y: 17.600000381469727 }, tangentEnd: { x: -8.99998950958252, y: 4 } },
              { start: 2, end: 3, tangentStart: { x: 6, y: 0.6666666865348816 }, tangentEnd: { x: -2.4000000953674316, y: 9.600000381469727 } },
              { start: 3, end: 4, tangentStart: { x: 3, y: -12 }, tangentEnd: { x: -23, y: 7 } },
              { start: 4, end: 5, tangentStart: { x: 23, y: -7 }, tangentEnd: { x: 51, y: -1 } },
              { start: 5, end: 6, tangentStart: { x: -40.79999923706055, y: 0.800000011920929 }, tangentEnd: { x: 37, y: 19.999977111816406 } },
              { start: 6, end: 7, tangentStart: { x: -37, y: -19.999977111816406 }, tangentEnd: { x: 27.200000762939453, y: -29.599998474121094 } },
              { start: 7, end: 0, tangentStart: { x: -27.200000762939453, y: 29.599998474121094 }, tangentEnd: { x: -14.00001049041748, y: 3.178914482759865e-7 } }
            ],
          }
          createShape.vectorPaths = [{ windingRule: "NONE", data: "M 23.518829345703125 62.609947204589844 C 9.85216236114502 68.9432806968689 -12.281169891357422 86.00994682312012 8.518829345703125 103.60994720458984 C 29.318828582763672 121.20994758605957 52.51880931854248 117.60994720458984 61.518798828125 113.60994720458984 C 67.518798828125 114.27661389112473 80.11879873275757 113.20994758605957 82.518798828125 103.60994720458984 C 85.518798828125 91.60994720458984 110.518798828125 69.60994720458984 133.518798828125 62.609947204589844 C 156.518798828125 55.609947204589844 197.518798828125 3.6099700927734375 146.518798828125 4.6099700927734375 C 105.71879959106445 5.4099701046943665 108.518798828125 32.60992431640625 71.518798828125 12.609947204589844 C 34.518798828125 -7.3900299072265625 42.71879959106445 -3.9900455474853516 15.518798828125 25.609952926635742 C -11.681201934814453 55.209951400756836 9.518818855285645 62.60994752248129 23.518829345703125 62.609947204589844 Z" }]
          createShape.fills = [{
            type: "SOLID",
            visible: true,
            opacity: 1,
            blendMode: "NORMAL",
            color: { r: 0, g: 0, b: 0 }
          }]
          createShape.effects = [{ type: 'LAYER_BLUR', radius: 50, visible: true }]
      }

      imageBackground.fills = visionArray;

      console.log('visionArray: ', visionArray)

      const map = createIdMap(
        selectedNode as GroupNode,
        clone,
      );

      Object.keys(texts).forEach(async (key) => {
        const textNode = clone.findOne((node) => {
          return node.id === map[key];

        }) as TextNode;
        textNode
        if (textNode) {
          await figma.loadFontAsync(textNode.fontName as FontName);
          textNode.characters = texts[key];
        }
      });

    });

    figma.closePlugin();

  };

}