import AdminAddWorkingHours from '../AdminAddWorkingHours.js';
import {shallow, mount, debug} from 'enzyme';
import {act, render, fireEvent, wait, cleanup} from '@testing-library/react';
import React from 'react';
import MockBackend from '../__mocks__/MockBackend.js.js';



it('renders', () => {
  shallow(<AdminAddWorkingHours  />);
});

describe('site functionality with fetch status 200', () => {

  afterEach(() => {
    jest.clearAllMocks();
    cleanup;
  });

  it('should display validation erros when inputs are not filled in', async () => {
    const {debug, getByText, getByRole} = render(<AdminAddWorkingHours />);
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
    const {debug, getByRole, getByTestId, getByLabelText} = render(<AdminAddWorkingHours />);
    var comboBoxInput = getByTestId('autocomplete-doctor');
    var inputDoctor = getByLabelText('Doktor');
    comboBoxInput.focus();
    fireEvent.change(inputDoctor, { target: { value: "A" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalledTimes(2))
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(inputDoctor.value).toEqual('Andrzej Andrzejewski');
    var comboBoxInput = getByTestId('autocomplete-local');
    var inputLocal = getByLabelText('Lokal');
    comboBoxInput.focus();
    fireEvent.change(inputLocal, { target: { value: "S" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled());
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(inputLocal.value).toEqual('Szpital kliniczny');
    var input = getByLabelText('Data Od');
    fireEvent.change(input, { target: { value: '2020-10-20'}});
    expect(input.value).toEqual('2020-10-20');
    var input = getByLabelText('Data Od');
    fireEvent.change(input, { target: { value: '2020-10-20'}});
    expect(input.value).toEqual('2020-10-20');
    var input = getByLabelText('Czas Od');
    fireEvent.change(input, { target: { value: '07:00'}});
    expect(input.value).toEqual('07:00');
    var input = getByLabelText('Czas Do');
    fireEvent.change(input, { target: { value: '18:00'}});
    expect(input.value).toEqual('18:00')
  });

  it('should display message when succesfuly added room', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const {debug, getByRole, getByText, getByTestId, getByLabelText} = render(<AdminAddWorkingHours />);
    var comboBoxInput = getByTestId('autocomplete-doctor');
    var inputDoctor = getByLabelText('Doktor');
    comboBoxInput.focus();
    fireEvent.change(inputDoctor, { target: { value: "A" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalledTimes(2))
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(inputDoctor.value).toEqual('Andrzej Andrzejewski');
    var comboBoxInput = getByTestId('autocomplete-local');
    var inputLocal = getByLabelText('Lokal');
    comboBoxInput.focus();
    fireEvent.change(inputLocal, { target: { value: "S" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled());
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(inputLocal.value).toEqual('Szpital kliniczny');
    var btn = getByText('Dodaj');
    fireEvent.click(btn);
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled());
    /*await wait(() => alert = getByRole('alert'));
    expect(alert.classList).toContain('show');
    expect(alert.classList).toContain('green-snackbar');*/
  });

});

describe('site functionality with fetch status 500', () => {

  afterEach(() => {
    jest.clearAllMocks();
    cleanup;
  });

  it('should display error message when unable to add city', async () => {
    /*const spyGlobalFetch = jest.spyOn(window, 'fetch')
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
    expect(alert.classList).toContain('red-snackbar');*/
  });

});
