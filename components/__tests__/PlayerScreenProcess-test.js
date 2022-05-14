import * as React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TabOneScreen } from '../../screens/TabOneScreen';
import Services from "../../services/service";
import renderer from 'react-test-renderer';
import 'isomorphic-fetch';
import { NavigationContainer } from '@react-navigation/native';
import { WebSocket } from 'mock-socket';

global.WebSocket = WebSocket;

describe('Testing search song by name', () => {
    /*
    Snapshot Testing
    */
    test("Player UI render correctly", async () => {
        const tree = renderer.create(<TabOneScreen />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    /*
    Intergration Testing
    */
    test("Play a song", async () => {
        const component = (
            <NavigationContainer>
                <TabOneScreen />
            </NavigationContainer>
        );
        const { queryByTestId } = render(component);
        const playSong = await queryByTestId("playBtn");
        fireEvent(playSong, 'press');
    });

    test("Play previous song", async () => {
        const component = (
            <NavigationContainer>
                <TabOneScreen />
            </NavigationContainer>
        );
        const { queryByTestId } = render(component);
        const getPreviousSong = await queryByTestId("previousBtn");
        fireEvent(getPreviousSong, 'press');
        const afterSongName = await queryByTestId('afterSongName');
        expect(afterSongName).toBeTruthy();
    });

    test("Play next song", async () => {
        const component = (
            <NavigationContainer>
                <TabOneScreen />
            </NavigationContainer>
        );
        const { queryByTestId } = render(component);
        const geNextSong = await queryByTestId("nextBtn");
        fireEvent(geNextSong, 'press');
        const afterSongName = await queryByTestId('afterSongName');
        expect(afterSongName).toBeTruthy();
    });

});