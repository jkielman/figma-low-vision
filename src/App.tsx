import * as React from 'react';
import { useState } from 'react';
import { Checkbox, Button, Label, Select } from "react-figma-plugin-ds";
import "react-figma-plugin-ds/figma-plugin-ds.css";
import './App.scss';


type ComponentItemType = {
  id: string;
  name: string;
  value: string;
};


type TextValue = { [key in string]: string };

function constructFromOriginal(
  originalVals: ComponentItemType[]
): TextValue {
  return originalVals.reduce(
    (prev, current) => ({ ...prev, [current.id]: current.value }),
    {}
  );
}

function initialize(
  current: TextValue[],
  newLength: number,
  originalVals: ComponentItemType[]
) {
  const copy = [...current];

  console.log('current:', current, 'newLength:', newLength, 'originalValues:', originalVals)

  if (current.length < newLength) {

    const defaultVal = constructFromOriginal(originalVals);

    let i = current.length;

    while (i < newLength) {
      copy.push(defaultVal);
      i++;
    }

    return copy;
  }

  return copy.slice(0, newLength);

}

// Default properties
const messageSet =
{
  acuity: 'Normal',
  vision: 'Standard'
}

export const App = () => {

  const [textNodes, setComponents] = React.useState<ComponentItemType[]>([]);
  const [texts, setTexts] = React.useState<TextValue[]>([]);
  const [selected, setSelected] = useState(messageSet);
  const elementLength = 1;

  React.useEffect(() => {
    onmessage = (event) => {
      const nodes = event.data.pluginMessage as ComponentItemType[];
      setComponents(nodes);
      setTexts(initialize(texts, elementLength, nodes));
    };
  }, []);

  React.useEffect(() => {
    setTexts(initialize(texts, elementLength, textNodes));
  }, [elementLength]);

  //Send message to code.apsx - Clone and send Acuity and Vision properties
  const create = () => {
    console.log(messageSet, ' messageSet')
    // const loVisProps = `${messageSet.acuity}/${messageSet.vision}`
    //'Mild/Corner'
    parent.postMessage(
      { pluginMessage: { type: messageSet, values: texts } },
      '*'
    )
  };


  //Close/Cancel dialog
  const closeDialog = () => {
    parent.postMessage(
      { pluginMessage: { type: 'Cancel' } },
      '*'
    );

  };

  return (
    <div className="container">
      <Label className="title" size="small" weight="medium">Acuity</Label>
      <div className="row">
        <Checkbox
          className=""
          name="acuity"
          label="Normal"
          value="Normal"
          onChange={el => {
            selected.acuity = 'Normal';
          }}
          type="radio"
        />
        <Checkbox
          className=""
          name="acuity"
          label="Mild"
          value="Mild"
          //+2.00D
          onChange={el => {
            selected.acuity = 'Mild';
          }}
          type="radio"
        />
      </div>
      <div className="row">
        <Checkbox
          className=""
          name="acuity"
          label="Medium"
          value="Medium"
          onChange={el => {
            selected.acuity = 'Medium';
          }}
          type="radio"
        />
        <Checkbox
          className=""
          name="acuity"
          label="Severe"
          value="Severe"
          onChange={el => {
            selected.acuity = 'Severe';
          }}
          type="radio"
        />
      </div>

      <Label className="title" size="small" weight="medium">Field of vision</Label>

      <div className='row'>
        <div className='input-container'>
          <Select
            className="select-box"
            defaultValue=""
            onChange={el => {
              selected.vision = el.label;
            }}
            onExpand={function E() { }}
            options={[
              {
                label: 'Standard',
                value: 1
              },
              {
                label: 'Central',
                value: 2
              },
              {
                label: 'Peripheral',
                value: 3
              },
              {
                label: 'Corner',
                value: 4
              },
              {
                label: 'Spots',
                value: 5
              },
              {
                label: 'Side',
                value: 6
              }
            ]}
            placeholder="Standard"
          />
        </div>
      </div>

      <div className="btn-container">
        <div className="btn-container__utilities">
          <Button className="cancel" onClick={closeDialog} isSecondary>Cancel</Button>
          <Button className="apply" onClick={create}>Apply</Button>
        </div>
      </div>
    </div>
  );
};
