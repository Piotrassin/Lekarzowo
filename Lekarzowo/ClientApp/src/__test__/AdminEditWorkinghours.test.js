import AdminEditWorkingHours from '../AdminEditWorkingHours.js';
import {shallow, mount, debug} from 'enzyme';
import {act, render, fireEvent, wait, cleanup} from '@testing-library/react';
import React from 'react';
import MockBackend from '../__mocks__/MockBackend.js.js';



it('renders', () => {
  shallow(<AdminEditWorkingHours  />);
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
    const {debug, getByRole, getByTestId, getByLabelText} = render(<AdminEditWorkingHours />);
    var comboBoxInput = getByTestId('autocomplete-doctor');
    var input = getByLabelText('Doktor');
    comboBoxInput.focus();
    fireEvent.change(input, { target: { value: "A" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled())
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(input.value).toEqual('Anna Annowska');
    comboBoxInput = getByTestId('autocomplete-local');
    input = getByLabelText('Lokal');
    comboBoxInput.focus();
    fireEvent.change(input, { target: { value: "S" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled())
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(input.value).toEqual('Szpital kliniczny');
    comboBoxInput = getByTestId('autocomplete-workinghours');
    input = getByLabelText('Godziny pracy');
    comboBoxInput.focus();
    fireEvent.change(input, { target: { value: "K" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled())
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(input.value).toEqual('Szpital kliniczny 06.02.2021, 07:30 - 18:00');
  });

  it('should display message when succesfuly edited room', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const {debug, getByRole, getByTestId, getByLabelText, getByText} = render(<AdminEditWorkingHours />);
    var comboBoxInput = getByTestId('autocomplete-doctor');
    var input = getByLabelText('Doktor');
    comboBoxInput.focus();
    fireEvent.change(input, { target: { value: "A" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled())
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(input.value).toEqual('Anna Annowska');
    comboBoxInput = getByTestId('autocomplete-local');
    input = getByLabelText('Lokal');
    comboBoxInput.focus();
    fireEvent.change(input, { target: { value: "S" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled())
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(input.value).toEqual('Szpital kliniczny');
    comboBoxInput = getByTestId('autocomplete-workinghours');
    input = getByLabelText('Godziny pracy');
    comboBoxInput.focus();
    fireEvent.change(input, { target: { value: "K" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled())
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(input.value).toEqual('Szpital kliniczny 06.02.2021, 07:30 - 18:00');
    var editInput = getByLabelText('Czas Od');
    fireEvent.change(editInput, {target:{name: '08:00'}});
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

  it('should display error message when unable to edit room', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const {debug, getByRole, getByTestId, getByLabelText, getByText} = render(<AdminEditWorkingHours />);
    var comboBoxInput = getByTestId('autocomplete-doctor');
    var input = getByLabelText('Doktor');
    comboBoxInput.focus();
    fireEvent.change(input, { target: { value: "A" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled())
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(input.value).toEqual('Anna Annowska');
    comboBoxInput = getByTestId('autocomplete-local');
    input = getByLabelText('Lokal');
    comboBoxInput.focus();
    fireEvent.change(input, { target: { value: "S" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled())
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(input.value).toEqual('Szpital kliniczny');
    comboBoxInput = getByTestId('autocomplete-workinghours');
    input = getByLabelText('Godziny pracy');
    comboBoxInput.focus();
    fireEvent.change(input, { target: { value: "K" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled())
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(input.value).toEqual('Szpital kliniczny 06.02.2021, 07:30 - 18:00');
    var editInput = getByLabelText('Czas Od');
    fireEvent.change(editInput, {target:{name: '08:00'}});
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
