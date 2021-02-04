import AdminDeleteCity from '../AdminDeleteCity.js';
import {shallow, mount, debug} from 'enzyme';
import {act, render, fireEvent, wait, cleanup} from '@testing-library/react';
import React from 'react';
import MockBackend from '../__mocks__/MockBackend.js.js';



it('renders', () => {
  shallow(<AdminDeleteCity  />);
});

describe('site functionality with fetch status 200', () => {

  afterEach(() => {
    jest.clearAllMocks();
    cleanup;
  });

  it('should be able to select edited data', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const {debug, getByRole, getByTestId, getByLabelText} = render(<AdminDeleteCity />);
    var comboBoxInput = getByTestId('autocomplete-cities');
    var inputCity = getByLabelText('Miasto');
    comboBoxInput.focus();
    fireEvent.change(inputCity, { target: { value: "W" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled())
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(inputCity.value).toEqual('Warszawa');
  });

  it('should display message when succesfuly edited city', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const {debug, getByRole, getByTestId, getByLabelText, getByText} = render(<AdminDeleteCity />);
    var comboBoxInput = getByTestId('autocomplete-cities');
    var inputCity = getByLabelText('Miasto');
    comboBoxInput.focus();
    fireEvent.change(inputCity, { target: { value: "W" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled())
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(inputCity.value).toEqual('Warszawa');
    var deleteBtn = getByText('Usuń');
    fireEvent.click(deleteBtn);
    await wait(() => alert = getByRole('alert'));
    expect(alert.classList).toContain('show');
  });

});

describe('site functionality with fetch status 500', () => {

  afterEach(() => {
    jest.clearAllMocks();
    cleanup;
  });

  it('should display error message when unable to edit city', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const {debug, getByRole, getByTestId, getByLabelText, getByText} = render(<AdminDeleteCity />);
    var comboBoxInput = getByTestId('autocomplete-cities');
    var inputCity = getByLabelText('Miasto');
    comboBoxInput.focus();
    fireEvent.change(inputCity, { target: { value: "W" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled())
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(inputCity.value).toEqual('Warszawa');
    jest.clearAllMocks();
    const spyGlobalFetchError = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetchWithError(url, options));
    });
    var deleteBtn = getByText('Usuń');
    fireEvent.click(deleteBtn);
    await wait(() => alert = getByRole('alert'));
    expect(alert.classList).toContain('show');
    expect(alert.classList).toContain('red-snackbar');

  });

});
