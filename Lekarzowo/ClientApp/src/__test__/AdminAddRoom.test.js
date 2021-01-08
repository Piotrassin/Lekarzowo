import AdminAddRoom from '../AdminAddRoom.js';
import {shallow, mount, debug} from 'enzyme';
import {act, render, fireEvent, wait, cleanup} from '@testing-library/react';
import React from 'react';
import MockBackend from '../__mocks__/MockBackend.js.js';



it('renders', () => {
  shallow(<AdminAddRoom  />);
});

describe('site functionality with fetch status 200', () => {

  afterEach(() => {
    jest.clearAllMocks();
    cleanup;
  });

  it('should display validation erros when inputs are not filled in', async () => {
    const {debug, getByText, getByRole} = render(<AdminAddRoom />);
    var btn = getByText('Dodaj');
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
    const {debug, getByRole, getByTestId, getByLabelText} = render(<AdminAddRoom />);
    var comboBoxInput = getByTestId('autocomplete-local');
    var inputCity = getByLabelText('Lokal');
    comboBoxInput.focus();
    fireEvent.change(inputCity, { target: { value: "S" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalledTimes(2))
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(inputCity.value).toEqual('Szpital kliniczny');
    var input = getByRole('spinbutton', {name: 'Numer pokoju'});
    fireEvent.change(input, {target : {value: 5}});
    expect(input.value).toEqual('5');
  });

  it('should display message when succesfuly added room', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const {debug, getByRole, getByTestId, getByLabelText, getByText} = render(<AdminAddRoom />);
    var comboBoxInput = getByTestId('autocomplete-local');
    var inputCity = getByLabelText('Lokal');
    comboBoxInput.focus();
    fireEvent.change(inputCity, { target: { value: "S" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalledTimes(2))
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(inputCity.value).toEqual('Szpital kliniczny');
    var input = getByRole('spinbutton', {name: 'Numer pokoju'});
    fireEvent.change(input, {target : {value: 5}});
    expect(input.value).toEqual('5');
    var btn = getByText('Dodaj');
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

  it('should display error message when unable to add city', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const {debug, getByRole, getByTestId, getByLabelText, getByText} = render(<AdminAddRoom />);
    var comboBoxInput = getByTestId('autocomplete-local');
    var inputCity = getByLabelText('Lokal');
    comboBoxInput.focus();
    fireEvent.change(inputCity, { target: { value: "S" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalledTimes(2))
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(inputCity.value).toEqual('Szpital kliniczny');
    var input = getByRole('spinbutton', {name: 'Numer pokoju'});
    fireEvent.change(input, {target : {value: 5}});
    expect(input.value).toEqual('5');
    jest.clearAllMocks();
    const spyGlobalFetchError = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetchWithError(url, options));
    });
    var btn = getByText('Dodaj');
    fireEvent.click(btn);
    expect(spyGlobalFetchError).toHaveBeenCalled();
    await wait(() => alert = getByRole('alert'));
    expect(alert.classList).toContain('show');
    expect(alert.classList).toContain('red-snackbar');
  });

});
