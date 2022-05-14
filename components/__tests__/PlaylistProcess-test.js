import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { render, fireEvent } from '@testing-library/react-native';
import { TabThreeScreen } from '../../screens/TabThreeScreen';
import renderer from 'react-test-renderer';
class LocalStorageMock {
    constructor() {
        this.store = {};
    }

    getItem(key) {
        return this.store[key] || null;
    }

    setItem(key, value) {
        this.store[key] = String(value);
    }
}

global.localStorage = new LocalStorageMock;

describe('Testing search song by name', () => {

    /*
    Snapshot Testing
    */
    test("Playlist UI render correctly", async () => {
        const tree = renderer.create(<TabThreeScreen />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    /*
    Intergration Testing
   */
    // test('Load all the playlist', async () => {


    //     const component = (
    //         <NavigationContainer>
    //             <TabThreeScreen />
    //         </NavigationContainer>
    //     );

    //     const { findByTestId, queryAllByText, queryAllByTestId } = render(component);
    //     const items = await queryAllByTestId('3');
    // });

    // test('Clicking on one song takes you to the details screen', async () => {
    //     const closeRightSectionSpy = jest.fn();

    //     const component = (
    //         <NavigationContainer>
    //             <TabThreeScreen  setSelectedValues={closeRightSectionSpy}/>
    //         </NavigationContainer>
    //     );

    //     const { queryByTestId } = render(component);
    //     fireEvent.click(queryByTestId(10));
    //     expect(closeRightSectionSpy).toHaveBeenCalled()
    // });
});