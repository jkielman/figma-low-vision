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
          // Spot 1
          const createShape1 = figma.createVector();
          frame.appendChild(createShape1)
          createShape1.x = 24
          createShape1.y = 24
          createShape1.resize(170, 116)
          createShape1.vectorNetwork = {
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
          createShape1.vectorPaths = [{ windingRule: "NONE", data: "M 23.518829345703125 62.609947204589844 C 9.85216236114502 68.9432806968689 -12.281169891357422 86.00994682312012 8.518829345703125 103.60994720458984 C 29.318828582763672 121.20994758605957 52.51880931854248 117.60994720458984 61.518798828125 113.60994720458984 C 67.518798828125 114.27661389112473 80.11879873275757 113.20994758605957 82.518798828125 103.60994720458984 C 85.518798828125 91.60994720458984 110.518798828125 69.60994720458984 133.518798828125 62.609947204589844 C 156.518798828125 55.609947204589844 197.518798828125 3.6099700927734375 146.518798828125 4.6099700927734375 C 105.71879959106445 5.4099701046943665 108.518798828125 32.60992431640625 71.518798828125 12.609947204589844 C 34.518798828125 -7.3900299072265625 42.71879959106445 -3.9900455474853516 15.518798828125 25.609952926635742 C -11.681201934814453 55.209951400756836 9.518818855285645 62.60994752248129 23.518829345703125 62.609947204589844 Z" }]
          createShape1.fills = [{
            type: "SOLID",
            visible: true,
            opacity: 1,
            blendMode: "NORMAL",
            color: { r: 0, g: 0, b: 0 }
          }]
          createShape1.effects = [{ type: 'LAYER_BLUR', radius: 50, visible: true }]

          // Spot 2
          const createShape2 = figma.createVector();
          frame.appendChild(createShape2)
          createShape2.x = canWidth - 134
          createShape2.y = 16
          createShape2.resize(134, 212)
          createShape2.vectorNetwork = {
            regions: [],
            vertices: [
              { x: 134, y: 19.859512329101562, strokeCap: "NONE", strokeJoin: "MITER", cornerRadius: 0 },
              { x: 61.74312973022461, y: 129.12649536132812, strokeCap: "NONE", strokeJoin: "MITER", cornerRadius: 0 },
              { x: 0, y: 67.4930191040039, strokeCap: "NONE", strokeJoin: "MITER", cornerRadius: 0 },
              { x: 61.74312973022461, y: 5.859576225280762, strokeCap: "NONE", strokeJoin: "MITER", cornerRadius: 0 },
              { x: 134, y: 191.85968017578125, strokeCap: "NONE", strokeJoin: "MITER", cornerRadius: 0 },
            ],
            segments: [
              { start: 1, end: 2, tangentStart: { x: -34.099788665771484, y: 0 }, tangentEnd: { x: 0, y: 34.03921127319336 } },
              { start: 2, end: 3, tangentStart: { x: 0, y: -34.03921127319336 }, tangentEnd: { x: -34.099788665771484, y: 0 } },
              { start: 3, end: 0, tangentStart: { x: 34.099788665771484, y: 0 }, tangentEnd: { x: 0, y: -34.03921127319336 } },
              { start: 0, end: 4, tangentStart: { x: 0, y: 19.432538986206055 }, tangentEnd: { x: 0, y: -38 } },
              { start: 4, end: 1, tangentStart: { x: 0, y: 67.86380004882812 }, tangentEnd: { x: 14.632665634155273, y: 0 } },
            ],
          }
          createShape2.vectorPaths = [{ windingRule: "NONE", data: 'M 134 19.859512329101562 C 134 39.29205131530762 134 153.85968017578125 134 191.85968017578125 C 134 259.7234802246094 76.37579536437988 129.12649536132812 61.74312973022461 129.12649536132812 C 27.643341064453125 129.12649536132812 0 101.53223037719727 0 67.4930191040039 C 0 33.45380783081055 27.643341064453125 5.859576225280762 61.74312973022461 5.859576225280762 C 95.8429183959961 5.859576225280762 134 -14.179698944091797 134 19.859512329101562 Z' }]
          createShape2.fills = [{
            type: "SOLID",
            visible: true,
            opacity: 1,
            blendMode: "NORMAL",
            color: { r: 0, g: 0, b: 0 }
          }]
          createShape2.effects = [{ type: 'LAYER_BLUR', radius: 50, visible: true }]

          const createShape3 = figma.createVector();
          frame.appendChild(createShape3)
          createShape3.x = canWidth / 2
          createShape3.y = canHeight / 2
          createShape3.resize(237, 212)
          createShape3.vectorNetwork = {
            regions: [],
            vertices: [
              { x: 27.970772800780363, y: 45.88615773396826, strokeCap: "NONE", strokeJoin: "MITER", cornerRadius: 0 },
              { x: 27.970772800780363, y: 139.22358905549726, strokeCap: "NONE", strokeJoin: "MITER", cornerRadius: 0 },
              { x: 136.52306674703388, y: 45.88615773396826, strokeCap: "NONE", strokeJoin: "MITER", cornerRadius: 0 },
              { x: 91.29291311649125, y: 0.7228874721137855, strokeCap: "NONE", strokeJoin: "MITER", cornerRadius: 0 },
            ],
            segments: [
              { start: 0, end: 1, tangentStart: { x: -21.107405027586562, y: 27.097962264790315 }, tangentEnd: { x: -50.65776976568317, y: -9.6348311710511 } },
              { start: 1, end: 2, tangentStart: { x: 63.32221508275969, y: 12.04353878435125 }, tangentEnd: { x: -6.030687150739018, y: 54.19592452958063 } },
              { start: 2, end: 3, tangentStart: { x: 4.824549792482608, y: -43.35673847510314 }, tangentEnd: { x: 17.08694644781793, y: -3.0108846960878126 } },
              { start: 3, end: 0, tangentStart: { x: 0, y: 0 }, tangentEnd: { x: 0, y: 0 } },
            ],
          }
          createShape3.vectorPaths = [{ windingRule: "NONE", data: 'M 27.970772800780363 45.88615773396826 C 6.863367773193801 72.98411999875857 -22.686996964902807 129.5887578844461 27.970772800780363 139.22358905549726 C 91.29298788354005 151.2671278398485 130.49237959629485 100.0820822635489 136.52306674703388 45.88615773396826 C 141.34761653951648 2.5294192588651185 108.37985956430919 -2.287997223974027 91.29291311649125 0.7228874721137855 L 27.970772800780363 45.88615773396826 Z' }]
          createShape3.fills = [{
            type: "SOLID",
            visible: true,
            opacity: 1,
            blendMode: "NORMAL",
            color: { r: 0, g: 0, b: 0 }
          }]
          createShape3.effects = [{ type: 'LAYER_BLUR', radius: 50, visible: true }]


          const createShape4 = figma.createVector();
          frame.appendChild(createShape4)
          createShape4.x = - 40
          createShape4.y = canHeight - 200
          createShape4.resize(226, 254)
          createShape4.vectorNetwork = {
            regions: [],
            vertices: [
              { x: 39.69117131340952, y: 95.7215995307603, strokeCap: "NONE", strokeJoin: "MITER", cornerRadius: 0 },
              { x: 190.0658583030122, y: 78.45801136563985, strokeCap: "NONE", strokeJoin: "MITER", cornerRadius: 0 },
              { x: 190.0658583030122, y: 246.1614076716958, strokeCap: "NONE", strokeJoin: "MITER", cornerRadius: 0 },
              { x: 22.435056261564426, y: 226.43159800179032, strokeCap: "NONE", strokeJoin: "MITER", cornerRadius: 0 },
              { x: 10.109261475217066, y: 159.84349036585942, strokeCap: "NONE", strokeJoin: "MITER", cornerRadius: 0 },
            ],
            segments: [
              { start: 0, end: 1, tangentStart: { x: 23.00814948419548, y: -68.23225687377197 }, tangentEnd: { x: -65.08019553153055, y: -149.9465516097002 } },
              { start: 1, end: 2, tangentStart: { x: 65.08019553153055, y: 149.9465516097002 }, tangentEnd: { x: 27.116748529964195, y: 6.576598715346681 } },
              { start: 2, end: 3, tangentStart: { x: -41.90770227358103, y: 9.042829628038051 }, tangentEnd: { x: 33.526162759248336, y: 37.48663790242505 } },
              { start: 3, end: 4, tangentStart: { x: -33.526162759248336, y: -37.48663790242505 }, tangentEnd: { x: -9.86063582907789, y: 6.576603419299868 } },
              { start: 4, end: 0, tangentStart: { x: 0, y: 0 }, tangentEnd: { x: 0, y: 0 } },
            ],
          }
          createShape4.vectorPaths = [{ windingRule: "NONE", data: 'M 39.69117131340952 95.7215995307603 C 62.699320797605 27.489342656988327 124.98566277148164 -71.48854024406036 190.0658583030122 78.45801136563985 C 255.14605383454273 228.40456297534007 217.18260683297638 252.73800638704247 190.0658583030122 246.1614076716958 C 148.15815602943115 255.20423729973385 55.96121902081276 263.91823590421535 22.435056261564426 226.43159800179032 C -11.09110649768391 188.94496009936526 0.24862564613917648 166.42009378515928 10.109261475217066 159.84349036585942 L 39.69117131340952 95.7215995307603 Z' }]
          createShape4.fills = [{
            type: "SOLID",
            visible: true,
            opacity: 1,
            blendMode: "NORMAL",
            color: { r: 0, g: 0, b: 0 }
          }]
          createShape4.effects = [{ type: 'LAYER_BLUR', radius: 50, visible: true }]




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