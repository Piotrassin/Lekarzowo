import Registration from '../Registration.js';
import {shallow, mount, debug} from 'enzyme';
import {act, render, fireEvent, wait, cleanup} from '@testing-library/react';
import React from 'react';
import MockBackend from '../__mocks__/MockBackend.js.js';



it('renders', () => {
  shallow(<Registration  />);
});

describe('site functionality with fetch status 200', () => {

  afterEach(() => {
    jest.clearAllMocks();
    cleanup;
  });

  it('should display message when input errors occur', async () => {
    const {debug, getByRole, getByLabelText} = render(<Registration />);
    var registerBtn = getByRole('button');
    fireEvent.click(registerBtn);
    await wait(() => alert = getByRole('alert'));
    expect(alert.classList).toContain('show');
  });

  it('should be able to fill inputs', () => {
    const {debug, getByRole, getByLabelText} = render(<Registration />);
    var input = getByLabelText('Imię');
    fireEvent.change(input, {target : {value: "Anna"}});
    expect(input.value).toEqual('Anna');
    input = getByLabelText('Nazwisko');
    fireEvent.change(input, {target : {value: "Annowska"}});
    expect(input.value).toEqual('Annowska');
    input = getByLabelText('Data Urodzenia');
    fireEvent.change(input, {target : {value: "2020-10-20"}});
    expect(input.value).toEqual('2020-10-20');
    input = getByLabelText('Płeć');
    fireEvent.change(input, {target : {value: "M"}});
    expect(input.value).toEqual('M');
    input = getByLabelText('Pesel');
    fireEvent.change(input, {target : {value: "20102075674"}});
    expect(input.value).toEqual('20102075674');
    input = getByLabelText('Email');
    fireEvent.change(input, {target : {value: "a@a.a"}});
    expect(input.value).toEqual('a@a.a');
    input = getByLabelText('Hasło');
    fireEvent.change(input, {target : {value: "aaaAAA111"}});
    expect(input.value).toEqual('aaaAAA111');
    input = getByLabelText('Powtórz Hasło');
    fireEvent.change(input, {target : {value: "aaaAAA111"}});
    expect(input.value).toEqual('aaaAAA111');
  });

  it('should display message redirect when succesfully register', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const historyMock = { push: jest.fn((path) => {
      return path
    }) };
    const {debug, getByRole, getByText, getByLabelText} = render(<Registration history = {historyMock}/>);
    var input = getByLabelText('Imię');
    fireEvent.change(input, {target : {value: "Anna"}});
    input = getByLabelText('Nazwisko');
    fireEvent.change(input, {target : {value: "Annowska"}});
    input = getByLabelText('Data Urodzenia');
    fireEvent.change(input, {target : {value: "2020-10-20"}});
    input = getByLabelText('Płeć');
    fireEvent.change(input, {target : {value: "M"}});
    input = getByLabelText('Pesel');
    fireEvent.change(input, {target : {value: "20102075674"}});
    input = getByLabelText('Email');
    fireEvent.change(input, {target : {value: "a@a.a"}});
    input = getByLabelText('Hasło');
    fireEvent.change(input, {target : {value: "aaaAAA111"}});
    input = getByLabelText('Powtórz Hasło');
    fireEvent.change(input, {target : {value: "aaaAAA111"}});
    var registerBtn = getByRole('button');
    fireEvent.click(registerBtn);
    await wait(expect(spyGlobalFetch).toHaveBeenCalledTimes(1));
    expect(historyMock.push).toHaveBeenCalledTimes(1);
    expect(historyMock.push.mock.calls[0][0]).toEqual('/login');

  });

});

describe('site functionality with fetch status 500', () => {

  afterEach(() => {
    jest.clearAllMocks();
    cleanup;
  });

  it('should display error message when unable to register', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetchWithError(url, options));
    });
    const {debug, getByRole, getByText,getByLabelText} = render(<Registration />);
    var input = getByLabelText('Imię');
    fireEvent.change(input, {target : {value: "Anna"}});
    input = getByLabelText('Nazwisko');
    fireEvent.change(input, {target : {value: "Annowska"}});
    input = getByLabelText('Data Urodzenia');
    fireEvent.change(input, {target : {value: "2020-10-20"}});
    input = getByLabelText('Płeć');
    fireEvent.change(input, {target : {value: "M"}});
    input = getByLabelText('Pesel');
    fireEvent.change(input, {target : {value: "20102075674"}});
    input = getByLabelText('Email');
    fireEvent.change(input, {target : {value: "a@a.a"}});
    input = getByLabelText('Hasło');
    fireEvent.change(input, {target : {value: "aaaAAA111"}});
    input = getByLabelText('Powtórz Hasło');
    fireEvent.change(input, {target : {value: "aaaAAA111"}});
    var registerBtn = getByRole('button');
    fireEvent.click(registerBtn);
    expect(spyGlobalFetch).toHaveBeenCalled();
    await wait(() => alert = getByRole('alert'));
    expect(alert.classList).toContain('show');
    expect(alert.classList).toContain('red-snackbar');
  });

});
