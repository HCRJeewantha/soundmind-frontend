import * as React from 'react';
import renderer from 'react-test-renderer';

import { WelcomeScreen } from '../../screens/WelcomeScreen';

it(`renders correctly`, () => {
  const tree = renderer.create(<WelcomeScreen/>).toJSON();
  expect(tree).toMatchSnapshot();
});
