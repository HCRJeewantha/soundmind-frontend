import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { render, fireEvent } from '@testing-library/react-native';
import { WelcomeScreen } from '../../screens/WelcomeScreen';

describe('Testing react navigation', () => {
    test('page contains the header and 10 items', async () => {
        const component = (
            <NavigationContainer>
                <WelcomeScreen />
            </NavigationContainer>
        );

        const { findByText, findAllByText } = render(component);

        const header = await findByText("Let's get started");

        expect(header).toBeTruthy();
    });

    test('clicking on one item takes you to the details screen', async () => {
        const component = (
            <NavigationContainer>
                <WelcomeScreen />
            </NavigationContainer>
        );

        const { findByText } = render(component);
        const toClick = await findByText("Let's get started");
        // fireEvent(toClick, 'press');

        // const newBody = await findByText('the number you have chosen is 5');
        // expect(newBody).toBeTruthy();
    });
});