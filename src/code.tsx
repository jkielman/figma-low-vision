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


    console.log(message, ' message')

    if (message.type === 'Mild/Corner') {


      const values = message.values as { [key in string]: string }[];

      values.forEach(async (texts, index) => {
        const clone = selectedNode.clone() as GroupNode;

        ///clone with blur
        clone.effects = [{ type: 'LAYER_BLUR', radius: 6, visible: true }]

        clone.x = 0
        clone.y = 0

        const canWidth = clone.width;
        const canHeight = clone.height;

        const frame = figma.createFrame()
        frame.resize(canWidth, canHeight)
        frame.x = 0
        frame.y = 0
        frame.name = message.type
        frame.clipsContent = false
        const maskRect = figma.createRectangle()
        frame.appendChild(maskRect)
        maskRect.resize(canWidth, canHeight)
        maskRect.x = 0
        maskRect.y = 0
        maskRect.isMask = true
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
        imageBackground.fills = [
          {
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
          }
        ]


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
    }

    if (message.type === 'Cancel') {

      figma.closePlugin();

    }

  };

}