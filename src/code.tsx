figma.showUI(__html__, {
  width: 250,
  height: 260,
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

    //Mild
    //Corner

    if (message.type === 'Cancel') {
      figma.closePlugin();
      return;
    }

    console.log(' message', message.type.acuity, message.type.vision)

    const acuityProp = message.type.acuity;
    const visionProp = message.type.vision;

    // if (!(acuityProp && visionProp)) {

    // }

    const elName = `${message.type.acuity} / ${message.type.vision}`;



    // console.log({ elName })

    // if (elName === 'Mild / Corner') {


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
          blurStrength = 25
          break;
        case 'Medium':
          blurStrength = 25
          break;
        case 'Severe':
          blurStrength = 75
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
      frame.x = 0
      frame.y = 0
      frame.name = elName
      frame.clipsContent = false

      //Create mask
      const maskRect = figma.createRectangle()
      frame.appendChild(maskRect)
      maskRect.resize(canWidth, canHeight)
      maskRect.x = 0
      maskRect.y = 0
      maskRect.isMask = true

      //Creat frame dropshadow
      const background1 = figma.createRectangle()
      frame.appendChild(background1)
      background1.x = 0
      background1.y = 0
      background1.resize(canWidth, canHeight)
      background1.fills = [{ color: { r: 1, g: 1, b: 1 }, type: 'SOLID' }]
      background1.effects = [{ type: 'DROP_SHADOW', visible: true, blendMode: "NORMAL", radius: 12, offset: { x: 0, y: 2 }, color: { r: 0, g: 0, b: 0, a: 0.16 } }]

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
        case 'Central':
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
          console.log('Central', true)
          break;
        case 'Peripheral':
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
          console.log('Peripheral', true)
          break;
        case 'Corner':
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
          console.log('Corner', true)
          break;
        case 'Spots':
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
          console.log('Spots', true)
          break
        case 'Side':
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
          console.log('Side', true)
      }

      //Set up visionProp
      imageBackground.fills = visionArray;

      console.log('visionArray: ', visionArray)


      console.log({ clone });


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
          console.log(textNode, ' textNode 2')
        }
      });

    });

    figma.closePlugin();

  };

}