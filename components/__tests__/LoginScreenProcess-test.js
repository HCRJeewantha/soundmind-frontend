import * as React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { LoginScreen } from '../../screens/LoginScreen';
import Services from "../../services/service";
import renderer from 'react-test-renderer';
import 'isomorphic-fetch';
import { NavigationContainer } from '@react-navigation/native';

describe('Testing search song by name', () => {
    /*
    Snapshot Testing
    */
    test("Signin UI render correctly", async () => {
        const tree = renderer.create(<LoginScreen />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    /*
    Intergration Testing
    */
    test("Signin User", async () => {
        const component = (
            <NavigationContainer>
                <LoginScreen />
            </NavigationContainer>
        );
        const { findByTestId, getByPlaceholderText } = render(component);
        fireEvent.changeText(getByPlaceholderText('07xxxxxx'), '0771234567');
        fireEvent.changeText(getByPlaceholderText('password'), 'Ravindu@123');
        const toClick = await findByTestId("signInBtn");
        fireEvent(toClick, 'press');
        // const response = Services.signIn('0774133985', 'saf');
    });

});