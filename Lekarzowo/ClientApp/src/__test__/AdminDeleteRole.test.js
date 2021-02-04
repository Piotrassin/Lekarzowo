import AdminDeleteRole from '../AdminDeleteRole.js';
import {shallow, mount, debug} from 'enzyme';
import {act, render, fireEvent, wait, cleanup} from '@testing-library/react';
import React from 'react';
import MockBackend from '../__mocks__/MockBackend.js.js';



it('renders', () => {
  shallow(<AdminDeleteRole  />);
});

describe('site functionality with fetch status 200', () => {

  afterEach(() => {
    jest.clearAllMocks();
    cleanup;
  });

  it('should display validation erros when inputs are not filled in', async () => {
    const {debug, getByText, getByRole} = render(<AdminDeleteRole />);
    var btn = getByText('Wycofaj');
    fireEvent.click(btn)
    await wait(() => alert = getByRole('alert'));
    expect(alert.classList).toContain('show');
    expect(alert.classList).toContain('red-snackbar');
  });


  it('should be able to fill inputs', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const {debug, getByRole, getByTestId, getByLabelText} = render(<AdminDeleteRole />);
    var comboBoxInput = getByTestId('autocomplete-user');
    var inputCity = getByLabelText('Użytkownik');
    comboBoxInput.focus();
    fireEvent.change(inputCity, { target: { value: "A" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalledTimes(2))
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(inputCity.value).toEqual('Andrzej Andrzejewski');
    comboBoxInput = getByTestId('autocomplete-role');
    inputCity = getByLabelText('Rola');
    comboBoxInput.focus();
    fireEvent.change(inputCity, { target: { value: "A" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled())
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(inputCity.value).toEqual('Admin');
  });

  it('should display message when succesfuly deleted role', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const {debug, getByRole, getByTestId, getByLabelText, getByText} = render(<AdminDeleteRole />);
    var comboBoxInput = getByTestId('autocomplete-user');
    var inputCity = getByLabelText('Użytkownik');
    comboBoxInput.focus();
    fireEvent.change(inputCity, { target: { value: "A" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalledTimes(2))
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(inputCity.value).toEqual('Andrzej Andrzejewski');
    comboBoxInput = getByTestId('autocomplete-role');
    inputCity = getByLabelText('Rola');
    comboBoxInput.focus();
    fireEvent.change(inputCity, { target: { value: "A" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled())
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(inputCity.value).toEqual('Admin');
    var btn = getByText('Wycofaj');
    fireEvent.click(btn);
    expect(spyGlobalFetch).toHaveBeenCalled();
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

  it('should display error message when unable to delete role', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const {debug, getByRole, getByTestId, getByLabelText, getByText} = render(<AdminDeleteRole />);
    var comboBoxInput = getByTestId('autocomplete-user');
    var inputCity = getByLabelText('Użytkownik');
    comboBoxInput.focus();
    fireEvent.change(inputCity, { target: { value: "A" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalledTimes(2))
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(inputCity.value).toEqual('Andrzej Andrzejewski');
    comboBoxInput = getByTestId('autocomplete-role');
    inputCity = getByLabelText('Rola');
    comboBoxInput.focus();
    fireEvent.change(inputCity, { target: { value: "A" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled())
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(inputCity.value).toEqual('Admin');
    jest.clearAllMocks();
    const spyGlobalFetchError = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetchWithError(url, options));
    });
    var btn = getByText('Wycofaj');
    fireEvent.click(btn);
    expect(spyGlobalFetchError).toHaveBeenCalled();
    await wait(() => alert = getByRole('alert'));
    expect(alert.classList).toContain('show');
    expect(alert.classList).toContain('red-snackbar');
  });

});
