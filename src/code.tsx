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
        case 'Central':
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
        case 'Albinism':
          visionArray.push({
            type: "SOLID",
            visible: true,
            opacity: 1,
            blendMode: "NORMAL",
            color: { r: 1, g: 1, b: 1 }//white
          })
          imageBackground.opacity = 0.95
          imageBackground.blendMode = "SOFT_LIGHT"
          console.log('Albinism', true)
          break
        case 'Blind spots':
          visionArray.push({
            type: "IMAGE",
            scaleMode: "FILL",
            visible: true,
            opacity: 1,
            scalingFactor: 1,
            imageHash: "abcb2bf8a97ac3894ebd46bd72abede756dcf545",
            imageTransform: [
              [1, 0, 0],
              [0, 0.5054665803909302, 0.2472667098045349]
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
              { color: { r: 0, g: 0, b: 0, a: 1 }, position: 0.1041666641831398 },
              { color: { r: 0, g: 0, b: 0, a: 0 }, position: 0.8072916865348816 }
            ],
            gradientTransform: [
              [-1.024999976158142, 5.902742472585487e-8, 0.8604166507720947],
              [-1.573754637718139e-8, -1.8585418462753296, 1.4304168224334717]
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