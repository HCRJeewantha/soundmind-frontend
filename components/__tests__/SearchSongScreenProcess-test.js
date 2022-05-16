import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { render, fireEvent } from '@testing-library/react-native';
import { TabTwoScreen } from '../../screens/TabTwoScreen';
import renderer from 'react-test-renderer';

describe('Testing search song by name', () => {

    /*
    Snapshot Testing
    */
    test("Search song UI render correctly", async () => {
        const tree = renderer.create(<TabTwoScreen />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    /*
    Intergration Testing
   */
    test('Enter a name into text field and click search button', async () => {
        const component = (
            <NavigationContainer>
                <TabTwoScreen />
            </NavigationContainer>
        );

        const { findByTestId, getByPlaceholderText } = render(component);
        fireEvent.changeText(getByPlaceholderText('Search Songs'), 'Faded');
        const toClick = await findByTestId("searchBtn");
        fireEvent(toClick, 'press');

    });

    test('Clicking on one song takes you to the details screen', async () => {
        const component = (
                <TabTwoScreen />
        );
        const { queryByTestId } = render(component);
        const toClick = await queryByTestId("selectSongBtn");
        // fireEvent(toClick, 'press');

        // const newBody = await findByText('the number you have chosen is 5');
        // expect(newBody).toBeTruthy();
    });
});