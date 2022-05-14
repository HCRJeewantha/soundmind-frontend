import * as React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { RegistrationScreen } from '../../screens/RegistrationScreen';
import renderer from 'react-test-renderer';
import 'isomorphic-fetch';

describe('Testing search song by name', () => {

     /*
    Snapshot Testing
    */
    test("Signin UI render correctly", async () => {
        const tree = renderer.create(<RegistrationScreen/>).toJSON();
        expect(tree).toMatchSnapshot();
    });


    /*
    Intergration Testing
    */
    test("Signup UI render correctly", async () => {
        const { getByText, getByPlaceholderText } = render(
            <RegistrationScreen />
        );
        fireEvent.changeText(getByPlaceholderText('077xxxxxxx'), '0771234567');
        fireEvent.changeText(getByPlaceholderText('Password'), 'Ravindu@123');
        fireEvent.changeText(getByPlaceholderText('Confirem Password'), 'Ravindu@123');
        fireEvent.press(getByText("Sign up"));
        // const response  =  Services.signIn('0774133985','saf');
    });

});