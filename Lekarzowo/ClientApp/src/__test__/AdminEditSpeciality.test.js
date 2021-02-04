import AdminEditSpeciality from '../AdminEditSpeciality.js';
import {shallow, mount, debug} from 'enzyme';
import {act, render, fireEvent, wait, cleanup} from '@testing-library/react';
import React from 'react';
import MockBackend from '../__mocks__/MockBackend.js.js';



it('renders', () => {
  shallow(<AdminEditSpeciality  />);
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
    const {debug, getByRole, getByTestId, getByLabelText} = render(<AdminEditSpeciality />);
    var comboBoxInput = getByTestId('autocomplete-speciality');
    var input = getByLabelText('Specjalizacja');
    comboBoxInput.focus();
    fireEvent.change(input, { target: { value: "K" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled())
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(input.value).toEqual('Kardiologia');
    await wait(expect(spyGlobalFetch).toHaveBeenCalled());
    var editInput = getByLabelText('Nazwa specializacji');
    expect(editInput.value).toEqual('Kardiologia');
  });

  it('should display message when succesfuly edited speciality', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const {debug, getByRole, getByTestId, getByLabelText, getByText} = render(<AdminEditSpeciality />);
    var comboBoxInput = getByTestId('autocomplete-speciality');
    var input = getByLabelText('Specjalizacja');
    comboBoxInput.focus();
    fireEvent.change(input, { target: { value: "K" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled())
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(input.value).toEqual('Kardiologia');
    await wait(expect(spyGlobalFetch).toHaveBeenCalled());
    var editInput = getByLabelText('Nazwa specializacji');
    expect(editInput.value).toEqual('Kardiologia');
    fireEvent.change(editInput, {target:{name: 'Kardiologia 2'}});
    var editBtn = getByText('Edytuj');
    fireEvent.click(editBtn);
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


  it('should display message when unable to edit speciality', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const {debug, getByRole, getByTestId, getByLabelText, getByText} = render(<AdminEditSpeciality />);
    var comboBoxInput = getByTestId('autocomplete-speciality');
    var input = getByLabelText('Specjalizacja');
    comboBoxInput.focus();
    fireEvent.change(input, { target: { value: "K" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled())
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(input.value).toEqual('Kardiologia');
    await wait(expect(spyGlobalFetch).toHaveBeenCalled());
    var editInput = getByLabelText('Nazwa specializacji');
    expect(editInput.value).toEqual('Kardiologia');
    fireEvent.change(editInput, {target:{name: 'Kardiologia 2'}});
    jest.clearAllMocks();
    const spyGlobalFetchError = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetchWithError(url, options));
    });
    var editBtn = getByText('Edytuj');
    fireEvent.click(editBtn);
    await wait(() => alert = getByRole('alert'));
    expect(alert.classList).toContain('show');
    expect(alert.classList).toContain('red-snackbar');

  });

});
