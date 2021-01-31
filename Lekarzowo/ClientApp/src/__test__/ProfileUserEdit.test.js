import ProfileUserEdit from '../ProfileUserEdit.js';
import {shallow, mount, debug} from 'enzyme';
import {act, render, fireEvent, wait, cleanup} from '@testing-library/react';
import React from 'react';
import MockBackend from '../__mocks__/MockBackend.js.js';



it('renders', () => {
  shallow(<ProfileUserEdit  />);
});

describe('site functionality with fetch status 200', () => {

  afterEach(() => {
    jest.clearAllMocks();
    cleanup;
  });

  it('should display message when input errors occur', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const {debug, getByRole, getByText} = render(<ProfileUserEdit />);
    debug();
    var userEditBtn = getByText('Edytuj');
    fireEvent.click(userEditBtn);
    await wait(() => alert = getByRole('alert'));
    expect(alert.classList).toContain('show');
  });

  it('should be able to change inputs for use details', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const {debug, getByRole, getByLabelText} = render(<ProfileUserEdit />);
    await wait(expect(spyGlobalFetch).toHaveBeenCalled());
    var input = getByLabelText('Imię');
    fireEvent.change(input, {target : {value: "Aneta"}});
    expect(input.value).toEqual('Aneta');

  });

  it('should display message redirect when succesfully changed user details', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    var spyGetItem = jest.spyOn(Storage.prototype, 'getItem')
    .mockImplementation((key) => {return JSON.stringify(
      {"id":141,
      "firstName":"Andrzej",
      "lastName":"Andrzejewski",
      "email":"a@a.a",
      "roles":["patient","doctor","admin"],
      "token":"zsdscdsw"
      ,"currentRole":"patient"
    })
    });
    const {debug, getByRole, getByLabelText, getByText} = render(<ProfileUserEdit />);
    await wait(expect(spyGlobalFetch).toHaveBeenCalled());
    var input = getByLabelText('Imię');
    fireEvent.change(input, {target : {value: "Aneta"}});
    expect(input.value).toEqual('Aneta');
    var userEditBtn = getByText('Edytuj');
    fireEvent.click(userEditBtn);
    await wait(() => alert = getByRole('alert'));
    expect(alert.classList).toContain('show');
    expect(alert.classList).toContain('green-snackbar');
  });

  it('should be able to change inputs for password', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const {debug, getByRole, getByLabelText} = render(<ProfileUserEdit />);
    await wait(expect(spyGlobalFetch).toHaveBeenCalled());
    var input = getByLabelText('Nowe Hasło');
    fireEvent.change(input, {target : {value: "AaaAaaa1111"}});
    expect(input.value).toEqual('AaaAaaa1111');
  });

  it('should display message when succesfully changed password', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    var spyGetItem = jest.spyOn(Storage.prototype, 'getItem')
    .mockImplementation((key) => {return JSON.stringify(
      {"id":141,
      "firstName":"Andrzej",
      "lastName":"Andrzejewski",
      "email":"a@a.a",
      "roles":["patient","doctor","admin"],
      "token":"zsdscdsw"
      ,"currentRole":"patient"
    })
    });
    const {debug, getByRole, getByLabelText, getByText} = render(<ProfileUserEdit />);
    await wait(expect(spyGlobalFetch).toHaveBeenCalled());
    var input = getByLabelText('Stare hasło');
    fireEvent.change(input, {target : {value: "AaaAaaa1111"}});
    var input = getByLabelText('Nowe Hasło');
    fireEvent.change(input, {target : {value: "Aaaa1111"}});
    var input = getByLabelText('Powtórz Hasło');
    fireEvent.change(input, {target : {value: "Aaaa1111"}});
    var passwordEditBtn = getByText('Zmień');
    fireEvent.click(passwordEditBtn);
    await wait(() => alert = getByRole('alert'));
    expect(alert.classList).toContain('show');
    expect(alert.classList).toContain('green-snackbar');
  });

});

describe('site functionality with fetch status 500', () => {

  afterEach(() => {
    jest.clearAllMocks();
    cleanup;
  });

  it('should display error message when unable to change user details', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetchWithError(url, options));
    });
    var spyGetItem = jest.spyOn(Storage.prototype, 'getItem')
    .mockImplementation((key) => {return JSON.stringify(
      {"id":141,
      "firstName":"Andrzej",
      "lastName":"Andrzejewski",
      "email":"a@a.a",
      "roles":["patient","doctor","admin"],
      "token":"zsdscdsw"
      ,"currentRole":"patient"
    })
    });
    const {debug, getByRole, getByLabelText, getByText} = render(<ProfileUserEdit />);
    await wait(expect(spyGlobalFetch).toHaveBeenCalled());
    var input = getByLabelText('Imię');
    fireEvent.change(input, {target : {value: "Aneta"}});
    expect(input.value).toEqual('Aneta');
    var userEditBtn = getByText('Edytuj');
    fireEvent.click(userEditBtn);
    await wait(() => alert = getByRole('alert'));
    expect(alert.classList).toContain('show');
    expect(alert.classList).toContain('red-snackbar');
  });

  it('should display error message when unable to change password', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetchWithError(url, options));
    });
    var spyGetItem = jest.spyOn(Storage.prototype, 'getItem')
    .mockImplementation((key) => {return JSON.stringify(
      {"id":141,
      "firstName":"Andrzej",
      "lastName":"Andrzejewski",
      "email":"a@a.a",
      "roles":["patient","doctor","admin"],
      "token":"zsdscdsw"
      ,"currentRole":"patient"
    })
    });
    const {debug, getByRole, getByLabelText, getByText} = render(<ProfileUserEdit />);
    await wait(expect(spyGlobalFetch).toHaveBeenCalled());
    var input = getByLabelText('Stare hasło');
    fireEvent.change(input, {target : {value: "AaaAaaa1111"}});
    var input = getByLabelText('Nowe Hasło');
    fireEvent.change(input, {target : {value: "Aaaa1111"}});
    var input = getByLabelText('Powtórz Hasło');
    fireEvent.change(input, {target : {value: "Aaaa1111"}});
    var passwordEditBtn = getByText('Zmień');
    fireEvent.click(passwordEditBtn);
    await wait(() => alert = getByRole('alert'));
    expect(alert.classList).toContain('show');
    expect(alert.classList).toContain('red-snackbar');
  });

});
