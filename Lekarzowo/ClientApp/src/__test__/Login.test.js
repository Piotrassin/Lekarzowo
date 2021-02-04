import Login from '../Login.js';
import {shallow, mount, debug} from 'enzyme';
import {act, render, fireEvent, wait, cleanup} from '@testing-library/react';
import React from 'react';
import MockBackend from '../__mocks__/MockBackend.js.js';



it('renders', () => {
  shallow(<Login  />);
});

describe('site functionality with fetch status 200', () => {

  afterEach(() => {
    jest.clearAllMocks();
    cleanup;
  });

  it('should display message when input errors occur', async () => {
    const {debug, getByRole, getByLabelText} = render(<Login />);
    var loginBtn = getByRole('button');
    fireEvent.click(loginBtn);
    await wait(() => alert = getByRole('alert'));
    expect(alert.classList).toContain('show');
    expect(alert.classList).toContain('red-snackbar');
  });

  it('should be able to fill inputs', () => {
    const {debug, getByRole, getByLabelText} = render(<Login />);
    var input = getByLabelText('Login');
    fireEvent.change(input, {target : {value: "a@a.a"}});
    expect(input.value).toEqual('a@a.a');
    input = getByLabelText('Hasło');
    fireEvent.change(input, {target : {value: "aaaAAA111"}});
    expect(input.value).toEqual('aaaAAA111');
  });

  it('should display message redirect when succesfully login', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const historyMock = { push: jest.fn((path) => {
      return path
    }) };
    const {debug, getByRole, getByText, getByLabelText} = render(<Login history = {historyMock}/>);
    var input = getByLabelText('Login');
    fireEvent.change(input, {target : {value: "a@a.a"}});
    expect(input.value).toEqual('a@a.a');
    input = getByLabelText('Hasło');
    fireEvent.change(input, {target : {value: "aaaAAA111"}});
    expect(input.value).toEqual('aaaAAA111');
    var loginBtn = getByRole('button');
    fireEvent.click(loginBtn);
    await wait(expect(spyGlobalFetch).toHaveBeenCalledTimes(1));
    expect(historyMock.push).toHaveBeenCalledTimes(1);
    expect(historyMock.push.mock.calls[0][0]).toEqual('/');
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
    const {debug, getByRole, getByText,getByLabelText} = render(<Login />);
    var input = getByLabelText('Login');
    fireEvent.change(input, {target : {value: "a@a.a"}});
    expect(input.value).toEqual('a@a.a');
    input = getByLabelText('Hasło');
    fireEvent.change(input, {target : {value: "aaaAAA111"}});
    expect(input.value).toEqual('aaaAAA111');
    var loginBtn = getByRole('button');
    fireEvent.click(loginBtn);
    expect(spyGlobalFetch).toHaveBeenCalled();
    await wait(() => alert = getByRole('alert'));
    expect(alert.classList).toContain('show');
    expect(alert.classList).toContain('red-snackbar');
  });

});
